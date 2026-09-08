'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Calendar, 
  Clock, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  X,
  UploadCloud,
  Upload,
  User,
  Filter,
  Sparkles
} from 'lucide-react';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    departmentId: '',
    experience: '10+ Years Experience',
    qualification: 'MD, Board Certified',
    visitingHours: 'Mon - Fri: 09:00 AM - 01:00 PM',
    consultationFee: 120,
    phone: '+1-800-654-3210',
    email: '',
    bio: '',
    photo: '',
    featured: true,
  });

  const fetchDoctors = () => {
    setLoading(true);
    fetch(`/api/doctors?search=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDoctors(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDoctors();
    fetch('/api/departments').then((res) => res.json()).then((data) => Array.isArray(data) && setDepartments(data));
  }, [search]);

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
      const img = new (window as any).Image();
      img.onload = () => {
        // Optimize and resize image with Canvas (max width 800px, 85% JPEG)
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 1000; // 4:5 ratio
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
          setFormData((prev) => ({ ...prev, photo: compressedDataUrl }));
        } else {
          setFormData((prev) => ({ ...prev, photo: event.target?.result as string }));
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
      setUploadError('Failed to read file from device.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setUploadError('');
    setFormData({
      name: '',
      specialty: '',
      departmentId: departments[0]?.id || '',
      experience: '10+ Years Experience',
      qualification: 'MD, Board Certified',
      visitingHours: 'Mon - Fri: 09:00 AM - 01:00 PM',
      consultationFee: 120,
      phone: '+1-800-654-3210',
      email: '',
      bio: '',
      photo: '',
      featured: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (doc: any) => {
    setEditingDoc(doc);
    setFormData({
      name: doc.name,
      specialty: doc.specialty,
      departmentId: doc.departmentId,
      experience: doc.experience,
      qualification: doc.qualification,
      visitingHours: doc.visitingHours,
      consultationFee: doc.consultationFee,
      phone: doc.phone,
      email: doc.email,
      bio: doc.bio,
      photo: doc.photo,
      featured: doc.featured,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the medical faculty?`)) return;

    try {
      await fetch(`/api/doctors?id=${id}`, { method: 'DELETE' });
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert('Failed to delete doctor');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingDoc) {
        // Update
        const res = await fetch('/api/doctors', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingDoc.id, ...formData }),
        });
        const updated = await res.json();
        setDoctors((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      } else {
        // Create
        const res = await fetch('/api/doctors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const created = await res.json();
        setDoctors((prev) => [created, ...prev]);
      }
      setShowModal(false);
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleBatchAdd = async (count = 5) => {
    if (!departments.length) {
      alert('Please wait for departments to load or create departments first.');
      return;
    }
    setLoading(true);
    try {
      for (let i = 1; i <= count; i++) {
        const deptIndex = (doctors.length + i - 1) % departments.length;
        const res = await fetch('/api/doctors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Dr. New Specialist #${doctors.length + i}`,
            specialty: `${departments[deptIndex].name.replace(' Clinic', '')} Specialist`,
            departmentId: departments[deptIndex].id,
            experience: '10+ Years Experience',
            qualification: 'MBBS, FCPS / MD',
            visitingHours: 'Mon - Fri: 09:00 AM - 01:00 PM',
            consultationFee: 120,
            phone: '+1-800-654-3210',
            email: `doctor${doctors.length + i}@greenshifa.com`,
            bio: 'Board-certified specialist dedicated to exceptional patient-centered healthcare.',
            photo: '',
            featured: true,
            status: 'Active',
          }),
        });
        const created = await res.json();
        if (created && created.id) {
          setDoctors((prev) => [created, ...prev]);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add doctor batch');
    } finally {
      setLoading(false);
    }
  };

  const displayedDoctors = doctors.filter(
    (doc) => selectedDeptFilter === 'all' || doc.departmentId === selectedDeptFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-dark tracking-tight">Doctors & Medical Faculty</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-black">
              {doctors.length} Doctors
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">Manage physicians, credentials, visiting schedules, and clinic fees.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleBatchAdd(5)}
            disabled={loading}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5 disabled:opacity-50"
            title="Quickly generate 5 empty doctor slots to edit"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ Quick Add 5 Slots</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Doctor</span>
          </button>
        </div>
      </div>

      {/* Search & Department Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs text-dark bg-white"
          >
            <option value="all">All Departments ({doctors.length})</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid/Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                <th className="p-4">Doctor</th>
                <th className="p-4">Department</th>
                <th className="p-4">Experience & Degree</th>
                <th className="p-4">Visiting Hours</th>
                <th className="p-4">Fee</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/70 transition">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center border border-gray-200">
                        {doc.photo ? (
                          <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover object-top" />
                        ) : (
                          <User className="w-5 h-5 text-primary/60" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-dark text-sm">{doc.name}</div>
                        <div className="text-[11px] text-primary font-medium">{doc.specialty}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-gray-700">
                    {doc.department?.name || 'Medical Unit'}
                  </td>
                  <td className="p-4 text-gray-500">
                    <div>{doc.qualification}</div>
                    <div className="text-[11px] text-gray-400">{doc.experience}</div>
                  </td>
                  <td className="p-4 font-medium text-coral">
                    {doc.visitingHours}
                  </td>
                  <td className="p-4 font-black text-dark">
                    ${doc.consultationFee}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleOpenEdit(doc)}
                        className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition"
                        title="Edit Doctor"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.name)}
                        className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Remove Doctor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-black text-dark">
                {editingDoc ? `Edit ${editingDoc.name}` : 'Add New Doctor to Faculty'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-dark mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Arthur Sterling"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Clinical Specialty *</label>
                  <input
                    type="text"
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="e.g. Interventional Cardiologist"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-dark mb-1">Department *</label>
                  <select
                    required
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Consultation Fee ($) *</label>
                  <input
                    type="number"
                    required
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-dark mb-1">Visiting Hours *</label>
                  <input
                    type="text"
                    required
                    value={formData.visitingHours}
                    onChange={(e) => setFormData({ ...formData, visitingHours: e.target.value })}
                    placeholder="e.g. Mon, Wed, Fri: 09:00 AM - 01:00 PM"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Qualifications *</label>
                  <input
                    type="text"
                    required
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. MD, FACC, Harvard Fellow"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-dark mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Photo Upload Area */}
              <div className="space-y-2 border-t pt-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <label className="block font-bold text-dark mb-1 flex items-center justify-between">
                  <span>Doctor Photo</span>
                  {uploading && <span className="text-xs text-primary animate-pulse">Compressing photo...</span>}
                </label>

                {uploadError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {!formData.photo ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-primary bg-gray-50/50 hover:bg-primary/[0.03] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition text-center group"
                  >
                    <UploadCloud className="w-8 h-8 text-primary/70 mb-1.5 group-hover:scale-110 transition" />
                    <span className="text-xs font-black text-dark group-hover:text-primary transition">
                      Click Here to Upload Doctor Photo from Device
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      Supports JPG, PNG, WEBP. If left empty, doctor photo slot will remain empty shape.
                    </span>
                    <span className="mt-2 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600">
                      📁 Browse Photo
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-14 rounded-xl overflow-hidden border border-emerald-300 bg-white shadow-xs shrink-0">
                        <img src={formData.photo} alt="Doctor" className="w-full h-full object-cover object-top" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Photo Uploaded</span>
                        </div>
                        <p className="text-[11px] text-emerald-700">Ready to save</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 hover:border-primary text-dark rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Change</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, photo: '' })}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Keep Empty</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-dark mb-1">Biography & Clinical Focus</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition"
                >
                  {editingDoc ? 'Save Changes' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
