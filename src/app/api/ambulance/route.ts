import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const ambulances = await prisma.ambulance.findMany({
      orderBy: { vehicleNumber: 'asc' },
    });
    return NextResponse.json(ambulances);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ambulances' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, isAvailable, driverPhone } = body;

    const updated = await prisma.ambulance.update({
      where: { id },
      data: {
        isAvailable: Boolean(isAvailable),
        ...(driverPhone ? { driverPhone } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update ambulance' }, { status: 400 });
  }
}
