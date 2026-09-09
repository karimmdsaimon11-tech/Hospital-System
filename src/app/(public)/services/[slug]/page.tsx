import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ChevronRight, Calendar, ArrowRight, Activity, CheckCircle2, User } from 'lucide-react';

export const revalidate = 0;

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = await prisma.service.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
    include: {
      department: {
        include: { doctors: true },
      },
    },
  });

  if (!service) notFound();

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-6">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/services" className="hover:text-primary transition">Services</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">{service.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-soft">
              <div className="relative h-80 sm:h-96 w-full bg-gray-100">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    {service.department.name}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-dark tracking-tight mt-1">
                    {service.name}
                  </h1>
                </div>

                <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed space-y-4">
                  <p className="text-base text-dark font-medium leading-relaxed">
                    {service.shortDesc}
                  </p>
                  <p>{service.description}</p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block font-medium">Standard Consultation / Baseline Fee</span>
                    <strong className="text-2xl font-black text-dark">${service.price}</strong>
                  </div>
                  <Link
                    href={`/appointment?dept=${service.departmentId}`}
                    className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md transition"
                  >
                    Schedule Treatment
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Associated Department Specialists */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft space-y-4">
              <h3 className="text-base font-extrabold text-dark border-b border-gray-100 pb-3">
                Assigned Specialists
              </h3>
              <div className="space-y-3">
                {service.department.doctors.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-teal-50 border border-teal-100 flex items-center justify-center">
                      {doc.photo ? (
                        <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-teal-600/50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-dark truncate">{doc.name}</h4>
                      <p className="text-[11px] text-primary truncate">{doc.specialty}</p>
                    </div>
                    <Link
                      href={`/appointment?doctorId=${doc.id}`}
                      className="text-[11px] px-2.5 py-1 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded font-bold transition"
                    >
                      Book
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
