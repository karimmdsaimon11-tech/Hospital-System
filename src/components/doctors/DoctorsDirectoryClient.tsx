'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Calendar, 
  Clock, 
  Award, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  ArrowRight,
  Filter,
  User
} from 'lucide-react';

export default function DoctorsDirectoryClient({
  initialDoctors,
  departments,
  initialQuery = '',
  initialDept = 'all',
}: {
  initialDoctors: any[];
  departments: any[];
  initialQuery?: string;
  initialDept?: string;
}) {
  const [search, setSearch] = useState(initialQuery);
  const [selectedDept, setSelectedDept] = useState(initialDept);

  const filteredDoctors = useMemo(() => {
    return initialDoctors.filter((doc) => {
      const matchesDept = selectedDept === 'all' || doc.departmentId === selectedDept;
      const matchesSearch =
        !search ||
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
        (doc.department?.name && doc.department.name.toLowerCase().includes(search.toLowerCase()));
      return matchesDept && matchesSearch;
    });
  }, [initialDoctors, selectedDept, search]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by doctor name, specialty, or condition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-dark placeholder-gray-400 focus:outline-none focus:border-primary bg-gray-50/50"
          />
        </div>

        {/* Department Filter Badges */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
              selectedDept === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Specialists ({initialDoctors.length})
          </button>
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                selectedDept === dept.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-text-secondary font-medium">
        Showing <strong className="text-dark">{filteredDoctors.length}</strong> available doctor{filteredDoctors.length === 1 ? '' : 's'}
      </div>

      {/* 4-Column Responsive Doctor Grid (Desktop: 4, Tablet: 2, Mobile: 1) */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Doctor Image or Empty Shape Slot */}
              <div className="relative h-60 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {doctor.photo ? (
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full p-4 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100/80 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2 shadow-xs group-hover:scale-105 transition">
                      <User className="w-8 h-8 text-primary/70" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">Doctor Photo Slot</span>
                    <span className="text-[9px] text-gray-400 mt-0.5">Empty shape</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-primary shadow-sm">
                  {doctor.department?.name || 'Specialist'}
                </div>
              </div>

              {/* Doctor Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-dark group-hover:text-primary transition line-clamp-1">
                    {doctor.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary mt-1 line-clamp-1">
                    {doctor.specialty}
                  </p>
                  <p className="text-xs text-text-secondary mt-2 line-clamp-2">
                    {doctor.bio}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{doctor.experience}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-coral shrink-0" />
                      <span className="truncate">{doctor.visitingHours}</span>
                    </div>
                  </div>
                </div>

                {/* Social Buttons & View Profile */}
                <div className="mt-5 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-gray-400">
                      {doctor.facebook && (
                        <a href={doctor.facebook} target="_blank" rel="noreferrer" className="hover:text-primary transition">
                          <Facebook className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {doctor.twitter && (
                        <a href={doctor.twitter} target="_blank" rel="noreferrer" className="hover:text-primary transition">
                          <Twitter className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {doctor.linkedin && (
                        <a href={doctor.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary transition">
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <Link
                      href={`/doctors/${doctor.id}`}
                      className="text-xs font-bold text-text-secondary hover:text-primary transition"
                    >
                      View Profile
                    </Link>
                  </div>

                  {/* Appointment Button */}
                  <Link
                    href={`/appointment?doctorId=${doctor.id}`}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-bold transition duration-200"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Consultation</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 text-gray-500">
          <p className="text-base font-bold text-dark">No doctors match your filter criteria.</p>
          <p className="text-xs mt-1">Try resetting the department filter or typing a different search query.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedDept('all');
            }}
            className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
