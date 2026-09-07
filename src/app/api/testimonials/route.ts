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
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(testimonials, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const testimonial = await prisma.testimonial.create({
      data: {
        patientName: body.patientName,
        patientRole: body.patientRole || 'Patient',
        photo: body.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        review: body.review || '',
        rating: parseInt(body.rating) || 5,
        department: body.department || 'General Medicine',
        isApproved: body.isApproved !== undefined ? Boolean(body.isApproved) : true,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : true,
      },
    });

    try {
      revalidatePath('/testimonials');
      revalidatePath('/');
      revalidatePath('/admin/testimonials');
    } catch (e) {}

    return NextResponse.json(testimonial, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit testimonial' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const updated = await prisma.testimonial.update({
      where: { id },
      data,
    });

    try {
      revalidatePath('/testimonials');
      revalidatePath('/');
      revalidatePath('/admin/testimonials');
    } catch (e) {}

    return NextResponse.json(updated, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update testimonial' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400, headers: noCacheHeaders });

    await prisma.testimonial.delete({ where: { id } });

    try {
      revalidatePath('/testimonials');
      revalidatePath('/');
      revalidatePath('/admin/testimonials');
    } catch (e) {}

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete testimonial' }, { status: 400, headers: noCacheHeaders });
  }
}

