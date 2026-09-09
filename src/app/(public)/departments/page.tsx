import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ChevronRight, HeartPulse } from 'lucide-react';
import DepartmentsDirectory from '@/components/departments/DepartmentsDirectory';

export const revalidate = 0;

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany({
    where: { status: 'Active' },
    include: {
      _count: { select: { doctors: true, services: true } },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Departments</span>
        </nav>

        <div className="border-b border-gray-200/80 pb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Clinical Specialties</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Medical Departments
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-2xl">
            Our multi-disciplinary clinical departments provide comprehensive diagnostics, surgeries, and rehabilitation across {departments.length}+ clinical divisions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DepartmentsDirectory initialDepartments={departments} />
      </div>
    </div>
  );
}
