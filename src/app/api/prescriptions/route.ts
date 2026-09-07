import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;

    const prescriptions = await prisma.prescription.findMany({
      where,
      include: {
        patient: true,
        doctor: { include: { department: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(prescriptions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const count = await prisma.prescription.count();
    const prescriptionNumber = `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const prescription = await prisma.prescription.create({
      data: {
        prescriptionNumber,
        appointmentId: body.appointmentId || null,
        patientId: body.patientId,
        doctorId: body.doctorId,
        diagnosis: body.diagnosis,
        instructions: body.instructions || 'Take medications as directed. Rest and hydrate.',
        followUpDate: body.followUpDate || null,
        items: {
          create: (body.items || []).map((item: any) => ({
            medicineName: item.medicineName,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions || null,
          })),
        },
      },
      include: {
        items: true,
        patient: true,
        doctor: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userName: 'Doctor',
        action: 'Created Prescription',
        module: 'Prescriptions',
        recordId: prescription.id,
        details: `Issued prescription ${prescriptionNumber} for patient ${prescription.patient.name}`,
      },
    });

    return NextResponse.json(prescription);
  } catch (error: any) {
    console.error('Failed to create prescription:', error);
    return NextResponse.json({ error: error.message || 'Failed to create prescription' }, { status: 400 });
  }
}
