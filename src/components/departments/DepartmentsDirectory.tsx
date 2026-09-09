'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ArrowRight, 
  Search, 
  HeartPulse, 
  Stethoscope, 
  UserCheck 
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  slug: string;
  image: string;
  shortDesc: string;
  headOfDepartment: string;
  _count?: {
    doctors: number;
    services: number;
  };
}

export default function DepartmentsDirectory({
  initialDepartments,
}: {
  initialDepartments: Department[];
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDepts = initialDepartments.filter((dept) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dept.name.toLowerCase().includes(q) ||
      dept.headOfDepartment?.toLowerCase().includes(q) ||
      dept.shortDesc?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Search & Counter Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-soft">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search departments by name or medical director..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary">
            {filteredDepts.length} of {initialDepartments.length} Departments
          </span>
        </div>
      </div>

      {/* Grid */}
      {filteredDepts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-black text-dark">No medical departments match your query</h3>
          <p className="text-xs text-text-secondary mt-1">Try another search keyword.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition shadow-sm"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDepts.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
            >
              {/* Picture Frame: Empty Shape vs Uploaded Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-cyan-50/80 flex flex-col items-center justify-center p-4 border-b border-gray-100">
                {dept.image ? (
                  <>
                    <img
                      src={dept.image}
                      alt={dept.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
                    <h3 className="absolute bottom-4 left-5 right-5 text-xl font-extrabold text-white line-clamp-1">
                      {dept.name}
                    </h3>
                  </>
                ) : (
                  <>
                    {/* Clean Empty Picture Shape */}
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-teal-100/80 flex items-center justify-center text-teal-600 mb-2 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-dark font-black text-base text-center line-clamp-1 px-3">
                      {dept.name}
                    </h3>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 mt-1">
                      Clinical Specialty Slot
                    </span>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3">
                    {dept.shortDesc || 'Comprehensive diagnostic procedures, clinical treatments, and round-the-clock emergency care.'}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                    <div>
                      <strong className="text-dark">Head:</strong> {dept.headOfDepartment || 'Specialist In-Charge'}
                    </div>
                    <div>
                      <strong className="text-dark">Faculty:</strong> {dept._count?.doctors || 0} Specialists • {dept._count?.services || 0} Services
                    </div>
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
      )}
    </div>
  );
}
