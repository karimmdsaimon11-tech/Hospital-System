import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { ChevronRight, HeartPulse, ArrowRight } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
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
            Our multi-disciplinary clinical departments provide comprehensive diagnostics, surgeries, and rehabilitation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <Image
                  src={dept.image}
                  alt={dept.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/75 via-transparent to-transparent" />
                <h3 className="absolute bottom-4 left-5 right-5 text-xl font-extrabold text-white line-clamp-1">
                  {dept.name}
                </h3>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3">
                    {dept.shortDesc}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                    <div><strong>Head:</strong> {dept.headOfDepartment}</div>
                    <div><strong>Faculty:</strong> {dept._count.doctors} Specialists • {dept._count.services} Services</div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/departments/${dept.slug}`}
                    className="text-xs font-bold text-dark hover:text-primary transition flex items-center space-x-1"
                  >
                    <span>View Department</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  </Link>
                  <Link
                    href={`/appointment?dept=${dept.id}`}
                    className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition shadow-sm"
                  >
                    Book Care
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
