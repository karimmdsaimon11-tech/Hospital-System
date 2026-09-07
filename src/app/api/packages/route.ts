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
    const packages = await prisma.healthPackage.findMany({
      where: { status: 'Active' },
      orderBy: { price: 'asc' },
    });
    return NextResponse.json(packages, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const pkg = await prisma.healthPackage.create({
      data: {
        name: body.name,
        slug: body.slug || slug,
        price: parseFloat(body.price),
        discount: parseFloat(body.discount) || 0,
        originalPrice: parseFloat(body.originalPrice) || parseFloat(body.price),
        testsIncluded: body.testsIncluded || '',
        description: body.description || '',
        duration: body.duration || '2-3 Hours',
        availability: body.availability || 'Daily 8 AM - 12 PM',
        image: body.image || 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
        isFeatured: Boolean(body.isFeatured),
        status: body.status || 'Active',
      },
    });

    try {
      revalidatePath('/packages');
      revalidatePath('/');
      revalidatePath('/admin/packages');
    } catch (e) {}

    return NextResponse.json(pkg, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create package' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (data.price) data.price = parseFloat(data.price);
    if (data.originalPrice) data.originalPrice = parseFloat(data.originalPrice);
    if (data.discount) data.discount = parseFloat(data.discount);

    const updated = await prisma.healthPackage.update({
      where: { id },
      data,
    });

    try {
      revalidatePath('/packages');
      revalidatePath('/');
      revalidatePath('/admin/packages');
      if (updated.slug) revalidatePath(`/packages/${updated.slug}`);
    } catch (e) {}

    return NextResponse.json(updated, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update package' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Package ID required' }, { status: 400, headers: noCacheHeaders });

    await prisma.healthPackage.delete({ where: { id } });

    try {
      revalidatePath('/packages');
      revalidatePath('/');
      revalidatePath('/admin/packages');
    } catch (e) {}

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete package' }, { status: 400, headers: noCacheHeaders });
  }
}

