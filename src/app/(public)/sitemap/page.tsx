import React from 'react';
import Link from 'next/link';
import { ChevronRight, Globe, ArrowRight } from 'lucide-react';

export default function SitemapPage() {
  const pages = [
    { title: 'Home Page', href: '/' },
    { title: 'About Hospital', href: '/about' },
    { title: '4 Columns Doctors Directory', href: '/doctors' },
    { title: 'Medical Departments', href: '/departments' },
    { title: '3 Columns Services', href: '/services' },
    { title: 'Make an Appointment (Clipboard Form)', href: '/appointment' },
    { title: 'Preventive Health Packages', href: '/packages' },
    { title: 'Blood Bank & Transfusion Reserves', href: '/blood-bank' },
    { title: 'Emergency & Mobile ICU Dispatch', href: '/emergency' },
    { title: 'Patient Records & Prescription Portal', href: '/patient-portal' },
    { title: 'Clinical News & Health Blog', href: '/blog' },
    { title: 'Hospital Facilities Media Gallery', href: '/gallery' },
    { title: 'Patient Healing Stories & Testimonials', href: '/testimonials' },
    { title: 'Frequently Asked Questions (FAQ)', href: '/faq' },
    { title: 'Hospital Careers & Medical Vacancies', href: '/careers' },
    { title: 'Contact Hospital & Google Maps', href: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-6">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Sitemap</span>
        </nav>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-soft space-y-6">
          <div className="flex items-center space-x-3 text-primary border-b border-gray-100 pb-4">
            <Globe className="w-7 h-7" />
            <h1 className="text-3xl font-black text-dark tracking-tight">Website Directory & Sitemap</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pages.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="p-3.5 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition flex items-center justify-between text-xs sm:text-sm font-bold text-dark group"
              >
                <span>{p.title}</span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
