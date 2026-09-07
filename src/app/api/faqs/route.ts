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
    const category = searchParams.get('category');

    const where: any = { isActive: true };
    if (category && category !== 'all') where.category = category;

    const faqs = await prisma.faq.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(faqs, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const count = await prisma.faq.count();

    const faq = await prisma.faq.create({
      data: {
        question: body.question,
        answer: body.answer,
        category: body.category || 'General',
        displayOrder: parseInt(body.displayOrder) || count + 1,
        isActive: body.isActive !== false,
      },
    });

    try {
      revalidatePath('/faq');
      revalidatePath('/');
      revalidatePath('/admin/faqs');
    } catch (e) {}

    return NextResponse.json(faq, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create FAQ' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const updated = await prisma.faq.update({
      where: { id },
      data,
    });

    try {
      revalidatePath('/faq');
      revalidatePath('/');
      revalidatePath('/admin/faqs');
    } catch (e) {}

    return NextResponse.json(updated, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update FAQ' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400, headers: noCacheHeaders });

    await prisma.faq.delete({ where: { id } });

    try {
      revalidatePath('/faq');
      revalidatePath('/');
      revalidatePath('/admin/faqs');
    } catch (e) {}

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete FAQ' }, { status: 400, headers: noCacheHeaders });
  }
}

