import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ChevronRight, Activity } from 'lucide-react';
import ServicesDirectory from '@/components/services/ServicesDirectory';

export const revalidate = 0;

export default async function ServicesPage() {
  const [services, departments] = await Promise.all([
    prisma.service.findMany({
      where: { status: 'Published' },
      include: { department: true },
      orderBy: { name: 'asc' },
    }),
    prisma.department.findMany({
      where: { status: 'Active' },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Services</span>
        </nav>

        <div className="border-b border-gray-200/80 pb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Clinical Treatments & Diagnostics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Our Advanced Services
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-2xl">
            State-of-the-art diagnostic, clinical, pharmaceutical and emergency surgical interventions across {services.length}+ clinical procedures.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServicesDirectory initialServices={services} departments={departments} />
      </div>
    </div>
  );
}
