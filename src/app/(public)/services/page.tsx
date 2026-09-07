import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { ChevronRight, Activity, ArrowRight, Calendar } from 'lucide-react';

export const revalidate = 0;

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { status: 'Published' },
    include: { department: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-background py-10">
      {/* 68. Page Header & Breadcrumbs (Section 68) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">3 Columns Services</span>
        </nav>

        <div className="border-b border-gray-200/80 pb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Clinical Treatments & Diagnostics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            3 Columns Services
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-2xl">
            State-of-the-art diagnostic, clinical, pharmaceutical and emergency surgical interventions available 24 hours a day.
          </p>
        </div>
      </div>

      {/* 68. 3-Column Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                <Image
                  src={srv.image}
                  alt={srv.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {srv.price > 0 && (
                  <div className="absolute top-3 right-3 bg-dark/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-black text-white shadow">
                    From ${srv.price}
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-primary shadow-sm">
                  {srv.department?.name || 'Specialty Service'}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-dark group-hover:text-primary transition line-clamp-1">
                    {srv.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3">
                    {srv.shortDesc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/services/${srv.slug}`}
                    className="text-xs font-bold text-dark hover:text-primary transition flex items-center space-x-1"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  </Link>

                  <Link
                    href="/appointment"
                    className="px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Book Service</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
