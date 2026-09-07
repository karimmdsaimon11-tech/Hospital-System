'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Plus, Edit2, Trash2, X, Tag } from 'lucide-react';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: 299,
    discount: 20,
    originalPrice: 399,
    testsIncluded: 'Complete Blood Count\nLipid Panel\nLiver Function Test\nECG Test\nPhysician Consultation',
    description: 'Comprehensive health checkup package.',
    duration: '2-3 Hours',
    availability: 'Daily 8 AM - 12 PM',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
  });

  const fetchPkgs = () => {
    setLoading(true);
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPackages(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPkgs();
  }, []);

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setFormData({
      name: '',
      price: 299,
      discount: 20,
      originalPrice: 399,
      testsIncluded: 'Complete Blood Count\nLipid Panel\nLiver Function Test\nECG Test\nPhysician Consultation',
      description: 'Comprehensive health checkup package.',
      duration: '2-3 Hours',
      availability: 'Daily 8 AM - 12 PM',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingPkg(p);
    setFormData({
      name: p.name,
      price: p.price,
      discount: p.discount,
      originalPrice: p.originalPrice,
      testsIncluded: p.testsIncluded,
      description: p.description,
      duration: p.duration,
      availability: p.availability,
      image: p.image,
      isFeatured: p.isFeatured,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete package: ${name}?`)) return;
    try {
      await fetch(`/api/packages?id=${id}`, { method: 'DELETE' });
      setPackages(packages.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete package');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPkg) {
        const res = await fetch('/api/packages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingPkg.id, ...formData }),
        });
        const updated = await res.json();
        setPackages(packages.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const res = await fetch('/api/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const created = await res.json();
        setPackages([...packages, created]);
      }
      setShowModal(false);
    } catch (err) {
      alert('Failed to save package');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Health Packages CMS</h1>
          <p className="text-xs text-text-secondary">Create and manage preventive health checkups, test checklists, and promotional discounts.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Health Package</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                <th className="p-4">Package Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Duration & Hours</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50/70 transition">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                      </div>
                      <span className="font-bold text-dark text-sm">{pkg.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-black text-primary text-sm">${pkg.price}</td>
                  <td className="p-4">
                    {pkg.discount > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-coral/15 text-coral font-bold text-[11px]">
                        {pkg.discount}% OFF
                      </span>
                    ) : (
                      <span className="text-gray-400">Regular</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500">
                    <div>{pkg.duration}</div>
                    <div className="text-[11px] text-gray-400">{pkg.availability}</div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.name)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-black text-dark">
                {editingPkg ? 'Edit Package' : 'Add Health Package'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-dark mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-dark mb-1">Final Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-dark mb-1">Tests Included (One per line) *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.testsIncluded}
                  onChange={(e) => setFormData({ ...formData, testsIncluded: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg resize-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-dark mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  {editingPkg ? 'Save Changes' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
