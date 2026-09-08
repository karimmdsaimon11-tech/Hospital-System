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
    const search = searchParams.get('search');

    const where: any = { status: 'Active' };

    if (departmentId && departmentId !== 'all') {
      where.departmentId = departmentId;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { specialty: { contains: search, mode: 'insensitive' } },
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        department: true,
        branch: true,
        schedules: true,
        leaves: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(doctors, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const doctor = await prisma.doctor.create({
      data: {
        name: body.name,
        slug: body.slug || slug,
        photo: body.photo || '',
        specialty: body.specialty,
        departmentId: body.departmentId,
        branchId: body.branchId || null,
        experience: body.experience || '10+ Years Experience',
        qualification: body.qualification || 'MD, Board Certified',
        visitingHours: body.visitingHours || 'Mon - Fri: 09:00 AM - 01:00 PM',
        consultationFee: parseFloat(body.consultationFee) || 120.0,
        phone: body.phone || '+1-800-654-3210',
        email: body.email || 'doctor@medicalpress.com',
        bio: body.bio || 'Experienced clinical specialist dedicated to exceptional patient outcomes.',
        featured: Boolean(body.featured),
        status: body.status || 'Active',
      },
    });

    // Create default schedule for new doctor (Mon, Wed, Fri)
    await prisma.schedule.createMany({
      data: [
        { doctorId: doctor.id, dayOfWeek: 1, startTime: '09:00', endTime: '13:00', slotDuration: 30, maxPatients: 10 },
        { doctorId: doctor.id, dayOfWeek: 3, startTime: '14:00', endTime: '18:00', slotDuration: 30, maxPatients: 10 },
        { doctorId: doctor.id, dayOfWeek: 5, startTime: '09:00', endTime: '12:00', slotDuration: 30, maxPatients: 8 },
      ],
    });

    await prisma.auditLog.create({
      data: {
        userName: 'Admin',
        action: 'Added Doctor',
        module: 'Doctors',
        recordId: doctor.id,
        details: `Added new doctor: ${doctor.name} (${doctor.specialty})`,
      },
    });

    try {
      revalidatePath('/doctors');
      revalidatePath('/');
      revalidatePath('/admin/doctors');
    } catch (e) {}

    return NextResponse.json(doctor, { headers: noCacheHeaders });
  } catch (error: any) {
    console.error('Failed to create doctor:', error);
    return NextResponse.json({ error: error.message || 'Failed to create doctor' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, department, branch, schedules, leaves, appointments, prescriptions, ...data } = body;

    if (data.consultationFee) {
      data.consultationFee = parseFloat(data.consultationFee);
    }

    const doctor = await prisma.doctor.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userName: 'Admin',
        action: 'Updated Doctor',
        module: 'Doctors',
        recordId: doctor.id,
        details: `Updated details for doctor: ${doctor.name}`,
      },
    }).catch(() => {});

    try {
      revalidatePath('/doctors');
      revalidatePath('/');
      revalidatePath('/admin/doctors');
      if (doctor.slug) revalidatePath(`/doctors/${doctor.slug}`);
    } catch (e) {}

    return NextResponse.json(doctor, { headers: noCacheHeaders });
  } catch (error: any) {
    console.error('Failed to update doctor:', error);
    return NextResponse.json({ error: error.message || 'Failed to update doctor' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400, headers: noCacheHeaders });

    const doctor = await prisma.doctor.findUnique({ where: { id } });
    await prisma.doctor.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userName: 'Admin',
        action: 'Deleted Doctor',
        module: 'Doctors',
        recordId: id,
        details: `Removed doctor: ${doctor?.name || id}`,
      },
    }).catch(() => {});

    try {
      revalidatePath('/doctors');
      revalidatePath('/');
      revalidatePath('/admin/doctors');
    } catch (e) {}

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error: any) {
    console.error('Failed to delete doctor:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete doctor' }, { status: 400, headers: noCacheHeaders });
  }
}

