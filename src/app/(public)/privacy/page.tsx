import React from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Lock, FileCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-6">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Privacy Policy</span>
        </nav>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-soft space-y-6">
          <div className="flex items-center space-x-3 text-primary">
            <Lock className="w-7 h-7" />
            <h1 className="text-3xl font-black text-dark tracking-tight">Patient Privacy & HIPAA Compliance</h1>
          </div>

          <p className="text-xs text-gray-400">Last Revised: January 1, 2026</p>

          <div className="prose prose-sm max-w-none text-text-secondary space-y-4 text-xs sm:text-sm leading-relaxed">
            <h2 className="text-base font-bold text-dark">1. Confidentiality of Health Information</h2>
            <p>
              At MedicalPress Hospital, your medical confidentiality is protected by federal HIPAA standards and international medical secrecy laws. We never sell, lease, or expose your diagnostic tests, prescriptions, or clinical notes.
            </p>

            <h2 className="text-base font-bold text-dark">2. Digital Records Protection</h2>
            <p>
              All electronic health records (EHR) transmitted through our Patient Portal are encrypted with AES-256 and SSL/TLS transport layer protocols. Only authorized treating physicians and registered healthcare staff have access.
            </p>

            <h2 className="text-base font-bold text-dark">3. Your Rights as a Patient</h2>
            <p>
              You have the right to request a complete copy of your medical chart, amend any inaccurate demographic information, and review the log of authorized staff who viewed your records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
