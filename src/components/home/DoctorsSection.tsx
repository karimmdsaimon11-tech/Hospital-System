'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Award, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  UserCheck,
  User
} from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageContext';

interface Doctor {
  id: string;
  name: string;
  slug: string;
  photo: string;
  specialty: string;
  departmentId: string;
  department?: {
    id: string;
    name: string;
    slug: string;
  };
  experience: string;
  qualification: string;
  visitingHours: string;
  consultationFee: number;
  phone: string;
  bio: string;
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
}

interface Department {
  id: string;
  name: string;
  slug: string;
}

export default function DoctorsSection({
  initialDoctors,
  departments,
}: {
  initialDoctors: Doctor[];
  departments: Department[];
}) {
  const { t } = useLanguage();
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(8);

  const filteredDoctors = selectedDept === 'all'
    ? initialDoctors
    : initialDoctors.filter((doc) => doc.departmentId === selectedDept);

  return (
    <section className="py-20 bg-background" id="doctors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-3">
            <UserCheck className="w-4 h-4" />
            <span>World-Class Medical Faculty ({filteredDoctors.length} Specialists)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Meet Our Doctors
          </h2>
          <p className="mt-4 text-base text-text-secondary">
            Our internationally trained board-certified specialists bring decades of experience, 
            cutting-edge clinical precision, and warm bedside compassion.
          </p>

          {/* Department Filter Tabs (Section 12: Meet Our Doctors Filters) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => {
                setSelectedDept('all');
                setVisibleCount(8);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                selectedDept === 'all'
                  ? 'bg-primary text-white shadow-primary/20'
                  : 'bg-white text-text-secondary hover:text-dark hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Departments ({initialDoctors.length})
            </button>
            {departments.slice(0, 8).map((dept) => (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedDept(dept.id);
                  setVisibleCount(8);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                  selectedDept === dept.id
                    ? 'bg-primary text-white shadow-primary/20'
                    : 'bg-white text-text-secondary hover:text-dark hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>

        {/* 11. 4-Column Responsive Doctor Grid (Desktop: 4, Tablet: 2, Mobile: 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDoctors.slice(0, visibleCount).map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Doctor Image or Empty Shape Placeholder */}
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

              {/* Doctor Card Content */}
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

                {/* Social Links & Action Buttons */}
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

                  {/* Book Appointment CTA */}
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

        {/* Load More & Directory Links */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          {filteredDoctors.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="px-7 py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary-hover transition"
            >
              Load More Doctors ({filteredDoctors.length - visibleCount} More)
            </button>
          )}

          <Link
            href="/doctors"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-dark font-bold text-xs sm:text-sm shadow-sm hover:border-primary hover:text-primary transition"
          >
            <span>Explore All ({initialDoctors.length}) Specialists in Directory</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </Link>
        </div>
      </div>
    </section>
  );
}
