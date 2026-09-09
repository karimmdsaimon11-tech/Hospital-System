'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Stethoscope, 
  Users,
  ChevronDown
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  slug: string;
  image: string;
  shortDesc: string;
  headOfDepartment: string;
  featured?: boolean;
}

export default function DepartmentsSection({
  departments,
}: {
  departments: Department[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredDepts = departments.filter((dept) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dept.name.toLowerCase().includes(q) ||
      dept.headOfDepartment?.toLowerCase().includes(q) ||
      dept.shortDesc?.toLowerCase().includes(q)
    );
  });

  const displayedDepts = filteredDepts.slice(0, visibleCount);

  return (
    <section className="py-20 bg-surface border-t border-medical-border/40" id="departments">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Building2 className="w-4 h-4" />
              <span>Specialized Medical Centers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
              Featured Departments
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary max-w-xl">
              From emergency critical care to specialized surgical institutes, explore our multi-disciplinary departments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input for fast navigation across 100+ departments */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition w-full sm:w-56"
              />
            </div>

            <Link
              href="/departments"
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <span>View All {departments.length}+ Departments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Departments Grid */}
        {displayedDepts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-dark">No departments found matching &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 text-xs text-primary font-bold hover:underline"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedDepts.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-2xl overflow-hidden border border-medical-border/60 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Department Picture Slot (Empty shape if no photo uploaded, photo if uploaded) */}
                <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-cyan-50/80 flex flex-col items-center justify-center p-4 border-b border-gray-100">
                  {dept.image ? (
                    <>
                      <img
                        src={dept.image}
                        alt={dept.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
                      <h3 className="absolute bottom-3 left-4 right-4 text-white font-extrabold text-sm line-clamp-1">
                        {dept.name}
                      </h3>
                    </>
                  ) : (
                    <>
                      {/* Clean Empty Picture Shape */}
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-teal-100/80 flex items-center justify-center text-teal-600 mb-2 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                        <Building2 className="w-7 h-7" />
                      </div>
                      <h3 className="text-dark font-extrabold text-sm text-center line-clamp-1 px-2">
                        {dept.name}
                      </h3>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 mt-1">
                        Clinical Division
                      </span>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-text-secondary line-clamp-3 mb-4 leading-relaxed">
                    {dept.shortDesc || 'Dedicated clinical diagnosis and specialist consultations.'}
                  </p>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 truncate max-w-[130px]">
                      {dept.headOfDepartment || 'Specialist Lead'}
                    </span>
                    <Link
                      href={`/departments/${dept.slug}`}
                      className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center space-x-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button for 100+ departments */}
        {visibleCount < filteredDepts.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="px-6 py-2.5 bg-white border border-gray-200 hover:border-primary text-dark hover:text-primary rounded-xl text-xs font-bold shadow-soft transition inline-flex items-center space-x-2"
            >
              <span>Load More Departments ({filteredDepts.length - visibleCount} remaining)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
