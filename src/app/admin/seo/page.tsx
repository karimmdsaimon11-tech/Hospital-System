'use client';

import React, { useState, useEffect } from 'react';
import { Search, Globe, Eye, Save, Sparkles, CheckCircle2, ShieldAlert, Share2, Layers } from 'lucide-react';

export default function AdminSeoPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState('/');
  const [currentForm, setCurrentForm] = useState({
    pagePath: '/',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogImage: '',
    robots: 'index, follow',
    schemaType: 'Hospital',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Global analytics scripts
  const [tracking, setTracking] = useState({
    gaId: 'G-MEDPRESS2026',
    metaPixelId: 'PIXEL-99482103',
    gscVerification: 'google-site-verification=mp-health-auth-key-8831',
  });
  const [savingTracking, setSavingTracking] = useState(false);
  const [trackingSaved, setTrackingSaved] = useState(false);

  const fetchSeoPages = () => {
    setLoading(true);
    fetch('/api/seo')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPages(data);
          const current = data.find((p) => p.pagePath === selectedRoute) || data[0];
          if (current) {
            setSelectedRoute(current.pagePath);
            setCurrentForm({
              pagePath: current.pagePath,
              metaTitle: current.metaTitle || '',
              metaDescription: current.metaDescription || '',
              keywords: current.keywords || '',
              ogImage: current.ogImage || '',
              robots: current.robots || 'index, follow',
              schemaType: current.schemaType || 'MedicalWebPage',
            });
          }
        }
      })
      .catch((err) => console.error('Error loading SEO:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSeoPages();
  }, []);

  const handleSelectPage = (path: string) => {
    setSelectedRoute(path);
    const found = pages.find((p) => p.pagePath === path);
    if (found) {
      setCurrentForm({
        pagePath: found.pagePath,
        metaTitle: found.metaTitle || '',
        metaDescription: found.metaDescription || '',
        keywords: found.keywords || '',
        ogImage: found.ogImage || '',
        robots: found.robots || 'index, follow',
        schemaType: found.schemaType || 'MedicalWebPage',
      });
    } else {
      setCurrentForm({
        pagePath: path,
        metaTitle: `MedicalPress Hospital — ${path.replace('/', '').toUpperCase() || 'Home'}`,
        metaDescription: 'Advanced healthcare services, online appointment booking and patient care.',
        keywords: 'hospital, doctor, medical',
        ogImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
        robots: 'index, follow',
        schemaType: 'MedicalWebPage',
      });
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentForm),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        fetchSeoPages();
      } else {
        alert('Failed to save SEO metadata');
      }
    } catch (err) {
      alert('Error updating SEO metadata');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTracking(true);
    setTimeout(() => {
      setSavingTracking(false);
      setTrackingSaved(true);
      setTimeout(() => setTrackingSaved(false), 3000);
    }, 800);
  };

  const standardRoutes = [
    { path: '/', label: 'Homepage' },
    { path: '/appointment', label: 'Book Appointment (3D Clipboard)' },
    { path: '/doctors', label: 'Doctor Directory' },
    { path: '/departments', label: 'Clinical Departments' },
    { path: '/emergency', label: '24/7 Emergency & Trauma' },
    { path: '/patient-portal', label: 'Patient E-Portal & Reports' },
    { path: '/packages', label: 'Health Checkup Packages' },
    { path: '/blood-bank', label: 'Blood Bank Reserves' },
    { path: '/contact', label: 'Contact & Campus Map' },
    { path: '/careers', label: 'Hospital Careers' },
    { path: '/blog', label: 'Health Knowledge Blog' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Search Engine Optimization (SEO) & Analytics</h1>
          <p className="text-xs text-text-secondary">
            Control Google search snippets, OpenGraph social cards, Schema.org medical markup, and tracking tags.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Routes Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h2 className="text-xs font-black text-dark uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>Select Hospital Route</span>
            </h2>
            <div className="space-y-1">
              {standardRoutes.map((route) => {
                const isSelected = selectedRoute === route.path;
                return (
                  <button
                    key={route.path}
                    onClick={() => handleSelectPage(route.path)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div>
                      <div className="leading-tight">{route.label}</div>
                      <div className={`text-[10px] font-mono ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                        {route.path}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tracking Codes Box */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-dark uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tracking & Analytics</span>
            </h3>

            {trackingSaved && (
              <div className="p-2.5 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Analytics tags updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveTracking} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-dark mb-1">Google Analytics 4 (GA4)</label>
                <input
                  type="text"
                  value={tracking.gaId}
                  onChange={(e) => setTracking({ ...tracking, gaId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-1.5 border rounded-lg font-mono text-[11px] focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-dark mb-1">Meta / Facebook Pixel ID</label>
                <input
                  type="text"
                  value={tracking.metaPixelId}
                  onChange={(e) => setTracking({ ...tracking, metaPixelId: e.target.value })}
                  placeholder="e.g. 1234567890"
                  className="w-full px-3 py-1.5 border rounded-lg font-mono text-[11px] focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-dark mb-1">Google Search Console Verification</label>
                <input
                  type="text"
                  value={tracking.gscVerification}
                  onChange={(e) => setTracking({ ...tracking, gscVerification: e.target.value })}
                  placeholder="meta tag content"
                  className="w-full px-3 py-1.5 border rounded-lg font-mono text-[11px] focus:border-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingTracking}
                className="w-full py-2 bg-dark hover:bg-black text-white rounded-xl font-bold transition text-xs flex items-center justify-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingTracking ? 'Saving...' : 'Save Tracking Keys'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Form: SEO Metadata & Live Previews */}
        <div className="lg:col-span-8 space-y-6">
          {/* Metadata Form */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                  Editing Route: {selectedRoute}
                </span>
                <h2 className="text-base font-black text-dark mt-1">Metadata & Meta Tags Configuration</h2>
              </div>
              {savedSuccess && (
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Published to Live Site!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSeo} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-dark">SEO Meta Title</label>
                  <span
                    className={`text-[10px] font-bold ${
                      currentForm.metaTitle.length > 60 ? 'text-amber-500' : 'text-gray-400'
                    }`}
                  >
                    {currentForm.metaTitle.length} / 60 characters
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={currentForm.metaTitle}
                  onChange={(e) => setCurrentForm({ ...currentForm, metaTitle: e.target.value })}
                  placeholder="e.g. Best Cardiology Hospital in NY | MedicalPress"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-dark">Meta Description</label>
                  <span
                    className={`text-[10px] font-bold ${
                      currentForm.metaDescription.length > 160 ? 'text-amber-500' : 'text-gray-400'
                    }`}
                  >
                    {currentForm.metaDescription.length} / 160 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={currentForm.metaDescription}
                  onChange={(e) => setCurrentForm({ ...currentForm, metaDescription: e.target.value })}
                  placeholder="Provide a compelling overview for Google search snippets..."
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-dark mb-1">Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    value={currentForm.keywords}
                    onChange={(e) => setCurrentForm({ ...currentForm, keywords: e.target.value })}
                    placeholder="doctor, heart surgery, emergency clinic"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-dark mb-1">Robots Directives</label>
                  <select
                    value={currentForm.robots}
                    onChange={(e) => setCurrentForm({ ...currentForm, robots: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-xs"
                  >
                    <option value="index, follow">index, follow (Standard Indexable)</option>
                    <option value="noindex, follow">noindex, follow (Hide From SERP)</option>
                    <option value="noindex, nofollow">noindex, nofollow (Strict Private)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-dark mb-1">OpenGraph / Social Card Image URL</label>
                  <input
                    type="text"
                    value={currentForm.ogImage}
                    onChange={(e) => setCurrentForm({ ...currentForm, ogImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-dark mb-1">Schema.org Structured Data Type</label>
                  <select
                    value={currentForm.schemaType}
                    onChange={(e) => setCurrentForm({ ...currentForm, schemaType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-xs"
                  >
                    <option value="Hospital">Hospital / MedicalOrganization</option>
                    <option value="MedicalWebPage">MedicalWebPage</option>
                    <option value="EmergencyService">EmergencyService</option>
                    <option value="MedicalCondition">MedicalCondition</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-md shadow-primary/20 flex items-center space-x-2 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Publishing Changes...' : 'Save & Publish Meta Settings'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview: Google Search Result Snippet */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-xs font-black text-dark uppercase tracking-wider">
              <Eye className="w-4 h-4 text-primary" />
              <span>Google SERP Snippet Preview (Desktop / Mobile)</span>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-gray-200 rounded-xl space-y-1.5 max-w-2xl">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  M
                </div>
                <span className="font-medium">https://medicalpress.com{currentForm.pagePath}</span>
              </div>
              <h3 className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                {currentForm.metaTitle || 'MedicalPress Hospital | Advanced Healthcare'}
              </h3>
              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                {currentForm.metaDescription ||
                  'Leading international multi-specialty hospital providing 24/7 trauma emergency, advanced surgery, cardiology, and digital appointments.'}
              </p>
            </div>
          </div>

          {/* Live Preview: Social Share Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-xs font-black text-dark uppercase tracking-wider">
              <Share2 className="w-4 h-4 text-primary" />
              <span>Social Media Card Preview (Facebook / LinkedIn / Twitter)</span>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden max-w-md bg-white shadow-sm">
              {currentForm.ogImage ? (
                <div className="h-44 w-full bg-gray-100 overflow-hidden relative">
                  <img
                    src={currentForm.ogImage}
                    alt="Social preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-44 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                  No preview image specified
                </div>
              )}
              <div className="p-3.5 space-y-1 bg-gray-50 border-t border-gray-100">
                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">medicalpress.com</div>
                <div className="text-xs font-bold text-dark truncate">
                  {currentForm.metaTitle || 'MedicalPress Hospital'}
                </div>
                <div className="text-[11px] text-gray-600 line-clamp-1">
                  {currentForm.metaDescription || 'International tertiary hospital and emergency center.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
