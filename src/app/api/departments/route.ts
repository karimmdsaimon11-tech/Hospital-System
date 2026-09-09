import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
};

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { doctors: true, services: true },
        },
      },
    });
    return NextResponse.json(departments, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = (body.slug || body.name || `dept-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    const department = await prisma.department.create({
      data: {
        name: body.name,
        slug: slug,
        icon: body.icon || 'Stethoscope',
        image: body.image || '',
        shortDesc: body.shortDesc || '',
        description: body.description || '',
        headOfDepartment: body.headOfDepartment || 'Consultant Specialist',
        featured: Boolean(body.featured),
        status: body.status || 'Active',
      },
    });

    await prisma.auditLog.create({
      data: {
        userName: 'Admin',
        action: 'Created Department',
        module: 'Departments',
        recordId: department.id,
        details: `Created department: ${department.name}`,
      },
    }).catch(() => {});

    try {
      revalidatePath('/departments');
      revalidatePath('/');
      revalidatePath('/admin/departments');
    } catch (e) {}

    return NextResponse.json(department, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create department' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    const department = await prisma.department.update({
      where: { id },
      data,
    });

    try {
      revalidatePath('/departments');
      revalidatePath('/');
      revalidatePath('/admin/departments');
      if (department.slug) revalidatePath(`/departments/${department.slug}`);
    } catch (e) {}

    return NextResponse.json(department, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update department' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Department ID required' }, { status: 400, headers: noCacheHeaders });

    // Safely delete associated records first if any, then the department
    await prisma.$transaction(async (tx) => {
      await tx.service.deleteMany({ where: { departmentId: id } });
      await tx.appointment.deleteMany({ where: { departmentId: id } });
      await tx.doctor.deleteMany({ where: { departmentId: id } });
      await tx.department.delete({ where: { id } });
    });

    await prisma.auditLog.create({
      data: {
        userName: 'Admin',
        action: 'Deleted Department',
        module: 'Departments',
        recordId: id,
        details: `Deleted department ID: ${id}`,
      },
    }).catch(() => {});

    try {
      revalidatePath('/departments');
      revalidatePath('/');
      revalidatePath('/admin/departments');
    } catch (e) {}

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete department' }, { status: 400, headers: noCacheHeaders });
  }
}


