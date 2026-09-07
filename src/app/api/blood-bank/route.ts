import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const inventory = await prisma.bloodInventory.findMany({
      orderBy: { bloodGroup: 'asc' },
    });
    const requests = await prisma.bloodRequest.findMany({
      orderBy: { requestDate: 'desc' },
      take: 10,
    });
    return NextResponse.json({ inventory, requests });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blood bank data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, unitsAvailable, status } = body;

    const updated = await prisma.bloodInventory.update({
      where: { id },
      data: {
        unitsAvailable: parseInt(unitsAvailable),
        status: status || (unitsAvailable < 10 ? 'Critical' : 'Normal'),
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update blood inventory' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const req = await prisma.bloodRequest.create({
      data: {
        patientName: body.patientName,
        bloodGroup: body.bloodGroup,
        unitsRequired: parseInt(body.unitsRequired) || 1,
        hospital: body.hospital || 'MedicalPress Main',
        contactPhone: body.contactPhone,
        status: 'Pending',
      },
    });

    await prisma.notification.create({
      data: {
        title: 'Emergency Blood Request',
        message: `${body.patientName} urgently requested ${body.unitsRequired} units of ${body.bloodGroup}.`,
        type: 'System',
        link: '/admin/blood-bank',
      },
    });

    return NextResponse.json(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create blood request' }, { status: 400 });
  }
}
