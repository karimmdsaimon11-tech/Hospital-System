import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Award, ShieldCheck, HeartPulse, Building2, Users, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">About MedicalPress</span>
        </nav>

        <div className="border-b border-gray-200/80 pb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Excellence Since 2001</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            About MedicalPress Hospital
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-2xl">
            A quarter-century of pioneering clinical excellence, academic surgical innovation, and compassionate patient care.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hospital Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-dark tracking-tight">
              Leading the Standard in Global Healthcare
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              MedicalPress Hospital was founded in 2001 with a singular objective: to bridge cutting-edge clinical scientific advancement with empathetic, dignified patient-centered medicine.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Today, our campus encompasses 650 inpatient beds, 18 robotic laminar-flow operating suites, a 24/7 Level 1 Trauma Resuscitation Center, and over 100 world-renowned consulting specialists across 50 clinical departments.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-3 text-xs font-bold text-dark">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>JCI Joint Commission Accredited</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero-Infection Protocol ORs</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Top 10 Global Medical Facilities</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct Cashless Global Insurance</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-card bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
                alt="Hospital Modern Atrium"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Leadership Cards */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-soft">
          <h2 className="text-2xl font-black text-dark mb-6 text-center">
            Hospital Executive Leadership
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                name: 'Dr. Arthur Sterling, MD, FACC',
                role: 'Chief Medical Officer & CEO',
                photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
                bio: 'Former Professor of Surgery at Harvard Medical School with 28+ years of healthcare governance.',
              },
              {
                name: 'Dr. Eleanor Vance, MD, PhD',
                role: 'Director of Clinical Research',
                photo: 'https://images.unsplash.com/photo-1594824813576-248386348efc?auto=format&fit=crop&w=400&q=80',
                bio: 'Pioneered translational neurology protocols and author of over 120 peer-reviewed clinical publications.',
              },
              {
                name: 'Marcus Montgomery, MHA',
                role: 'Chief Operating Officer',
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                bio: 'Oversees international healthcare logistics, trauma readiness, and patient quality assurance.',
              },
            ].map((lead, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden mb-3 shadow">
                  <Image src={lead.photo} alt={lead.name} fill className="object-cover object-top" />
                </div>
                <h3 className="text-sm font-bold text-dark">{lead.name}</h3>
                <p className="text-xs text-primary font-semibold mb-2">{lead.role}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{lead.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
