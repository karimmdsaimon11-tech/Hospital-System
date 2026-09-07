import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ChevronRight, Stethoscope } from 'lucide-react';
import DoctorsDirectoryClient from '@/components/doctors/DoctorsDirectoryClient';

export const revalidate = 0;

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: { q?: string; dept?: string };
}) {
  const [doctors, departments] = await Promise.all([
    prisma.doctor.findMany({
      where: { status: 'Active' },
      include: { department: true, branch: true, schedules: true },
      orderBy: { name: 'asc' },
    }),
    prisma.department.findMany({
      where: { status: 'Active' },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="min-h-screen bg-background py-10">
      {/* 69. Page Header & Breadcrumb (Section 69) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">4 Columns Doctors</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200/80 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Medical Specialists Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
              Meet Our Doctors
            </h1>
            <p className="mt-2 text-sm text-text-secondary max-w-2xl">
              Consult with internationally renowned professors and board-certified consultants across all clinical sub-specialties.
            </p>
          </div>
        </div>
      </div>

      {/* 69. Interactive Filter & 4-Column Responsive Doctor Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DoctorsDirectoryClient
          initialDoctors={doctors}
          departments={departments}
          initialQuery={searchParams.q || ''}
          initialDept={searchParams.dept || 'all'}
        />
      </div>
    </div>
  );
}
