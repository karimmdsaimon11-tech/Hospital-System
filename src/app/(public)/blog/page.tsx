import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { ChevronRight, FileText, ArrowRight, Clock, Eye } from 'lucide-react';

export const revalidate = 0;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; tag?: string };
}) {
  const where: any = { status: 'Published' };
  if (searchParams.category) where.category = searchParams.category;
  if (searchParams.tag) where.tags = { contains: searchParams.tag };

  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.blogCategory.findMany(),
  ]);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Health News & Clinical Blog</span>
        </nav>

        <div className="border-b border-gray-200/80 pb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Health Insights & Medical Research</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Latest Medical Articles
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-2xl">
            Evidence-based medical publications, lifestyle wellness guidance, and hospital innovation briefings.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Posts Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-52 w-full bg-gray-100">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-primary shadow-sm">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-gray-400 font-semibold mb-2 flex items-center space-x-2">
                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>By {post.author}</span>
                      </div>
                      <h2 className="text-base font-extrabold text-dark group-hover:text-primary transition line-clamp-2 leading-snug">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm text-text-secondary line-clamp-3 leading-relaxed">
                        {post.shortDesc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-bold text-primary flex items-center space-x-1 hover:underline"
                      >
                        <span>Read Full Article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <span className="text-[11px] text-gray-400 flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.views} views</span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft space-y-3">
              <h3 className="text-base font-bold text-dark border-b border-gray-100 pb-2">
                Categories
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/blog" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-dark font-semibold">
                    <span>All Articles</span>
                    <span>{posts.length}</span>
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/blog?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-dark hover:text-primary transition"
                    >
                      <span>{cat.name}</span>
                      <span className="text-gray-400 font-mono">({cat.postCount})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags Cloud */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft space-y-3">
              <h3 className="text-base font-bold text-dark border-b border-gray-100 pb-2">
                Popular Healthcare Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {['cardiology', 'diet', 'wellness', 'pediatrics', 'orthopedics', 'stroke', 'laser', 'diabetes'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded-md text-xs font-semibold text-gray-600 transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
