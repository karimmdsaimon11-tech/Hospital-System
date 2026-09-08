'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Phone, 
  Clock, 
  Search, 
  Calendar, 
  AlertCircle, 
  Menu, 
  X, 
  Globe, 
  User, 
  HeartPulse, 
  ChevronDown,
  Stethoscope,
  Activity,
  ShieldCheck,
  Droplet,
  Newspaper,
  Image as ImageIcon,
  Building,
  Briefcase,
  MapPin,
  Sparkles,
  Key,
  Star,
  HelpCircle,
  Code2,
  ChevronRight,
  Lock,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageContext';
import { Language } from '@/lib/i18n';

interface GlobalInfo {
  phone: string;
  emergencyPhone: string;
  openingHours: string;
  announcementText: string;
  announcementActive: boolean;
  hospitalName: string;
  tagline?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<GlobalInfo>({
    phone: '+1-800-654-3210',
    emergencyPhone: '+1-800-999-HELP',
    openingHours: 'Mon - Sat: 8:00 AM - 9:00 PM',
    announcementText: 'Welcome to Green Shifa Hospital — Advanced Healthcare & Compassionate Care',
    announcementActive: true,
    hospitalName: 'Green Shifa Hospital',
    tagline: 'Advanced Healthcare & Compassionate Care',
  });

  // Fetch dynamic settings from database without cache
  const fetchSettings = () => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hospitalName) {
          setSettings({
            phone: data.phone || '+1-800-654-3210',
            emergencyPhone: data.emergencyPhone || '+1-800-999-HELP',
            openingHours: data.openingHours || 'Mon - Sat: 8:00 AM - 9:00 PM',
            announcementText: data.announcementText || 'Welcome to Green Shifa Hospital — Advanced Healthcare & Compassionate Care',
            announcementActive: data.announcementActive !== false,
            hospitalName: data.hospitalName || 'Green Shifa Hospital',
            tagline: data.tagline || 'Advanced Healthcare & Compassionate Care',
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSettings();

    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setSettings((prev) => ({ ...prev, ...e.detail }));
      } else {
        fetchSettings();
      }
    };

    window.addEventListener('hospital-settings-updated', handleUpdate);
    return () => window.removeEventListener('hospital-settings-updated', handleUpdate);
  }, []);


  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation links shown directly on desktop navbar
  const primaryLinks = [
    { name: t.home || 'Home', href: '/' },
    { name: t.doctors || 'Doctors', href: '/doctors' },
    { name: t.departments || 'Departments', href: '/departments' },
    { name: t.services || 'Services', href: '/services' },
    { name: t.healthPackages || 'Health Packages', href: '/packages' },
    { name: t.bloodBank || 'Blood Bank', href: '/blood-bank' },
    { name: t.about || 'About', href: '/about' },
    { name: t.contact || 'Contact', href: '/contact' },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];


  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* 1. TOP UTILITY & ANNOUNCEMENT BAR */}
      <div className="bg-[#202B33] text-gray-300 text-xs py-2 px-4 border-b border-[#2E3C47]">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
          {/* Left: Announcement / Hours */}
          <div className="flex items-center space-x-3 truncate">
            {settings.announcementActive && (
              <div className="flex items-center space-x-2 truncate">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
                <span className="font-medium text-gray-200 text-xs truncate max-w-sm md:max-w-md lg:max-w-lg">
                  {settings.announcementText}
                </span>
              </div>
            )}
            <div className="hidden lg:flex items-center space-x-1.5 pl-3 border-l border-gray-700 text-gray-400 text-xs shrink-0">
              <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{settings.openingHours}</span>
            </div>
          </div>

          {/* Right: Emergency Hotline, Patient Portal, Language Switcher */}
          <div className="flex items-center space-x-4 shrink-0">
            {/* 24/7 Hotline */}
            <a
              href={`tel:${settings.emergencyPhone.replace(/[^0-9+]/g, '')}`}
              className="hidden sm:flex items-center space-x-1.5 text-coral hover:text-white transition font-bold text-xs"
              title="24/7 Emergency Trauma Hotline"
            >
              <AlertCircle className="w-3.5 h-3.5 text-coral shrink-0" />
              <span>24/7: {settings.emergencyPhone}</span>
            </a>

            {/* Patient Portal Link */}
            <Link
              href="/patient-portal"
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition text-xs font-semibold px-2 py-0.5 rounded hover:bg-gray-800"
            >
              <User className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="hidden md:inline">{t.patientPortal}</span>
              <span className="md:hidden">Portal</span>
            </Link>

            {/* Language Switcher Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-bold text-gray-200 hover:text-white hover:bg-gray-800 transition"
              >
                <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fadeIn text-dark">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2 hover:bg-primary/10 transition ${
                        language === l.code ? 'text-primary font-bold bg-primary/5' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-base leading-none">{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Medical Cross */}
          <Link href="/" className="flex items-center space-x-3 shrink-0 group">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/25 text-white transition-transform group-hover:scale-105">
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="absolute w-2 h-6 bg-white rounded-sm" />
                <div className="absolute h-2 w-6 bg-white rounded-sm" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center leading-none">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-dark">{settings.hospitalName}</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mt-1 truncate max-w-[200px] sm:max-w-none">
                {settings.tagline || 'International Healthcare'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {primaryLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-bold rounded-xl transition whitespace-nowrap ${
                    isActive
                      ? 'text-primary bg-primary/10 shadow-xs'
                      : 'text-text-primary hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

          </nav>

          {/* Right Action Controls: Search + Book Appointment */}
          <div className="hidden sm:flex items-center space-x-2.5 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-text-secondary hover:text-primary hover:bg-gray-100 rounded-xl transition"
              title="Search Doctors & Services"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Book Appointment CTA */}
            <Link
              href="/appointment"
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md shadow-primary/25 transition transform active:scale-95 whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.bookAppointment}</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/appointment"
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-dark hover:bg-gray-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. SEARCH POPUP BAR */}
      {searchOpen && (
        <div className="bg-gray-50 border-t border-b border-gray-200 px-4 py-3 animate-fadeIn">
          <div className="max-w-3xl mx-auto flex items-center space-x-3">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-sm text-dark placeholder-gray-400 font-medium"
              autoFocus
            />
            {searchQuery && (
              <Link
                href={`/doctors?q=${encodeURIComponent(searchQuery)}`}
                onClick={() => setSearchOpen(false)}
                className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm whitespace-nowrap"
              >
                Search
              </Link>
            )}
            <button
              onClick={() => setSearchOpen(false)}
              className="text-xs font-bold text-gray-500 hover:text-dark px-2"
            >
              Close
            </button>
          </div>
        </div>
      )}


      {/* 5. MOBILE SLIDE-OUT DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-fadeIn">
          {/* Mobile Utility Row */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-gray-500">Language:</span>
              <div className="flex space-x-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2 py-1 text-xs rounded-lg font-bold ${
                      language === l.code ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {l.flag} {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Nav Links */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2 px-1">
              Main Menu
            </span>
            <nav className="grid grid-cols-2 gap-1.5">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl transition ${
                    pathname === link.href
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <Link
              href="/appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.bookAppointment}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
