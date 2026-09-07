'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Save, 
  CheckCircle2, 
  Globe, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  DollarSign, 
  Siren, 
  Phone, 
  Mail, 
  Building,
  RefreshCw,
  Lock
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    hospitalName: 'MedicalPress International Hospital',
    tagline: 'Advanced Healthcare & Compassionate Care',
    email: 'care@medicalpress.com',
    phone: '+1-800-654-3210',
    emergencyPhone: '+1-800-999-HELP',
    ambulancePhone: '+1-800-555-AMBU',
    address: '742 Evergreen Medical Parkway, Healthcare District, NY 10001',
    openingHours: 'Monday to Saturday — 8:00 AM to 9:00 PM',
    currency: 'USD ($)',
    timezone: 'America/New_York (EST)',
    dateFormat: 'YYYY-MM-DD',
    slotDurationDefault: '30',
    advanceBookingDays: '30',
    cancellationWindowHours: '24',
    enableAutoConfirm: true,
    preventDoubleBooking: true,
    requirePatientPhone: true,
    traumaStatus: 'Normal Capacity',
    announcementActive: true,
    announcementText: 'Welcome to MedicalPress — Advanced Healthcare & Compassionate Care',
    emergencyBannerActive: true,
    emergencyBannerText: '24/7 Level 1 Trauma & Emergency Care Available. Call hotline directly.',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setFormData((prev) => ({
            ...prev,
            ...data,
          }));
        }
      })
      .catch((err) => console.error('Failed to load settings:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      alert('Error updating system settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">System & Operational Settings</h1>
          <p className="text-xs text-text-secondary">
            Configure hospital operating schedules, booking policies, localizations, and emergency parameters.
          </p>
        </div>
        {success && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings successfully synced!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: Hospital Identity & Branding */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b pb-3 text-dark font-black text-sm">
            <Building className="w-4 h-4 text-primary" />
            <span>Hospital Identity & Contact Essentials</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">Official Hospital Name</label>
              <input
                type="text"
                required
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">Hospital Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">Official Support Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">Primary Telephone / PBX</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">24/7 Emergency Hotline</label>
              <input
                type="text"
                required
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none font-bold text-rose-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">Ambulance Dispatch Line</label>
              <input
                type="text"
                required
                value={formData.ambulancePhone}
                onChange={(e) => setFormData({ ...formData, ambulancePhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-dark mb-1">Hospital Campus Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Clinical Appointment Booking Policies */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b pb-3 text-dark font-black text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Appointment Booking Rules & Engine Config</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">Default Consultation Slot Duration</label>
              <select
                value={formData.slotDurationDefault}
                onChange={(e) => setFormData({ ...formData, slotDurationDefault: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
              >
                <option value="15">15 Minutes</option>
                <option value="20">20 Minutes</option>
                <option value="30">30 Minutes (Recommended)</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">Advance Booking Window (Days)</label>
              <input
                type="number"
                min="1"
                max="90"
                value={formData.advanceBookingDays}
                onChange={(e) => setFormData({ ...formData, advanceBookingDays: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">Cancellation Cutoff (Hours Before)</label>
              <input
                type="number"
                min="0"
                max="72"
                value={formData.cancellationWindowHours}
                onChange={(e) => setFormData({ ...formData, cancellationWindowHours: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.preventDoubleBooking}
                onChange={(e) => setFormData({ ...formData, preventDoubleBooking: e.target.checked })}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <div>
                <span className="font-bold text-dark text-xs block">Double-Booking Collision Prevention</span>
                <span className="text-[11px] text-text-secondary">
                  Automatically mark a doctor slot as reserved the instant a patient submits an appointment.
                </span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableAutoConfirm}
                onChange={(e) => setFormData({ ...formData, enableAutoConfirm: e.target.checked })}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <div>
                <span className="font-bold text-dark text-xs block">Instant Auto-Confirmation</span>
                <span className="text-[11px] text-text-secondary">
                  Immediately issue a digital confirmation slip without awaiting reception desk manual approval.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 3: Localization & Currency */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b pb-3 text-dark font-black text-sm">
            <Globe className="w-4 h-4 text-primary" />
            <span>Regional Localization, Currency & Timezone</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">Default Billing Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none font-medium"
              >
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="BDT (৳)">BDT (৳) - Bangladeshi Taka</option>
                <option value="SAR (﷼)">SAR (﷼) - Saudi Riyal</option>
                <option value="AED (AED)">AED (AED) - UAE Dirham</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">Operational Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
              >
                <option value="America/New_York (EST)">America/New_York (UTC-5)</option>
                <option value="Europe/London (GMT)">Europe/London (UTC+0)</option>
                <option value="Asia/Dhaka (BST)">Asia/Dhaka (UTC+6)</option>
                <option value="Asia/Riyadh (AST)">Asia/Riyadh (UTC+3)</option>
                <option value="Asia/Dubai (GST)">Asia/Dubai (UTC+4)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">Date Format Representation</label>
              <select
                value={formData.dateFormat}
                onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO standard)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (UK / International)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US standard)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Trauma & Emergency Controls */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b pb-3 text-dark font-black text-sm">
            <Siren className="w-4 h-4 text-rose-500" />
            <span>Emergency Operations & Trauma Center Status</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">Level 1 Trauma Center Capacity</label>
              <select
                value={formData.traumaStatus}
                onChange={(e) => setFormData({ ...formData, traumaStatus: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none font-bold text-dark"
              >
                <option value="Normal Capacity">Normal Capacity (Accepting all critical & walk-in cases)</option>
                <option value="High Surge">High Surge (Critical resuscitation prioritization)</option>
                <option value="Diversion">Diversion Alert (Non-life threatening diverted to nearby campus)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-dark mb-1">Emergency Red Banner Status</label>
              <div className="pt-2">
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emergencyBannerActive}
                    onChange={(e) => setFormData({ ...formData, emergencyBannerActive: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500"
                  />
                  <span className="font-bold text-dark text-xs">
                    Display top-level emergency broadcast banner on public portal
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-dark mb-1">Emergency Banner Message</label>
            <input
              type="text"
              value={formData.emergencyBannerText}
              onChange={(e) => setFormData({ ...formData, emergencyBannerText: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-md shadow-primary/20 flex items-center space-x-2 transition text-xs"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving System Configuration...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All System Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
