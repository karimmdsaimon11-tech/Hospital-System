'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Sliders,
  User,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  UploadCloud,
  Upload,
  RefreshCw
} from 'lucide-react';

export default function AdminGlobalContentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [doctorList, setDoctorList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    hospitalName: 'Green Shifa Hospital',
    tagline: 'Advanced Healthcare & Compassionate Care',
    phone: '+1-800-654-3210',
    emergencyPhone: '+1-800-999-HELP',
    ambulancePhone: '+1-800-555-AMBU',
    email: 'care@medicalpress.com',
    address: '742 Evergreen Medical Parkway, Healthcare District, NY 10001',
    openingHours: 'Monday to Saturday — 8:00 AM to 9:00 PM',
    announcementText: 'Welcome to Green Shifa Hospital — Advanced Healthcare & Compassionate Care',
    announcementActive: true,
    emergencyBannerText: '24/7 Level 1 Trauma & Emergency Care Available. Call hotline directly.',
    emergencyBannerActive: true,
    copyright: '© 2026 Green Shifa Hospital. All rights reserved.',
    facebook: 'https://facebook.com/medicalpress',
    twitter: 'https://twitter.com/medicalpress',
    instagram: 'https://instagram.com/medicalpress',
    linkedin: 'https://linkedin.com/company/medicalpress',
    youtube: 'https://youtube.com/medicalpress',
    heroDoctorImage: '',
    heroDoctorName: '',
    heroDoctorTitle: '',
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
            heroDoctorImage: data.heroDoctorImage || '',
            heroDoctorName: data.heroDoctorName || '',
            heroDoctorTitle: data.heroDoctorTitle || '',
          }));
        }
      })
      .catch(() => {});

    fetch('/api/doctors', { cache: 'no-store' })
      .then((res) => res.json())
      .then((docs) => {
        if (Array.isArray(docs)) setDoctorList(docs);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setUploading(true);
    setUploadError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Optimize and resize image with Canvas (max width 900px, 85% JPEG)
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 1125; // 4:5 ratio
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setFormData((prev) => ({ ...prev, heroDoctorImage: compressedDataUrl }));
        } else {
          setFormData((prev) => ({ ...prev, heroDoctorImage: event.target?.result as string }));
        }
        setUploading(false);
      };
      img.onerror = () => {
        setUploadError('Failed to process image file.');
        setUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('Failed to read file from your device.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

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

        {/* 2. Homepage Hero Doctor Photo & Showcase */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-soft space-y-5">
          <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-black text-dark flex items-center space-x-2">
                <User className="w-4 h-4 text-primary" />
                <span>2. Homepage Hero Doctor Photo & Showcase (Right Frame)</span>
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Add your doctor photo here anytime. If left empty, the frame on the homepage will stay as an empty shape slot.
              </p>
            </div>
            {formData.heroDoctorImage && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, heroDoctorImage: '', heroDoctorName: '', heroDoctorTitle: '' })}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Keep Shape Empty</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Form Fields */}
            <div className="md:col-span-8 space-y-4">
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Upload Dropzone / Photo Status */}
              <div>
                <label className="block font-bold text-dark text-sm mb-2 flex items-center justify-between">
                  <span>Upload Doctor Photo</span>
                  {uploading && <span className="text-xs text-primary animate-pulse">Processing...</span>}
                </label>

                {uploadError && (
                  <div className="mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {!formData.heroDoctorImage ? (
                  /* Empty state - Big Upload Box */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-primary bg-gray-50/50 hover:bg-primary/[0.03] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition text-center group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition shadow-sm">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-black text-dark group-hover:text-primary transition">
                      {uploading ? 'Compressing & Loading Photo...' : 'Click Here to Upload Photo from Computer / Phone'}
                    </span>
                    <span className="text-xs text-text-secondary mt-1">
                      Supports JPG, PNG, WEBP. Photo will be automatically optimized for the website.
                    </span>
                    <span className="mt-3 px-3 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-600 group-hover:border-primary group-hover:text-primary transition">
                      📁 Browse Files
                    </span>
                  </div>
                ) : (
                  /* Uploaded state - Success Bar with Change & Remove */
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-14 rounded-xl overflow-hidden border border-emerald-300 bg-white shadow-sm shrink-0">
                        <img src={formData.heroDoctorImage} alt="Uploaded" className="w-full h-full object-cover object-top" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Photo Uploaded Successfully</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          Click Save below to publish this photo onto the live homepage!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-300 hover:border-primary text-dark hover:text-primary rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, heroDoctorImage: '' })}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Select from existing Doctors */}
              {doctorList.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Or Pick From Hospital Doctors List</span>
                  </label>
                  <select
                    onChange={(e) => {
                      const selected = doctorList.find((d) => d.id === e.target.value);
                      if (selected) {
                        setFormData({
                          ...formData,
                          heroDoctorImage: selected.photo || '',
                          heroDoctorName: selected.name || '',
                          heroDoctorTitle: selected.specialty || '',
                        });
                      }
                    }}
                    defaultValue=""
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark text-sm bg-white"
                  >
                    <option value="" disabled>-- Pick registered doctor --</option>
                    {doctorList.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-dark text-sm mb-1">
                    Doctor Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Addison Alexander"
                    value={formData.heroDoctorName}
                    onChange={(e) => setFormData({ ...formData, heroDoctorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark text-sm mb-1">
                    Doctor Specialty / Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chief Interventional Cardiologist"
                    value={formData.heroDoctorTitle}
                    onChange={(e) => setFormData({ ...formData, heroDoctorTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="md:col-span-4 flex flex-col items-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Homepage Live Preview
              </span>
              <div className="w-48 aspect-[4/5] rounded-2xl overflow-hidden border-2 border-gray-800 bg-[#1b2b35] relative shadow-lg flex items-center justify-center">
                {formData.heroDoctorImage ? (
                  <>
                    <img
                      src={formData.heroDoctorImage}
                      alt="Doctor Preview"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {formData.heroDoctorName && (
                      <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/75 backdrop-blur-sm text-white text-[10px]">
                        <div className="font-bold truncate">{formData.heroDoctorName}</div>
                        <div className="text-[9px] text-primary truncate">{formData.heroDoctorTitle || 'Consultant'}</div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-[calc(100%-16px)] h-[calc(100%-16px)] border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center p-3 text-center">
                    <User className="w-8 h-8 text-primary/60 mb-2" />
                    <span className="text-[11px] font-bold text-white/80 leading-tight">Empty Shape</span>
                    <span className="text-[9px] text-gray-400 mt-1 leading-tight">Awaiting photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Numbers & Operating Hours */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-soft space-y-4">
          <h2 className="text-base font-black text-dark border-b pb-2 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-primary" />
            <span>3. Global Hospital Phone Numbers & Operating Hours</span>
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
            <span>4. Top Announcement Bar & Emergency Notice</span>
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
            <span>5. Footer & Social Channels</span>
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
