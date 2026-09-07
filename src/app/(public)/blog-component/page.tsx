'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  MessageSquare, 
  Sparkles, 
  Flame, 
  Clock 
} from 'lucide-react';

export default function BlogComponentPage() {
  const [sidebarTab, setSidebarTab] = useState<'popular' | 'latest' | 'comments'>('popular');

  const categories = ['Environment', 'Health Basics', 'Lifestyle', 'Motivation'];
  const tags = [
    'benefits',
    'blood pressure',
    'body',
    'caring others',
    'clean environment',
    'doing good',
    'friendly staff',
    'habit',
    'health',
    'inspiring',
    'kids health',
    'learning',
    'tips',
    'willpower',
  ];

  return (
    <div className="min-h-screen bg-[#EEF5F7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Blog Component Reference</span>
        </nav>

        <h1 className="text-3xl font-black text-dark tracking-tight">
          Healthcare Editorial & Blog Layout (Section 67)
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-text-secondary">
          Demonstration of editorial bullet list styles, message alerts, 6-button variants, sidebar tabs, categories, and tags.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Editorial Article Box */}
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-soft space-y-6">
              <h2 className="text-2xl font-black text-dark tracking-tight">
                Editorial Typography & List Standards
              </h2>

              <p className="text-sm text-text-secondary leading-relaxed">
                Medical communication demands crystal-clear visual hierarchy. Below are our approved list styles, 
                callout alerts, and interactive button variants.
              </p>

              {/* 67. LIST STYLES (Arrow bullets, circular icon bullets, numbered bullets) */}
              <div className="space-y-6 pt-4 border-t border-gray-100">
                <h3 className="text-base font-extrabold text-dark">List Style Variants:</h3>

                {/* 1. Arrow bullets */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">A. Arrow Bullets</h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                    {['Continuous patient biometric telemetry monitoring', 'Robotic-assisted orthopedic joint kinematic alignment', 'Automated laboratory specimen barcoding and tracking'].map((item, i) => (
                      <li key={i} className="flex items-center space-x-2.5">
                        <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Circular icon bullets */}
                <div className="space-y-2 pt-3">
                  <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">B. Circular Icon Bullets</h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                    {['ISO Class 5 ultra-sterile laminar airflow operating rooms', 'Dedicated Level 1 trauma resuscitation bays with mobile radiology', 'Direct bedside medication reconciliation by clinical pharmacists'].map((item, i) => (
                      <li key={i} className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Numbered bullets */}
                <div className="space-y-2 pt-3">
                  <h4 className="text-xs font-bold text-dark uppercase tracking-wider">C. Numbered Bullets</h4>
                  <ol className="space-y-2 text-xs sm:text-sm text-gray-700 list-none">
                    {['Initial triage and vital signs evaluation at reception desk', 'Targeted clinical examination by consultant specialist', 'Instant digital diagnostic report upload and prescription dispatch'].map((item, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-black flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* 67. BUTTONS (Six Styles: Dark, Cyan, Green, Yellow, Red, Orange) */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <h3 className="text-base font-extrabold text-dark">Six Button Styles:</h3>
                <div className="flex flex-wrap gap-2.5">
                  <button className="px-4 py-2 bg-dark text-white rounded-lg text-xs font-bold shadow hover:bg-dark/80">Dark</button>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow hover:bg-primary-hover">Cyan</button>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow hover:bg-emerald-700">Green</button>
                  <button className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold shadow hover:bg-amber-600">Yellow</button>
                  <button className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold shadow hover:bg-rose-700">Red</button>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold shadow hover:bg-orange-600">Orange</button>
                </div>
              </div>

              {/* 67. MESSAGES (Information alert: "Information: Lorem ipsum dolor sit amet...") */}
              <div className="pt-6 border-t border-gray-100">
                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs sm:text-sm flex items-start space-x-3">
                  <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-black">Information:</strong>
                    <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 67. Sidebar Tabs (Popular, Latest, Comments) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft space-y-4">
              <div className="flex border-b border-gray-200">
                {[
                  { key: 'popular', label: 'Popular', icon: Flame },
                  { key: 'latest', label: 'Latest', icon: Clock },
                  { key: 'comments', label: 'Comments', icon: MessageSquare },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setSidebarTab(tab.key as any)}
                      className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center space-x-1.5 border-b-2 transition ${
                        sidebarTab === tab.key
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-400 hover:text-dark'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 text-xs">
                {sidebarTab === 'popular' && (
                  <>
                    <div className="pb-2 border-b border-gray-100">
                      <Link href="/blog" className="font-bold text-dark hover:text-primary transition line-clamp-2">
                        10 Essential Steps for Maintaining a Resilient Heart in 2026
                      </Link>
                      <span className="text-[11px] text-gray-400">1,420 views</span>
                    </div>
                    <div className="pb-2 border-b border-gray-100">
                      <Link href="/blog" className="font-bold text-dark hover:text-primary transition line-clamp-2">
                        Understanding Modern Minimally Invasive Joint Replacement
                      </Link>
                      <span className="text-[11px] text-gray-400">980 views</span>
                    </div>
                  </>
                )}

                {sidebarTab === 'latest' && (
                  <>
                    <div className="pb-2 border-b border-gray-100">
                      <Link href="/blog" className="font-bold text-dark hover:text-primary transition line-clamp-2">
                        Early Detection of Diabetes: Warning Signs You Shouldn’t Ignore
                      </Link>
                      <span className="text-[11px] text-gray-400">Published today</span>
                    </div>
                    <div className="pb-2 border-b border-gray-100">
                      <Link href="/blog" className="font-bold text-dark hover:text-primary transition line-clamp-2">
                        The Silent Threat of Sleep Apnea on Neurological Function
                      </Link>
                      <span className="text-[11px] text-gray-400">2 days ago</span>
                    </div>
                  </>
                )}

                {sidebarTab === 'comments' && (
                  <div className="text-gray-500 py-2">
                    <p className="font-bold text-dark">&ldquo;Very helpful advice for heart health!&rdquo;</p>
                    <span className="text-[11px] text-primary">— Michael H.</span>
                  </div>
                )}
              </div>
            </div>

            {/* 67. Categories (Environment, Health Basics, Lifestyle, Motivation) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft space-y-3">
              <h3 className="text-sm font-extrabold text-dark border-b border-gray-100 pb-2">
                Editorial Categories
              </h3>
              <ul className="space-y-2 text-xs">
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link href={`/blog?category=${encodeURIComponent(cat)}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-dark hover:text-primary transition">
                      <span>{cat}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 67. Tags Cloud */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft space-y-3">
              <h3 className="text-sm font-extrabold text-dark border-b border-gray-100 pb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tg) => (
                  <Link
                    key={tg}
                    href={`/blog?tag=${encodeURIComponent(tg)}`}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded text-[11px] font-semibold text-gray-700 transition"
                  >
                    #{tg}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
