import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const patientId = searchParams.get('patientId');

    if (patientId) {
      const patient = await prisma.patient.findUnique({
        where: { patientId },
        include: {
          appointments: {
            include: { doctor: true, department: true },
            orderBy: { appointmentDate: 'desc' },
          },
          prescriptions: {
            include: { doctor: true, items: true },
            orderBy: { createdAt: 'desc' },
          },
          reports: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
      return NextResponse.json(patient);
    }

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { patientId: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const patients = await prisma.patient.findMany({
      where,
      include: {
        _count: {
          select: { appointments: true, prescriptions: true, reports: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const count = await prisma.patient.count();
    const patientId = body.patientId || `MED-${90200 + count + 1}`;

    const patient = await prisma.patient.create({
      data: {
        patientId,
        name: body.name,
        photo: body.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        dob: body.dob || '1990-01-01',
        gender: body.gender || 'Other',
        bloodGroup: body.bloodGroup || 'O+',
        phone: body.phone,
        email: body.email,
        address: body.address || 'New York, NY',
        emergencyContact: body.emergencyContact || 'Family Member',
        emergencyPhone: body.emergencyPhone || body.phone,
        allergies: body.allergies || null,
        medicalHistory: body.medicalHistory || null,
      },
    });

    return NextResponse.json(patient);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create patient' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, _count, appointments, prescriptions, reports, ...data } = body;

    const patient = await prisma.patient.update({
      where: { id },
      data,
    });

    return NextResponse.json(patient);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update patient' }, { status: 400 });
  }
}
