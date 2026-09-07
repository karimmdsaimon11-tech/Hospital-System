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
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const search = searchParams.get('search');

    const where: any = {};

    if (doctorId && doctorId !== 'all') {
      where.doctorId = doctorId;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (date) {
      where.appointmentDate = date;
    }

    if (search) {
      where.OR = [
        { patientName: { contains: search, mode: 'insensitive' } },
        { patientPhone: { contains: search } },
        { appointmentNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: {
          select: { id: true, name: true, specialty: true, photo: true },
        },
        department: {
          select: { id: true, name: true, slug: true },
        },
        branch: {
          select: { id: true, name: true },
        },
        patient: {
          select: { id: true, patientId: true, name: true, phone: true },
        },
      },
      orderBy: [{ appointmentDate: 'desc' }, { timeSlot: 'asc' }],
    });

    return NextResponse.json(appointments, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500, headers: noCacheHeaders });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Required field validation
    if (!body.patientName || !body.patientPhone || !body.patientEmail || !body.doctorId || !body.appointmentDate || !body.timeSlot) {
      return NextResponse.json({ error: 'Please complete all required appointment fields.' }, { status: 400 });
    }

    // Double-booking check
    const existingConflict = await prisma.appointment.findFirst({
      where: {
        doctorId: body.doctorId,
        appointmentDate: body.appointmentDate,
        timeSlot: body.timeSlot,
        status: { notIn: ['Cancelled'] },
      },
    });

    if (existingConflict) {
      return NextResponse.json(
        { error: 'This time slot was just taken by another patient. Please select another slot.' },
        { status: 409 }
      );
    }

    // Get doctor & department details
    const doctor = await prisma.doctor.findUnique({
      where: { id: body.doctorId },
      include: { department: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Selected doctor not found' }, { status: 404 });
    }

    const deptId = body.departmentId || doctor.departmentId;

    // Find or create patient
    let patient = await prisma.patient.findFirst({
      where: {
        OR: [{ email: body.patientEmail }, { phone: body.patientPhone }],
      },
    });

    if (!patient) {
      const pCount = await prisma.patient.count();
      const patientIdCode = `MED-${90200 + pCount + 1}`;
      patient = await prisma.patient.create({
        data: {
          patientId: patientIdCode,
          name: body.patientName,
          phone: body.patientPhone,
          email: body.patientEmail,
          dob: '1990-01-01',
          gender: 'Unspecified',
          bloodGroup: 'Unknown',
          address: 'Hospital Outpatient Clinic',
          emergencyContact: 'Family Member',
          emergencyPhone: body.patientPhone,
        },
      });
    }

    // Generate unique appointment number
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const appointmentNumber = `APT-2026-${randNum}`;

    const appointment = await prisma.appointment.create({
      data: {
        appointmentNumber,
        patientId: patient.id,
        patientName: body.patientName,
        patientPhone: body.patientPhone,
        patientEmail: body.patientEmail,
        doctorId: doctor.id,
        departmentId: deptId,
        branchId: body.branchId || doctor.branchId,
        appointmentDate: body.appointmentDate,
        timeSlot: body.timeSlot,
        type: body.type || 'In-person',
        status: 'Confirmed',
        notes: body.notes || body.message || 'Booked via website appointment form.',
        paymentStatus: 'Pending',
      },
      include: {
        doctor: true,
        department: true,
      },
    });

    // Capture CRM lead automatically
    await prisma.lead.create({
      data: {
        name: body.patientName,
        phone: body.patientPhone,
        email: body.patientEmail,
        source: 'Appointment',
        interestedService: `${doctor.specialty} (${doctor.name})`,
        status: 'Booked',
        notes: `Appointment scheduled for ${body.appointmentDate} at ${body.timeSlot}. Ref: ${appointmentNumber}`,
      },
    });

    // Create system notification for staff
    await prisma.notification.create({
      data: {
        title: 'New Appointment Booked',
        message: `${body.patientName} booked with Dr. ${doctor.name} on ${body.appointmentDate} at ${body.timeSlot}.`,
        type: 'Appointment',
        link: '/admin/appointments',
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userName: body.patientName,
        action: 'Booked Appointment',
        module: 'Appointments',
        recordId: appointment.id,
        details: `Booked appointment ${appointmentNumber} with Dr. ${doctor.name}`,
      },
    }).catch(() => {});

    try {
      revalidatePath('/admin/appointments');
      revalidatePath('/admin');
      revalidatePath('/patient-portal');
      revalidatePath('/appointment');
    } catch (e) {}

    return NextResponse.json(appointment, { headers: noCacheHeaders });
  } catch (error: any) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json({ error: error.message || 'Failed to create appointment' }, { status: 500, headers: noCacheHeaders });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data,
      include: { doctor: true, patient: true },
    });

    await prisma.auditLog.create({
      data: {
        userName: 'Admin',
        action: 'Updated Appointment',
        module: 'Appointments',
        recordId: appointment.id,
        details: `Updated status of ${appointment.appointmentNumber} to ${appointment.status}`,
      },
    }).catch(() => {});

    try {
      revalidatePath('/admin/appointments');
      revalidatePath('/admin');
      revalidatePath('/patient-portal');
    } catch (e) {}

    return NextResponse.json(appointment, { headers: noCacheHeaders });
  } catch (error: any) {
    console.error('Failed to update appointment:', error);
    return NextResponse.json({ error: error.message || 'Failed to update appointment' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Appointment ID required' }, { status: 400, headers: noCacheHeaders });

    await prisma.appointment.delete({ where: { id } });

    try {
      revalidatePath('/admin/appointments');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error: any) {
    console.error('Failed to delete appointment:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete appointment' }, { status: 400, headers: noCacheHeaders });
  }
}
