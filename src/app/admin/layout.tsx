'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  UserCheck, 
  Users, 
  Pill, 
  FileText, 
  Building2, 
  Activity, 
  Sparkles, 
  Target, 
  Droplet, 
  Siren, 
  Newspaper, 
  Image as ImageIcon, 
  Star, 
  HelpCircle, 
  Briefcase, 
  Mail, 
  Globe, 
  Search, 
  Sliders, 
  FolderArchive, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({
    name: 'Hospital Administrator',
    role: 'Super Admin',
    email: 'Admin@776753',
  });
  const [authChecking, setAuthChecking] = useState(pathname !== '/admin/login');

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthChecking(false);
      return;
    }

    const hasSession = document.cookie.includes('medicalpress_session=');
    if (!hasSession) {
      router.push('/admin/login');
      return;
    }

    try {
      const match = document.cookie.match(/medicalpress_session=([^;]+)/);
      if (match && match[1]) {
        const decoded = JSON.parse(decodeURIComponent(match[1]));
        if (decoded) {
          setUser({
            name: decoded.name || 'Hospital Administrator',
            role: decoded.role || 'Super Admin',
            email: decoded.email || 'Admin@776753',
          });
        }
      }
    } catch (e) {}

    setAuthChecking(false);
  }, [pathname, router]);

  // If on login page, render children without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#131b20] flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-3 text-white">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400 font-bold">Verifying authorization...</span>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const navGroups = [
    {
      group: 'Operations & Clinical',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Appointments & Calendar', href: '/admin/appointments', icon: Calendar },
        { name: 'Doctors & Schedules', href: '/admin/doctors', icon: UserCheck },
        { name: 'Patients Directory', href: '/admin/patients', icon: Users },
        { name: 'Digital Prescriptions', href: '/admin/prescriptions', icon: Pill },
        { name: 'Medical Reports', href: '/admin/reports', icon: FileText },
        { name: 'Blood Bank Inventory', href: '/admin/blood-bank', icon: Droplet },
        { name: 'Ambulance Fleet', href: '/admin/ambulance', icon: Siren },
      ],
    },
    {
      group: 'Hospital Catalog & CRM',
      items: [
        { name: 'Departments', href: '/admin/departments', icon: Building2 },
        { name: 'Hospital Services', href: '/admin/services', icon: Activity },
        { name: 'Health Packages', href: '/admin/packages', icon: Sparkles },
        { name: 'CRM & Patient Leads', href: '/admin/leads', icon: Target },
        { name: 'Hospital Careers', href: '/admin/careers', icon: Briefcase },
        { name: 'Newsletter Subscribers', href: '/admin/newsletter', icon: Mail },
      ],
    },
    {
      group: 'CMS & Website Content',
      items: [
        { name: 'Global Content & Branding', href: '/admin/global-content', icon: Globe },
        { name: 'Health Blog CMS', href: '/admin/blog', icon: Newspaper },
        { name: 'Media Gallery', href: '/admin/gallery', icon: ImageIcon },
        { name: 'Patient Testimonials', href: '/admin/testimonials', icon: Star },
        { name: 'FAQs Management', href: '/admin/faqs', icon: HelpCircle },
        { name: 'Media Library', href: '/admin/media', icon: FolderArchive },
      ],
    },
    {
      group: 'Governance & Settings',
      items: [
        { name: 'SEO & Analytics', href: '/admin/seo', icon: Search },
        { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldCheck },
        { name: 'System Settings', href: '/admin/settings', icon: Sliders },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex">
      {/* 44. Desktop Sidebar (Section 44) */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#202B33] text-gray-300 border-r border-[#2E3C47] shrink-0">
        {/* Sidebar Brand Header */}
        <div className="h-16 px-5 border-b border-[#2E3C47] flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-primary/30">
              <div className="relative w-4 h-4 flex items-center justify-center">
                <div className="absolute w-1 h-4 bg-white rounded-sm" />
                <div className="absolute h-1 w-4 bg-white rounded-sm" />
              </div>
            </div>
            <div>
              <span className="text-base font-black text-white">Medical</span>
              <span className="text-base font-black text-primary">PRESS</span>
              <span className="block text-[9px] font-bold text-gray-400 -mt-1 tracking-wider uppercase">CMS Panel</span>
            </div>
          </Link>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navGroups.map((grp, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 px-3">
                {grp.group}
              </span>
              <nav className="space-y-0.5 pt-1">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-primary text-white font-bold shadow-md shadow-primary/20'
                          : 'text-gray-300 hover:bg-[#2A3742] hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-[#2E3C47] flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary text-primary font-bold flex items-center justify-center text-xs shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-[#2A3742] transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-[#202B33] text-gray-300 flex flex-col h-full z-10 shadow-2xl">
            <div className="h-16 px-5 border-b border-[#2E3C47] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black text-white">Medical<span className="text-primary">PRESS</span></span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {navGroups.map((grp, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 px-3">
                    {grp.group}
                  </span>
                  <nav className="space-y-0.5">
                    {grp.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                            isActive
                              ? 'bg-primary text-white font-bold'
                              : 'text-gray-300 hover:bg-[#2A3742]'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-dark hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-500">
              <span className="font-bold text-dark">Hospital CMS</span>
              <span>/</span>
              <span className="capitalize">{pathname.replace('/admin/', '').replace('/admin', 'Dashboard') || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Link to View Public Website */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-text-secondary hover:text-primary hover:border-primary transition"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Notifications Bell */}
            <Link
              href="/admin/appointments"
              className="relative p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-coral animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-coral" />
            </Link>

            {/* User Profile Badge */}
            <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-xs">
                AD
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-dark leading-tight">{user.name}</div>
                <div className="text-[10px] text-primary font-semibold leading-tight">{user.email}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
