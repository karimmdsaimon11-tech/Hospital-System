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
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    if (slug) {
      const post = await prisma.blogPost.findUnique({ where: { slug } });
      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404, headers: noCacheHeaders });
      
      // Increment views
      await prisma.blogPost.update({
        where: { slug },
        data: { views: { increment: 1 } },
      }).catch(() => {});
      return NextResponse.json(post, { headers: noCacheHeaders });
    }

    const where: any = {};
    if (category && category !== 'all') where.category = category;
    if (tag) where.tags = { contains: tag };

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });
    const categories = await prisma.blogCategory.findMany();

    return NextResponse.json({ posts, categories }, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug || slug,
        featuredImage: body.featuredImage || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
        category: body.category || 'Healthy Lifestyle',
        tags: body.tags || 'health, medical, care',
        author: body.author || 'Medical Editorial Board',
        shortDesc: body.shortDesc || '',
        content: body.content || '',
        status: body.status || 'Published',
      },
    });

    try {
      revalidatePath('/blog');
      revalidatePath('/');
      revalidatePath('/admin/blog');
    } catch (e) {}

    return NextResponse.json(post, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create post' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const post = await prisma.blogPost.update({
      where: { id },
      data,
    });

    try {
      revalidatePath('/blog');
      revalidatePath('/');
      revalidatePath('/admin/blog');
      if (post.slug) revalidatePath(`/blog/${post.slug}`);
    } catch (e) {}

    return NextResponse.json(post, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update post' }, { status: 400, headers: noCacheHeaders });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400, headers: noCacheHeaders });

    await prisma.blogPost.delete({ where: { id } });

    try {
      revalidatePath('/blog');
      revalidatePath('/');
      revalidatePath('/admin/blog');
    } catch (e) {}

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete post' }, { status: 400, headers: noCacheHeaders });
  }
}

