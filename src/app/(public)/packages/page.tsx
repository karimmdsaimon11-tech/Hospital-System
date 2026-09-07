import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { ChevronRight, Sparkles, Check, Clock, Calendar, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function PackagesPage() {
  const packages = await prisma.healthPackage.findMany({
    where: { status: 'Active' },
    orderBy: { price: 'asc' },
  });

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Health Packages</span>
        </nav>

        <div className="border-b border-gray-200/80 pb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preventive Wellness & Diagnostics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Health Checkup Packages
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-2xl">
            Early detection is the most powerful medicine. Explore our packaged health screenings bundled at up to 30% savings.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const tests = pkg.testsIncluded.split('\n').filter(Boolean);
            return (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
              >
                <div className="relative h-48 w-full bg-gray-100">
                  <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                  {pkg.discount > 0 && (
                    <div className="absolute top-3 right-3 bg-coral text-white text-xs font-black px-2.5 py-1 rounded-full shadow">
                      {pkg.discount}% OFF
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-black text-dark">{pkg.name}</h2>
                    <p className="mt-2 text-xs text-text-secondary leading-relaxed">{pkg.description}</p>

                    <div className="mt-4 flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-primary">${pkg.price}</span>
                      {pkg.originalPrice > pkg.price && (
                        <span className="text-sm text-gray-400 line-through">${pkg.originalPrice}</span>
                      )}
                    </div>

                    <div className="mt-4 py-2 border-t border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>{pkg.duration}</span>
                      </span>
                      <span>{pkg.availability}</span>
                    </div>

                    {/* Tests Included Checklist */}
                    <div className="mt-4 space-y-2">
                      <h3 className="text-xs font-bold text-dark uppercase tracking-wider">Key Tests Included:</h3>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        {tests.slice(0, 6).map((test, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{test}</span>
                          </li>
                        ))}
                        {tests.length > 6 && (
                          <li className="text-[11px] font-semibold text-primary pl-5">
                            + {tests.length - 6} more tests included
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-100">
                    <Link
                      href={`/appointment?package=${encodeURIComponent(pkg.name)}`}
                      className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold flex items-center justify-center space-x-2 shadow-md transition"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book Package Now</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
