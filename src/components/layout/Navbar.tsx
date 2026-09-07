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
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Secure Management & Director Login State
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoggingIn, setAdminLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<GlobalInfo>({
    phone: '+1-800-654-3210',
    emergencyPhone: '+1-800-999-HELP',
    openingHours: 'Mon - Sat: 8:00 AM - 9:00 PM',
    announcementText: 'Welcome to MedicalPress — Advanced Healthcare & Compassionate Care',
    announcementActive: true,
    hospitalName: 'MedicalPress',
  });

  // Fetch dynamic settings from database
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hospitalName) {
          setSettings({
            phone: data.phone || '+1-800-654-3210',
            emergencyPhone: data.emergencyPhone || '+1-800-999-HELP',
            openingHours: data.openingHours || 'Mon - Sat: 8:00 AM - 9:00 PM',
            announcementText: data.announcementText || 'Welcome to MedicalPress — Advanced Healthcare & Compassionate Care',
            announcementActive: data.announcementActive !== false,
            hospitalName: data.hospitalName || 'MedicalPress',
          });
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Secure Management & Director Login Submit
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setAdminModalOpen(false);
        setLoginEmail('');
        setLoginPassword('');
        router.push('/admin');
      } else {
        setLoginError(data.error || 'Access Denied: Invalid User ID or Password.');
      }
    } catch (err) {
      setLoginError('Authentication server error. Please try again.');
    } finally {
      setAdminLoggingIn(false);
    }
  };

  // Primary navigation links shown directly on desktop navbar
  const primaryLinks = [
    { name: t.home, href: '/' },
    { name: t.doctors, href: '/doctors' },
    { name: t.departments, href: '/departments' },
    { name: t.services, href: '/services' },
    { name: t.healthPackages, href: '/packages' },
    { name: t.emergency, href: '/emergency' },
  ];

  // Comprehensive secondary links grouped neatly inside the "More" dropdown
  const moreLinks = [
    { name: t.bloodBank, href: '/blood-bank', desc: '8 blood groups & emergency requisition', icon: Droplet },
    { name: 'Photo & Video Gallery', href: '/gallery', desc: 'Surgical suites, equipment & video tours', icon: ImageIcon },
    { name: t.news, href: '/blog', desc: 'Medical research, doctor advice & articles', icon: Newspaper },
    { name: t.testimonials, href: '/testimonials', desc: 'Real patient stories & reviews', icon: Star },
    { name: t.faq, href: '/faq', desc: 'Frequently asked medical & insurance questions', icon: HelpCircle },
    { name: t.careers, href: '/careers', desc: 'Clinical vacancies & online CV application', icon: Briefcase },
    { name: t.about, href: '/about', desc: 'Hospital history, mission & leadership', icon: Building },
    { name: t.contact, href: '/contact', desc: 'Campus addresses, maps & phone lines', icon: MapPin },
    { name: 'UI Component Showcase (Sec 66)', href: '/component-showcase', desc: 'Section 66 design system reference', icon: Layers },
    { name: 'Editorial Blog Layout (Sec 67)', href: '/blog-component', desc: 'Section 67 bullet & tab blog layout', icon: Code2 },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const isMoreActive = moreLinks.some((l) => pathname === l.href);

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
                <span className="text-2xl font-black tracking-tight text-dark">Medical</span>
                <span className="text-2xl font-black tracking-tight text-primary">PRESS</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mt-1">
                International Healthcare
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

            {/* "More ▾" Mega Dropdown */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-3 py-2 text-sm font-bold rounded-xl transition flex items-center space-x-1 whitespace-nowrap ${
                  isMoreActive || moreDropdownOpen
                    ? 'text-primary bg-primary/10'
                    : 'text-text-primary hover:text-primary hover:bg-gray-50'
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180 text-primary' : 'text-gray-400'
                  }`}
                />
              </button>

              {/* Dropdown Menu (2-Column Grid) */}
              {moreDropdownOpen && (
                <div className="absolute left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50 animate-fadeIn">
                  <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-2.5 py-1 mb-1 border-b border-gray-100">
                    Hospital Resources & System Pages
                  </div>
                  <div className="grid grid-cols-1 gap-1 max-h-[70vh] overflow-y-auto pr-1">
                    {moreLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={`flex items-start space-x-2.5 p-2 rounded-xl transition ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                              isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-tight">{link.name}</div>
                            <div className="text-[10px] text-text-secondary leading-snug mt-0.5 line-clamp-1">
                              {link.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Controls: Search + Book Appointment + ADMIN GATEWAY BUTTON */}
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

            {/* ADMIN SECTION BUTTON (Directly beside Book Appointment) */}
            <button
              onClick={() => setAdminModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-[#202B33] hover:bg-black text-white font-bold text-xs shadow-md shadow-dark/20 border border-gray-700 transition transform active:scale-95 whitespace-nowrap group"
              title="Hospital Staff & Admin Login"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setAdminModalOpen(true)}
              className="p-2 rounded-xl bg-[#202B33] text-emerald-400 text-xs font-bold"
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
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

      {/* 4. MANAGEMENT DIRECTOR & ADMIN SECURE LOGIN MODAL */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 bg-dark/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-[#1E293B] p-5 text-white flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Management & Director Gateway</h3>
                  <p className="text-[11px] text-gray-400">Hospital Administration & Executive Portal</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAdminModalOpen(false);
                  setLoginError('');
                }}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center space-x-2 text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <Lock className="w-4 h-4 text-primary shrink-0" />
                <span>Restricted Access: Authorized Hospital Directors & Staff only. Credentials are confidential.</span>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Secure Login Form */}
              <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-dark mb-1">
                    Management User ID / Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="Enter authorized user ID / email..."
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:border-primary focus:outline-none transition"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-dark mb-1">
                    Security Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter security password..."
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-xs focus:border-primary focus:outline-none transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={adminLoggingIn}
                  className="w-full py-3 bg-[#202B33] hover:bg-black text-white rounded-xl font-black shadow-lg shadow-dark/20 flex items-center justify-center space-x-2 transition text-xs disabled:opacity-50"
                >
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span>{adminLoggingIn ? 'Verifying Authorization...' : '🔒 Authenticate & Access Admin Panel'}</span>
                </button>
              </form>

              {/* Bottom Info */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-gray-400">256-Bit SSL Encrypted Session</span>
                <Link
                  href="/admin/login"
                  onClick={() => setAdminModalOpen(false)}
                  className="text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <span>Full Login Page</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
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
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAdminModalOpen(true);
              }}
              className="text-xs font-bold text-emerald-600 flex items-center space-x-1 px-2 py-1 bg-emerald-50 rounded-lg"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
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

          {/* More Nav Links */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2 px-1">
              Hospital Services & Resources
            </span>
            <nav className="grid grid-cols-2 gap-1.5">
              {moreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl transition ${
                    pathname === link.href
                      ? 'bg-primary text-white font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
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
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAdminModalOpen(true);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#202B33] text-white font-bold text-xs shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Enter Admin CMS (admin@medicalpress.com)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
