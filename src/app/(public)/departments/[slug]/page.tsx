import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ChevronRight, Calendar, ArrowRight, UserCheck, Activity } from 'lucide-react';

export const revalidate = 0;

export default async function DepartmentDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const dept = await prisma.department.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
    include: {
      doctors: { where: { status: 'Active' } },
      services: { where: { status: 'Published' } },
    },
  });

  if (!dept) notFound();

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-6">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/departments" className="hover:text-primary transition">Departments</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">{dept.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-soft">
              <div className="relative h-72 sm:h-96 w-full bg-gray-100">
                <Image src={dept.image} alt={dept.name} fill priority className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Department of Excellence</span>
                  <h1 className="text-2xl sm:text-4xl font-black mt-1">{dept.name}</h1>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-dark mb-2">Department Overview</h2>
                  <p className="text-sm text-text-secondary leading-relaxed">{dept.description}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                  <strong className="text-dark font-bold">Head of Department: </strong>
                  <span className="text-text-secondary">{dept.headOfDepartment}</span>
                </div>
              </div>
            </div>

            {/* Department Doctors */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-dark tracking-tight">
                Consultants & Physicians in {dept.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dept.doctors.map((doc) => (
                  <div key={doc.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-soft flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      <Image src={doc.photo} alt={doc.name} fill className="object-cover object-top" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-dark truncate">{doc.name}</h3>
                      <p className="text-xs text-primary truncate">{doc.specialty}</p>
                      <Link
                        href={`/appointment?doctorId=${doc.id}`}
                        className="mt-2 inline-flex items-center space-x-1 text-xs font-bold text-text-secondary hover:text-primary"
                      >
                        <span>Book Slot</span>
                        <ArrowRight className="w-3 h-3 text-primary" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Services provided */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft space-y-3">
              <h3 className="text-base font-extrabold text-dark border-b border-gray-100 pb-2">
                Specialized Services
              </h3>
              <ul className="space-y-2 text-xs">
                {dept.services.map((s) => (
                  <li key={s.id}>
                    <Link href={`/services/${s.slug}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-dark hover:text-primary transition">
                      <span>{s.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary-hover text-white rounded-2xl p-6 shadow-md space-y-3">
              <Calendar className="w-8 h-8" />
              <h3 className="text-lg font-bold">Schedule an Appointment</h3>
              <p className="text-xs text-white/90">
                Direct booking with {dept.name} specialists. No referral needed for most outpatient clinics.
              </p>
              <Link
                href={`/appointment?dept=${dept.id}`}
                className="inline-block px-4 py-2 bg-white text-primary text-xs font-black rounded-lg shadow-sm hover:bg-gray-50 transition"
              >
                Make Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
