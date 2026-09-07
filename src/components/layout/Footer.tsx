'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  ArrowRight,
  ShieldCheck,
  Award,
  HeartPulse
} from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const [footerData, setFooterData] = useState({
    hospitalName: 'MedicalPress Hospital',
    tagline: 'Advanced Healthcare & Compassionate Care',
    phone: '+1-800-654-3210',
    emergencyPhone: '+1-800-999-HELP',
    email: 'care@medicalpress.com',
    address: '742 Evergreen Medical Parkway, Healthcare District, NY 10001',
    openingHours: 'Monday to Saturday — 8:00 AM to 9:00 PM',
    copyright: '© 2026 MedicalPress International Hospital. All rights reserved.',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  });

  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hospitalName) {
          setFooterData((prev) => ({
            ...prev,
            hospitalName: data.hospitalName || prev.hospitalName,
            phone: data.phone || prev.phone,
            emergencyPhone: data.emergencyPhone || prev.emergencyPhone,
            email: data.email || prev.email,
            address: data.address || prev.address,
            openingHours: data.openingHours || prev.openingHours,
            copyright: data.copyright || prev.copyright,
          }));
        }
      })
      .catch(() => {});

    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDepartments(data.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-dark text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Hospital Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-md text-white">
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <div className="absolute w-1.5 h-5 bg-white rounded-sm" />
                  <div className="absolute h-1.5 w-5 bg-white rounded-sm" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-xl font-black text-white">Medical</span>
                  <span className="text-xl font-black text-primary">PRESS</span>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-gray-400">
                  International Hospital
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed">
              MedicalPress is an internationally accredited multi-specialty healthcare institution 
              committed to clinical excellence, patient dignity, and medical innovation.
            </p>

            <div className="flex items-center space-x-3 text-xs text-primary font-semibold pt-1">
              <Award className="w-4 h-4" />
              <span>JCI Accredited & ISO 9001:2015 Certified</span>
            </div>

            {/* Social handles */}
            <div className="flex items-center space-x-3 pt-2">
              <a href={footerData.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center text-gray-300 hover:text-white transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={footerData.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center text-gray-300 hover:text-white transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={footerData.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center text-gray-300 hover:text-white transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={footerData.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center text-gray-300 hover:text-white transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={footerData.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center text-gray-300 hover:text-white transition">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide border-b border-gray-800 pb-2">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary transition flex items-center space-x-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>About Our Hospital</span>
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-primary transition flex items-center space-x-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>Meet Our Doctors</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition flex items-center space-x-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>Hospital Services</span>
                </Link>
              </li>
              <li>
                <Link href="/appointment" className="hover:text-primary transition flex items-center space-x-2 font-medium text-white">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>Make an Appointment</span>
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-primary transition flex items-center space-x-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>Preventive Health Packages</span>
                </Link>
              </li>
              <li>
                <Link href="/blood-bank" className="hover:text-primary transition flex items-center space-x-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>Blood Bank & Transfusion</span>
                </Link>
              </li>
              <li>
                <Link href="/patient-portal" className="hover:text-primary transition flex items-center space-x-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>Patient Medical Portal</span>
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary transition flex items-center space-x-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>Careers & Opportunities</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Medical Departments */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide border-b border-gray-800 pb-2">
              Medical Specialties
            </h3>
            <ul className="space-y-2.5 text-sm">
              {departments.length > 0 ? (
                departments.map((d) => (
                  <li key={d.id}>
                    <Link href={`/departments/${d.slug}`} className="hover:text-primary transition flex items-center space-x-2">
                      <ArrowRight className="w-3.5 h-3.5 text-primary" />
                      <span>{d.name}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href="/departments" className="hover:text-primary transition">Cardiology Clinic</Link></li>
                  <li><Link href="/departments" className="hover:text-primary transition">Neurology & Neurosurgery</Link></li>
                  <li><Link href="/departments" className="hover:text-primary transition">Orthopedics & Joint Care</Link></li>
                  <li><Link href="/departments" className="hover:text-primary transition">Pediatrics Clinic</Link></li>
                  <li><Link href="/departments" className="hover:text-primary transition">Gynaecological Clinic</Link></li>
                  <li><Link href="/departments" className="hover:text-primary transition">Dermatology & Laser Center</Link></li>
                </>
              )}
              <li className="pt-2">
                <Link href="/departments" className="text-xs font-bold text-primary hover:underline flex items-center space-x-1">
                  <span>View All 50+ Departments</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Emergency */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide border-b border-gray-800 pb-2">
              Emergency & Contact
            </h3>
            
            <div className="bg-dark-card p-4 rounded-xl border border-coral/20 space-y-2">
              <div className="flex items-center space-x-2 text-coral font-bold text-xs">
                <AlertCircle className="w-4 h-4 animate-pulse" />
                <span>24/7 EMERGENCY HOTLINE</span>
              </div>
              <a 
                href={`tel:${footerData.emergencyPhone.replace(/[^0-9+]/g, '')}`} 
                className="block text-xl font-extrabold text-white hover:text-coral transition tracking-tight"
              >
                {footerData.emergencyPhone}
              </a>
              <p className="text-[11px] text-gray-400">
                Direct Level 1 Trauma Center & Ambulance Dispatch
              </p>
            </div>

            <ul className="space-y-3 text-xs text-gray-300 pt-1">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{footerData.address}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${footerData.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition">
                  {footerData.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${footerData.email}`} className="hover:text-white transition">
                  {footerData.email}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>{footerData.openingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Staff Access */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>{footerData.copyright}</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-gray-200 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-200 transition">Terms & Conditions</Link>
            <Link href="/sitemap" className="hover:text-gray-200 transition">Sitemap</Link>
            <Link href="/component-showcase" className="text-primary hover:underline">UI Showcase</Link>
            <Link href="/blog-component" className="text-primary hover:underline">Blog Layout</Link>
            <Link href="/admin/login" className="flex items-center space-x-1 text-gray-400 hover:text-white transition bg-gray-800/80 px-2.5 py-1 rounded">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
