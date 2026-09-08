import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { 
  Calendar, 
  Clock, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  CheckCircle2, 
  Building2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  UserCheck,
  User
} from 'lucide-react';

export const revalidate = 0;

export default async function DoctorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const doctor = await prisma.doctor.findFirst({
    where: {
      OR: [{ id: params.id }, { slug: params.id }],
    },
    include: {
      department: true,
      branch: true,
      schedules: true,
      leaves: { where: { status: 'Approved' } },
    },
  });

  if (!doctor) notFound();

  const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-6">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/doctors" className="hover:text-primary transition">Doctors</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">{doctor.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Doctor Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-soft p-6 text-center">
              <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-card mb-4 bg-gray-100 flex items-center justify-center">
                {doctor.photo ? (
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-4">
                    <User className="w-16 h-16 text-primary/40 mb-1" />
                    <span className="text-[11px] font-bold text-gray-500">Doctor Photo Slot</span>
                    <span className="text-[9px] text-gray-400">Empty shape</span>
                  </div>
                )}
              </div>

              <h1 className="text-xl font-black text-dark tracking-tight">{doctor.name}</h1>
              <p className="text-xs font-bold text-primary mt-1">{doctor.specialty}</p>
              <p className="text-xs text-gray-500 mt-1">{doctor.department?.name}</p>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-left text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Consultation Fee</span>
                  <strong className="text-dark font-black">${doctor.consultationFee}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Experience</span>
                  <strong className="text-dark font-semibold">{doctor.experience}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Visiting Hours</span>
                  <strong className="text-coral font-semibold text-right">{doctor.visitingHours}</strong>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center space-x-3 text-gray-400">
                {doctor.facebook && <a href={doctor.facebook} target="_blank" rel="noreferrer" className="hover:text-primary transition"><Facebook className="w-4 h-4" /></a>}
                {doctor.twitter && <a href={doctor.twitter} target="_blank" rel="noreferrer" className="hover:text-primary transition"><Twitter className="w-4 h-4" /></a>}
                {doctor.linkedin && <a href={doctor.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary transition"><Linkedin className="w-4 h-4" /></a>}
              </div>

              {/* Instant Book CTA */}
              <div className="mt-6">
                <Link
                  href={`/appointment?doctorId=${doctor.id}`}
                  className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold shadow-md flex items-center justify-center space-x-2 transition"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation With {doctor.name.split(' ')[1] || doctor.name}</span>
                </Link>
              </div>
            </div>

            {/* Hospital Branch Box */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-5 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-primary font-bold">
                <Building2 className="w-4 h-4" />
                <span>Primary Practice Location</span>
              </div>
              <p className="font-extrabold text-dark">{doctor.branch?.name || 'MedicalPress Downtown Main Campus'}</p>
              <p className="text-gray-500">{doctor.branch?.address || '742 Evergreen Medical Parkway, Healthcare District, NY 10001'}</p>
              <p className="text-gray-500 font-medium">Direct Line: {doctor.phone}</p>
            </div>
          </div>

          {/* Right Column: Bio, Qualifications, Schedules */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview & Bio */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-black text-dark tracking-tight border-b border-gray-100 pb-3">
                Professional Background & Clinical Focus
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                {doctor.bio}
              </p>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-dark uppercase tracking-wider mb-2">
                  Academic Credentials & Fellowships
                </h3>
                <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Award className="w-5 h-5 text-primary shrink-0" />
                  <span>{doctor.qualification}</span>
                </div>
              </div>
            </div>

            {/* Weekly Outpatient Schedule */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-xl font-black text-dark tracking-tight">
                  Weekly Outpatient Clinic Schedule
                </h2>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Real-time Availability
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-bold">
                      <th className="py-2.5 px-3">Day of Week</th>
                      <th className="py-2.5 px-3">Shift Hours</th>
                      <th className="py-2.5 px-3">Consultation Window</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {doctor.schedules.length > 0 ? (
                      doctor.schedules.map((sch) => (
                        <tr key={sch.id} className="hover:bg-gray-50/60">
                          <td className="py-3 px-3 font-bold text-dark">
                            {daysMap[sch.dayOfWeek] || 'Everyday'}
                          </td>
                          <td className="py-3 px-3 text-primary font-semibold">
                            {sch.startTime} - {sch.endTime}
                          </td>
                          <td className="py-3 px-3 text-gray-500">
                            {sch.slotDuration} Minutes / Patient (Max {sch.maxPatients})
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Active Clinic
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              href={`/appointment?doctorId=${doctor.id}`}
                              className="px-3 py-1 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-md font-bold transition"
                            >
                              Select Slot
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-4 px-3 text-center text-gray-400">
                          General visiting hours: {doctor.visitingHours}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
