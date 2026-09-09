'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  ArrowRight, 
  Search, 
  Calendar, 
  Filter, 
  Sparkles 
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
}

interface Department {
  id: string;
  name: string;
}

export default function ServicesDirectory({
  initialServices,
  departments,
}: {
  initialServices: Service[];
  departments: Department[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const filteredServices = initialServices.filter((srv) => {
    const matchesDept = selectedDept === 'all' || srv.departmentId === selectedDept;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      srv.name.toLowerCase().includes(q) ||
      srv.department?.name?.toLowerCase().includes(q) ||
      srv.shortDesc?.toLowerCase().includes(q)
    );
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-soft">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by procedure name, diagnostic lab, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          <div className="w-full sm:w-60">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            >
              <option value="all">All Departments ({initialServices.length})</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary">
            {filteredServices.length} of {initialServices.length} Services
          </span>
        </div>
      </div>

      {/* Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-black text-dark">No clinical services found</h3>
          <p className="text-xs text-text-secondary mt-1">Try another keyword or change department filter.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedDept('all'); }}
            className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
            >
              {/* Picture Frame: Empty Shape vs Uploaded Banner */}
              <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-cyan-50/80 flex flex-col items-center justify-center p-4 border-b border-gray-100">
                {srv.image ? (
                  <>
                    <img
                      src={srv.image}
                      alt={srv.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent" />
                  </>
                ) : (
                  <>
                    {/* Clean Empty Picture Shape */}
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-teal-100/80 flex items-center justify-center text-teal-600 mb-2 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                      <Activity className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                      Clinical Service Slot
                    </span>
                  </>
                )}

                {srv.price > 0 && (
                  <div className="absolute top-3 right-3 bg-dark/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-black text-white shadow z-10">
                    From ${srv.price}
                  </div>
                )}

                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-primary shadow-sm z-10">
                  {srv.department?.name || 'Specialty Service'}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-dark group-hover:text-primary transition line-clamp-1">
                    {srv.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3">
                    {srv.shortDesc || 'Advanced healthcare intervention, laboratory diagnostics, and specialized consultation.'}
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
      )}
    </div>
  );
}
