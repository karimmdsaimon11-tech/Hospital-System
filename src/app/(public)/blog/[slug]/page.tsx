import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ChevronRight, Calendar, User, Eye, ArrowLeft, Tag } from 'lucide-react';

export const revalidate = 0;

export default async function BlogPostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) notFound();

  // Increment view count
  await prisma.blogPost.update({
    where: { slug: params.slug },
    data: { views: { increment: 1 } },
  }).catch(() => {});

  const tags = post.tags.split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-6">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/blog" className="hover:text-primary transition">Blog</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold line-clamp-1">{post.title}</span>
        </nav>

        <article className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-soft">
          <div className="relative h-80 sm:h-[420px] w-full bg-gray-100">
            <Image src={post.featuredImage} alt={post.title} fill priority className="object-cover" />
            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              {post.category}
            </div>
          </div>

          <div className="p-6 sm:p-12 space-y-6">
            <div className="flex items-center space-x-4 text-xs text-gray-500 pb-4 border-b border-gray-100">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>By {post.author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span>{post.views + 1} views</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-dark tracking-tight leading-tight">
              {post.title}
            </h1>

            <div
              className="prose prose-sm sm:prose-base max-w-none text-text-secondary leading-relaxed space-y-4 pt-4 border-t border-gray-100"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {tags.length > 0 && (
              <div className="pt-8 border-t border-gray-100 flex items-center space-x-2">
                <Tag className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-dark">Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tg) => (
                    <span key={tg} className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded-md">
                      #{tg}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Articles</span>
              </Link>
              <Link
                href="/appointment"
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow transition"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
