'use client';

import React, { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
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

  const handleOpenAdd = () => {
    setEditingDoc(null);
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
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Doctors & Medical Faculty</h1>
          <p className="text-xs text-text-secondary">Manage physicians, credentials, visiting schedules, and clinic fees.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-soft">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
          />
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
              {doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/70 transition">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <Image src={doc.photo} alt={doc.name} fill className="object-cover object-top" />
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-dark mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Photo URL</label>
                  <input
                    type="text"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
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
