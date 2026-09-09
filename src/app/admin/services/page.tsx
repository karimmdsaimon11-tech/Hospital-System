'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Search, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  Layers,
  Filter
} from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quickAddLoading, setQuickAddLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [deleteConfirmService, setDeleteConfirmService] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    departmentId: '',
    price: 100,
    shortDesc: '',
    description: '',
    image: '', // default EMPTY shape
    featured: true,
    status: 'Published',
  });

  const fetchServices = () => {
    setLoading(true);
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDepartments(data);
      });
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      name: '',
      slug: '',
      departmentId: departments[0]?.id || '',
      price: 100,
      shortDesc: '',
      description: '',
      image: '', // empty shape by default
      featured: true,
      status: 'Published',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s: any) => {
    setEditingService(s);
    setFormData({
      name: s.name || '',
      slug: s.slug || '',
      departmentId: s.departmentId || departments[0]?.id || '',
      price: s.price ?? 100,
      shortDesc: s.shortDesc || '',
      description: s.description || '',
      image: s.image || '',
      featured: s.featured ?? true,
      status: s.status || 'Published',
    });
    setShowModal(true);
  };

  // Canvas Image compression
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    setIsProcessingPhoto(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDimension = 900;
        let { width, height } = img;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
          setFormData((prev) => ({ ...prev, image: compressedBase64 }));
        }
        setIsProcessingPhoto(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Quick Add 5 Empty Service Slots
  const handleQuickAddSlots = async (countToAdd = 5) => {
    if (quickAddLoading) return;
    if (departments.length === 0) {
      alert('Please create at least one department first before adding services.');
      return;
    }

    setQuickAddLoading(true);

    try {
      const startIndex = services.length + 1;
      const targetDeptId = selectedDeptFilter !== 'all' ? selectedDeptFilter : departments[0].id;
      const createdItems: any[] = [];

      for (let i = 0; i < countToAdd; i++) {
        const num = startIndex + i;
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Advanced Clinical Service ${num}`,
            slug: `service-slot-${num}-${Date.now()}`,
            departmentId: targetDeptId,
            price: 120,
            shortDesc: 'Comprehensive clinical intervention, rapid diagnostic tests, and precision patient management.',
            description: 'This specialized clinical service utilizes advanced medical technology, certified laboratory testing, and experienced nursing care.',
            image: '', // EMPTY shape ready for user photo upload
            featured: true,
            status: 'Published',
          }),
        });

        if (res.ok) {
          const item = await res.json();
          createdItems.push(item);
        }
      }

      setServices((prev) => [...prev, ...createdItems]);
      alert(`Successfully added ${createdItems.length} service slots! You can now edit their details and upload photos.`);
    } catch (err) {
      console.error(err);
      alert('Failed to batch add service slots.');
    } finally {
      setQuickAddLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmService) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/services?id=${deleteConfirmService.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete service');
      setServices((prev) => prev.filter((s) => s.id !== deleteConfirmService.id));
      setDeleteConfirmService(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete service');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingService) {
        const res = await fetch('/api/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingService.id, ...formData }),
        });
        if (!res.ok) throw new Error('Failed to update service');
        const updated = await res.json();
        setServices(services.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)));
      } else {
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create service');
        const created = await res.json();
        setServices([...services, created]);
      }
      setShowModal(false);
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesDept = selectedDeptFilter === 'all' || s.departmentId === selectedDeptFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      s.name?.toLowerCase().includes(q) ||
      s.department?.name?.toLowerCase().includes(q) ||
      s.shortDesc?.toLowerCase().includes(q)
    );
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header with Stats & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-soft">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-dark tracking-tight">Our Advanced Services</h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-primary/10 text-primary">
              {services.length} Total
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Manage surgical procedures, diagnostic screenings, service photos, and slots for 100+ services.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleQuickAddSlots(5)}
            disabled={quickAddLoading}
            className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 disabled:opacity-50"
            title="Quickly generate 5 empty service slots ready for photo upload"
          >
            {quickAddLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Layers className="w-3.5 h-3.5" />
            )}
            <span>+ Quick Add 5 Slots</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Search & Department Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services or procedures..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          <div className="w-full sm:w-56">
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            >
              <option value="all">All Departments ({services.length})</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-gray-500 font-medium text-right">
          Showing {filteredServices.length} of {services.length} services
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                <th className="p-4">Service / Picture Shape</th>
                <th className="p-4">Department</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    <span>Loading hospital services...</span>
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <span>No clinical services found matching your criteria.</span>
                  </td>
                </tr>
              ) : (
                filteredServices.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        {/* Picture Slot: Empty shape if no image, thumbnail if uploaded */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-gray-50 flex items-center justify-center relative">
                          {s.image ? (
                            <img
                              src={s.image}
                              alt={s.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-teal-600">
                              <Activity className="w-5 h-5 opacity-70" />
                              <span className="text-[9px] font-bold text-gray-400 mt-0.5">Empty</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-dark text-sm">{s.name}</div>
                          <div className="text-[11px] text-gray-400">/{s.slug || 'no-slug'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-primary">
                      {s.department?.name || 'No department assigned'}
                    </td>

                    <td className="p-4 font-black text-dark">
                      ${s.price || 0}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          s.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {s.status || 'Published'}
                      </span>
                    </td>

                    <td className="p-4">
                      {s.featured ? (
                        <span className="text-amber-600 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          ★ Featured
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Standard</span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmService(s)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-xl font-black text-dark">
                  {editingService ? 'Edit Service' : 'Add Clinical Service'}
                </h2>
                <p className="text-xs text-text-secondary">
                  Configure procedure details and upload banner photo (leave empty for placeholder shape).
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-dark p-1 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Photo Upload Slot */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3">
                <label className="block font-bold text-dark text-xs">
                  Service Photo / Shape
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo Preview / Empty Shape */}
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-white flex items-center justify-center relative shrink-0 shadow-inner">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Service Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 p-2 text-center">
                        <Activity className="w-8 h-8 text-teal-600/50 mb-1" />
                        <span className="text-[10px] font-bold text-gray-400">Empty Shape</span>
                        <span className="text-[9px] text-gray-300">(No photo uploaded)</span>
                      </div>
                    )}

                    {isProcessingPhoto && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2 text-left w-full">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessingPhoto}
                        className="px-3 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{formData.image ? 'Change Photo' : 'Upload Service Photo'}</span>
                      </button>

                      {formData.image && (
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                          className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-xl transition border border-rose-200"
                        >
                          Keep Empty Shape
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-gray-400">
                      Supports JPG, PNG, WebP. If left empty, the service card will display the clean placeholder frame on the homepage and services list.
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-dark mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. 3D Echocardiography Screening"
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-dark mb-1">Assigned Department *</label>
                  <select
                    required
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-dark mb-1">Base Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-dark mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                  >
                    <option value="Published">Published (Visible)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="font-bold text-dark text-xs">Featured on Home</span>
                  </label>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block font-bold text-dark mb-1">Short Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="A brief clinical summary shown on service cards..."
                  className="w-full px-3 py-2 border rounded-xl resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block font-bold text-dark mb-1">Full Clinical Details</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed clinical procedure descriptions, instructions, preparation protocols..."
                  className="w-full px-3 py-2 border rounded-xl resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingService ? 'Save Changes' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmService && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-dark">Delete Service?</h3>
              <p className="text-xs text-text-secondary">
                Are you sure you want to delete <strong className="text-dark">{deleteConfirmService.name}</strong>?
              </p>
              <p className="text-[11px] text-gray-400 mt-2">
                This action cannot be undone. Any appointments linked will remain intact.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmService(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
