import React from 'react';
import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-6">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Terms & Conditions</span>
        </nav>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-soft space-y-6">
          <div className="flex items-center space-x-3 text-primary">
            <FileText className="w-7 h-7" />
            <h1 className="text-3xl font-black text-dark tracking-tight">Terms of Healthcare Service</h1>
          </div>

          <div className="prose prose-sm max-w-none text-text-secondary space-y-4 text-xs sm:text-sm leading-relaxed">
            <h2 className="text-base font-bold text-dark">1. Clinical Consultations & Appointments</h2>
            <p>
              Submitting an online appointment booking requests an outpatient consultation slot. Confirmation slips are provided electronically. Patients are advised to arrive 15 minutes prior to scheduled consulting times.
            </p>

            <h2 className="text-base font-bold text-dark">2. Emergency Medical Triage</h2>
            <p>
              In life-threatening situations, immediate triage protocols supersede non-urgent scheduled outpatient clinics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
