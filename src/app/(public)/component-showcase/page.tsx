'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  ChevronUp, 
  Minus, 
  Plus, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

export default function ComponentShowcasePage() {
  // 66. Tabs State
  const [activeTab, setActiveTab] = useState<'first' | 'second' | 'third'>('first');

  // 66. Accordion State
  const [activeAccordion, setActiveAccordion] = useState<number | null>(1);

  // 66. Toggle State
  const [toggleOpen, setToggleOpen] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header & Breadcrumbs */}
        <div>
          <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
            <Link href="/" className="hover:text-primary transition">Medical Press</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-dark font-bold">Component Showcase</span>
          </nav>
          <h1 className="text-3xl font-black text-dark tracking-tight">
            UI Components & Design System Reference (Section 66)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary">
            Live interactive preview of hospital design-system components, buttons, tabs with green top borders, and accordions.
          </p>
        </div>

        {/* 66. TABS (First Tab, Second Tab, Third Tab; Active Tab: Thin green top line) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-soft space-y-4">
          <h2 className="text-lg font-black text-dark">1. Tabs Component (Thin Green Top Line)</h2>
          
          <div className="flex border-b border-gray-200">
            {[
              { key: 'first', label: 'First Tab' },
              { key: 'second', label: 'Second Tab' },
              { key: 'third', label: 'Third Tab' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-3 px-6 text-xs sm:text-sm font-bold transition border-t-2 ${
                  activeTab === tab.key
                    ? 'border-t-emerald-500 text-emerald-700 bg-emerald-50/20'
                    : 'border-t-transparent text-gray-500 hover:text-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 bg-white border border-gray-100 rounded-xl text-xs sm:text-sm text-text-secondary leading-relaxed shadow-sm">
            {activeTab === 'first' && (
              <p>
                <strong>First Tab Content:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            )}
            {activeTab === 'second' && (
              <p>
                <strong>Second Tab Content:</strong> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            )}
            {activeTab === 'third' && (
              <p>
                <strong>Third Tab Content:</strong> Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.
              </p>
            )}
          </div>
        </div>

        {/* 66. ACCORDION (First: Green header, white text, up chevron; Second/Third: White header, dark text, down chevron) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-soft space-y-4">
          <h2 className="text-lg font-black text-dark">2. Accordion Component</h2>

          <div className="space-y-3">
            {/* First: Green header, white text, up chevron */}
            <div className="rounded-xl overflow-hidden border border-emerald-600 shadow-sm">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 1 ? null : 1)}
                className="w-full p-4 bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition"
              >
                <span>First Accordion Item (Green Header)</span>
                {activeAccordion === 1 ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
              </button>
              {activeAccordion === 1 && (
                <div className="p-5 bg-white text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-emerald-100">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
                </div>
              )}
            </div>

            {/* Second: White header, dark text, down chevron */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 2 ? null : 2)}
                className="w-full p-4 bg-white text-dark font-bold text-xs sm:text-sm flex items-center justify-between transition hover:bg-gray-50"
              >
                <span>Second Accordion Item (White Header)</span>
                {activeAccordion === 2 ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              {activeAccordion === 2 && (
                <div className="p-5 bg-white text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-gray-100">
                  Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.
                </div>
              )}
            </div>

            {/* Third: White header, dark text, down chevron */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 3 ? null : 3)}
                className="w-full p-4 bg-white text-dark font-bold text-xs sm:text-sm flex items-center justify-between transition hover:bg-gray-50"
              >
                <span>Third Accordion Item (White Header)</span>
                {activeAccordion === 3 ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              {activeAccordion === 3 && (
                <div className="p-5 bg-white text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-gray-100">
                  Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 66. TOGGLES (Coral/red header, text: "First Toggle Item", minus icon, white content) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-soft space-y-4">
          <h2 className="text-lg font-black text-dark">3. Toggles Component (Coral/Red Header)</h2>

          <div className="rounded-xl overflow-hidden border border-coral shadow-sm">
            <button
              onClick={() => setToggleOpen(!toggleOpen)}
              className="w-full p-4 bg-coral text-white font-bold text-xs sm:text-sm flex items-center justify-between transition"
            >
              <span>First Toggle Item</span>
              {toggleOpen ? <Minus className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
            </button>
            {toggleOpen && (
              <div className="p-5 bg-white text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-coral/20">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </div>
            )}
          </div>
        </div>

        {/* 66. BUTTONS (Six Styles: Dark, Cyan, Green, Yellow, Red, Orange) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-soft space-y-4">
          <h2 className="text-lg font-black text-dark">4. Six Button Styles (Section 66 & 67)</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-2.5 rounded-lg bg-dark text-white text-xs font-bold shadow hover:bg-dark/80 transition">
              Dark Button
            </button>
            <button className="px-5 py-2.5 rounded-lg bg-primary text-white text-xs font-bold shadow hover:bg-primary-hover transition">
              Cyan Button
            </button>
            <button className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700 transition">
              Green Button
            </button>
            <button className="px-5 py-2.5 rounded-lg bg-amber-500 text-white text-xs font-bold shadow hover:bg-amber-600 transition">
              Yellow Button
            </button>
            <button className="px-5 py-2.5 rounded-lg bg-rose-600 text-white text-xs font-bold shadow hover:bg-rose-700 transition">
              Red Button
            </button>
            <button className="px-5 py-2.5 rounded-lg bg-orange-500 text-white text-xs font-bold shadow hover:bg-orange-600 transition">
              Orange Button
            </button>
          </div>
        </div>

        {/* 66. MESSAGES / ALERTS (Information alert: "Information: Lorem ipsum dolor sit amet...") */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-soft space-y-4">
          <h2 className="text-lg font-black text-dark">5. Alert Messages</h2>
          
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs sm:text-sm flex items-start space-x-3">
            <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Information:</strong>
              <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Success:</strong>
              <span>Your appointment request has been submitted successfully to our hospital database.</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Attention Required:</strong>
              <span>Please complete all required fields before submitting your clinical requisition.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
