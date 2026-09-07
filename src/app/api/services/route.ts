import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const service = await prisma.service.create({
      data: {
        name: body.name,
        slug: body.slug || slug,
        icon: body.icon || 'Activity',
        image: body.image || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
        shortDesc: body.shortDesc,
        description: body.description,
        price: parseFloat(body.price) || 0,
        departmentId: body.departmentId,
        featured: Boolean(body.featured),
        status: body.status || 'Published',
      },
    });

    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create service' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, department, ...data } = body;
    if (data.price) data.price = parseFloat(data.price);

    const service = await prisma.service.update({
      where: { id },
      data,
    });

    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update service' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Service ID required' }, { status: 400 });

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete service' }, { status: 400 });
  }
}
