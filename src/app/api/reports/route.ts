import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const category = searchParams.get('category');

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (category && category !== 'all') where.category = category;

    const reports = await prisma.medicalReport.findMany({
      where,
      include: { patient: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch medical reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reportNumber = `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const report = await prisma.medicalReport.create({
      data: {
        reportNumber,
        patientId: body.patientId,
        title: body.title,
        category: body.category || 'Diagnostic Test',
        fileUrl: body.fileUrl || 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
        testDate: body.testDate || new Date().toISOString().split('T')[0],
        doctorName: body.doctorName || 'Dr. Addison Alexander',
        notes: body.notes || null,
      },
      include: { patient: true },
    });

    await prisma.auditLog.create({
      data: {
        userName: 'Lab Staff',
        action: 'Uploaded Report',
        module: 'Medical Reports',
        recordId: report.id,
        details: `Uploaded ${report.title} for patient ${report.patient.name}`,
      },
    });

    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to upload report' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Report ID required' }, { status: 400 });

    await prisma.medicalReport.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete report' }, { status: 400 });
  }
}
