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
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (source && source !== 'all') where.source = source;

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(leads, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch CRM leads' }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        source: body.source || 'Contact Form',
        interestedService: body.interestedService || null,
        assignedStaff: body.assignedStaff || 'Front Desk',
        status: body.status || 'New',
        notes: body.notes || body.message || null,
        followUpDate: body.followUpDate || null,
      },
    });

    await prisma.notification.create({
      data: {
        title: 'New Lead Captured',
        message: `${lead.name} submitted inquiry via ${lead.source}.`,
        type: 'Lead',
        link: '/admin/leads',
      },
    }).catch(() => {});

    try {
      revalidatePath('/admin/leads');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json(lead, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to capture lead' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const updated = await prisma.lead.update({
      where: { id },
      data,
    });

    try {
      revalidatePath('/admin/leads');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json(updated, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update lead' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Lead ID required' }, { status: 400, headers: noCacheHeaders });

    await prisma.lead.delete({ where: { id } });

    try {
      revalidatePath('/admin/leads');
      revalidatePath('/admin');
    } catch (e) {}

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete lead' }, { status: 400, headers: noCacheHeaders });
  }
}

