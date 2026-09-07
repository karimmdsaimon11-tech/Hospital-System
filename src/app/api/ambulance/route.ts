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
    const ambulances = await prisma.ambulance.findMany({
      orderBy: { vehicleNumber: 'asc' },
    });
    return NextResponse.json(ambulances, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ambulances' }, { status: 500, headers: noCacheHeaders });
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

    try {
      revalidatePath('/emergency');
      revalidatePath('/');
      revalidatePath('/admin/ambulance');
    } catch (e) {}

    return NextResponse.json(updated, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update ambulance' }, { status: 400, headers: noCacheHeaders });
  }
}

