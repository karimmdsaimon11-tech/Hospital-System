'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  ArrowRight, 
  Search, 
  ChevronDown, 
  Calendar, 
  Sparkles,
  Layers
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  slug: string;
  image: string;
  shortDesc: string;
  price: number;
  departmentId: string;
  department?: {
    id: string;
    name: string;
  };
  featured?: boolean;
}

interface Department {
  id: string;
  name: string;
}

export default function ServicesSection({
  services,
  departments,
}: {
  services: Service[];
  departments: Department[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredServices = services.filter((srv) => {
    const matchesDept = selectedDept === 'all' || srv.departmentId === selectedDept;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      srv.name.toLowerCase().includes(q) ||
      srv.department?.name?.toLowerCase().includes(q) ||
      srv.shortDesc?.toLowerCase().includes(q)
    );
    return matchesDept && matchesSearch;
  });

  const displayedServices = filteredServices.slice(0, visibleCount);

  return (
    <section className="py-20 bg-white border-t border-gray-100" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Activity className="w-4 h-4" />
            <span>Comprehensive Healthcare</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Our Advanced Services
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary">
            From automated robotics diagnostics and 24/7 blood transfusion banking to dental oral surgery, 
            we cover every clinical need with precision.
          </p>
        </div>

        {/* Filter Controls (Search + Department Tabs) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-10 bg-surface p-4 rounded-2xl border border-medical-border/50 shadow-soft">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services, surgeries or labs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>

            {/* Department Dropdown / Quick Filter */}
            <div className="w-full sm:w-60">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              >
                <option value="all">All Specialties ({services.length})</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-dark hover:bg-primary text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <span>View All {services.length}+ Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Services Grid */}
        {displayedServices.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-2xl border border-dashed border-gray-300">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-dark">No services found matching your criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDept('all'); }}
              className="mt-3 text-xs text-primary font-bold hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-background rounded-2xl overflow-hidden border border-medical-border/70 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Service Picture Slot: Empty shape if no photo uploaded, photo if uploaded */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-cyan-50/80 flex flex-col items-center justify-center p-4 border-b border-gray-100">
                  {srv.image ? (
                    <>
                      <img
                        src={srv.image}
                        alt={srv.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
                    </>
                  ) : (
                    <>
                      {/* Clean Empty Picture Shape */}
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-teal-100/80 flex items-center justify-center text-teal-600 mb-2 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                        <Activity className="w-7 h-7" />
                      </div>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                        Clinical Service Slot
                      </span>
                    </>
                  )}

                  {srv.price > 0 && (
                    <div className="absolute top-3 right-3 bg-dark/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow z-10">
                      From ${srv.price}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
                      {srv.department?.name || 'Hospital Service'}
                    </span>
                    <h3 className="text-lg font-extrabold text-dark mt-1 group-hover:text-primary transition line-clamp-1">
                      {srv.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3">
                      {srv.shortDesc || 'Dedicated clinical diagnosis, laboratory assessment, and specialized treatment.'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-medical-border/60 flex items-center justify-between">
                    <Link
                      href={`/services/${srv.slug}`}
                      className="text-xs font-bold text-dark hover:text-primary transition flex items-center space-x-1"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    </Link>
                    <Link
                      href="/appointment"
                      className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition shadow-sm"
                    >
                      Book Care
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button for 100+ services */}
        {visibleCount < filteredServices.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-2.5 bg-white border border-gray-200 hover:border-primary text-dark hover:text-primary rounded-xl text-xs font-bold shadow-soft transition inline-flex items-center space-x-2"
            >
              <span>Load More Services ({filteredServices.length - visibleCount} remaining)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
