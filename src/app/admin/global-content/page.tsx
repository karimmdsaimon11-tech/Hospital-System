'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Globe, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Clock, 
  MapPin, 
  Building2,
  Sliders
} from 'lucide-react';

export default function AdminGlobalContentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    hospitalName: 'MedicalPress Hospital',
    tagline: 'Advanced Healthcare & Compassionate Care',
    phone: '+1-800-654-3210',
    emergencyPhone: '+1-800-999-HELP',
    ambulancePhone: '+1-800-555-AMBU',
    email: 'care@medicalpress.com',
    address: '742 Evergreen Medical Parkway, Healthcare District, NY 10001',
    openingHours: 'Monday to Saturday — 8:00 AM to 9:00 PM',
    announcementText: 'Welcome to MedicalPress — Advanced Healthcare & Compassionate Care',
    announcementActive: true,
    emergencyBannerText: '24/7 Level 1 Trauma & Emergency Care Available. Call hotline directly.',
    emergencyBannerActive: true,
    copyright: '© 2026 MedicalPress International Hospital. All rights reserved.',
    facebook: 'https://facebook.com/medicalpress',
    twitter: 'https://twitter.com/medicalpress',
    instagram: 'https://instagram.com/medicalpress',
    linkedin: 'https://linkedin.com/company/medicalpress',
    youtube: 'https://youtube.com/medicalpress',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadSettings = () => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hospitalName) {
          setFormData((prev) => ({
            ...prev,
            ...data,
          }));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      const updated = await res.json();
      if (updated && updated.hospitalName) {
        setFormData((prev) => ({ ...prev, ...updated }));
      }

      // Notify other components (Navbar, Footer) in the browser
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('hospital-settings-updated', { detail: updated }));
      }

      router.refresh();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Global Content & Branding CMS</h1>
          <p className="text-xs text-text-secondary">
            Changes saved here automatically update the public website header, announcement bar, contact info, and footer immediately.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Hospital global data successfully saved! Public website has been refreshed with the new information.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Hospital Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-soft space-y-4">
          <h2 className="text-base font-black text-dark border-b pb-2 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span>1. Hospital Identity & Branding</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-dark mb-1">Hospital Display Name</label>
              <input
                type="text"
                required
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark"
              />
            </div>
            <div>
              <label className="block font-bold text-dark mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & Operating Hours */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-soft space-y-4">
          <h2 className="text-base font-black text-dark border-b pb-2 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-primary" />
            <span>2. Global Hospital Phone Numbers & Operating Hours</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-dark mb-1">Main Reception / Contact Phone</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark"
              />
            </div>
            <div>
              <label className="block font-bold text-dark mb-1">24/7 Emergency Hotline</label>
              <input
                type="text"
                required
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-coral font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-dark mb-1">Ambulance Dispatch Number</label>
              <input
                type="text"
                value={formData.ambulancePhone}
                onChange={(e) => setFormData({ ...formData, ambulancePhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-bold text-dark mb-1">General Inquiries Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark"
              />
            </div>
            <div>
              <label className="block font-bold text-dark mb-1">Outpatient Clinic Hours</label>
              <input
                type="text"
                required
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-dark mb-1">Physical Campus Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark"
              />
            </div>
          </div>
        </div>

        {/* Top Announcement Bar & Emergency Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-soft space-y-4">
          <h2 className="text-base font-black text-dark border-b pb-2 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-primary" />
            <span>3. Top Announcement Bar & Emergency Notice</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-dark">Top Announcement Bar Active</label>
              <input
                type="checkbox"
                checked={formData.announcementActive}
                onChange={(e) => setFormData({ ...formData, announcementActive: e.target.checked })}
                className="w-4 h-4 text-primary"
              />
            </div>
            <input
              type="text"
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark"
            />
          </div>

          <div className="space-y-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <label className="font-bold text-dark">Emergency Care Announcement Active</label>
              <input
                type="checkbox"
                checked={formData.emergencyBannerActive}
                onChange={(e) => setFormData({ ...formData, emergencyBannerActive: e.target.checked })}
                className="w-4 h-4 text-coral"
              />
            </div>
            <input
              type="text"
              value={formData.emergencyBannerText}
              onChange={(e) => setFormData({ ...formData, emergencyBannerText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark"
            />
          </div>
        </div>

        {/* Footer & Social Media */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-soft space-y-4">
          <h2 className="text-base font-black text-dark border-b pb-2 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-primary" />
            <span>4. Footer & Social Channels</span>
          </h2>

          <div>
            <label className="block font-bold text-dark mb-1">Footer Copyright Notice</label>
            <input
              type="text"
              value={formData.copyright}
              onChange={(e) => setFormData({ ...formData, copyright: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-bold text-dark mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-dark"
              />
            </div>
            <div>
              <label className="block font-bold text-dark mb-1">Twitter / X URL</label>
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-dark"
              />
            </div>
            <div>
              <label className="block font-bold text-dark mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-dark"
              />
            </div>
            <div>
              <label className="block font-bold text-dark mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-dark"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-sm shadow-lg shadow-primary/20 transition flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing Changes...' : 'Save & Update Public Website'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
