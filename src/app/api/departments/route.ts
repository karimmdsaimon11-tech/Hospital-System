import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
    return NextResponse.json(departments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const department = await prisma.department.create({
      data: {
        name: body.name,
        slug: body.slug || slug,
        icon: body.icon || 'Stethoscope',
        image: body.image || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
        shortDesc: body.shortDesc,
        description: body.description,
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
    });

    return NextResponse.json(department);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create department' }, { status: 400 });
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

    return NextResponse.json(department);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update department' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Department ID required' }, { status: 400 });

    await prisma.department.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete department' }, { status: 400 });
  }
}
