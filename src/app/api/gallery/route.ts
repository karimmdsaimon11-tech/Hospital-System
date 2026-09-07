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
    const mediaType = searchParams.get('type');

    const where: any = { isActive: true };
    if (category && category !== 'all') where.category = category;
    if (mediaType && mediaType !== 'all') where.mediaType = mediaType;

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await prisma.galleryItem.create({
      data: {
        title: body.title,
        category: body.category || 'Hospital',
        mediaType: body.mediaType || 'image',
        imageUrl: body.imageUrl,
        videoUrl: body.videoUrl || null,
        description: body.description || null,
        displayOrder: parseInt(body.displayOrder) || 0,
        isActive: body.isActive !== false,
      },
    });

    try {
      revalidatePath('/gallery');
      revalidatePath('/');
      revalidatePath('/admin/gallery');
    } catch (e) {}

    return NextResponse.json(item, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add gallery item' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400, headers: noCacheHeaders });

    await prisma.galleryItem.delete({ where: { id } });

    try {
      revalidatePath('/gallery');
      revalidatePath('/');
      revalidatePath('/admin/gallery');
    } catch (e) {}

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete gallery item' }, { status: 400, headers: noCacheHeaders });
  }
}

