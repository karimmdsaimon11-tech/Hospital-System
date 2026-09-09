import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    const featured = searchParams.get('featured');

    const where: any = { status: 'Published' };
    if (departmentId && departmentId !== 'all') where.departmentId = departmentId;
    if (featured === 'true') where.featured = true;

    const services = await prisma.service.findMany({
      where,
      include: { department: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(services, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const baseSlug = (body.name || 'service')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = body.slug || `${baseSlug}-${Date.now()}`;

    const service = await prisma.service.create({
      data: {
        name: body.name,
        slug: slug,
        icon: body.icon || 'Activity',
        image: body.image || '',
        shortDesc: body.shortDesc || '',
        description: body.description || '',
        price: parseFloat(body.price) || 0,
        departmentId: body.departmentId,
        featured: Boolean(body.featured),
        status: body.status || 'Published',
      },
      include: { department: true },
    });

    await prisma.auditLog.create({
      data: {
        userName: 'Admin',
        action: 'Created Service',
        module: 'Services',
        recordId: service.id,
        details: `Created service: ${service.name}`,
      },
    }).catch(() => {});

    try {
      revalidatePath('/services');
      revalidatePath('/');
      revalidatePath('/admin/services');
    } catch (e) {}

    return NextResponse.json(service, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create service' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, department, ...data } = body;
    if (data.price !== undefined) data.price = parseFloat(data.price);

    const service = await prisma.service.update({
      where: { id },
      data,
      include: { department: true },
    });

    try {
      revalidatePath('/services');
      revalidatePath('/');
      revalidatePath('/admin/services');
      if (service.slug) revalidatePath(`/services/${service.slug}`);
    } catch (e) {}

    return NextResponse.json(service, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update service' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Service ID required' }, { status: 400, headers: noCacheHeaders });

    await prisma.service.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userName: 'Admin',
        action: 'Deleted Service',
        module: 'Services',
        recordId: id,
        details: `Deleted service ID: ${id}`,
      },
    }).catch(() => {});

    try {
      revalidatePath('/services');
      revalidatePath('/');
      revalidatePath('/admin/services');
    } catch (e) {}

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete service' }, { status: 400, headers: noCacheHeaders });
  }
}

