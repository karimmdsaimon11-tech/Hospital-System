'use client';

import React, { useState, useEffect } from 'react';
import { 
  FolderArchive, 
  Search, 
  Filter, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink, 
  Image as ImageIcon,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminMediaPage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Facilities',
    imageUrl: '',
    caption: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchMedia = () => {
    setLoading(true);
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch((err) => console.error('Error loading media:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this media asset?')) return;
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Failed to delete media asset');
      }
    } catch (err) {
      alert('Error deleting item');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        setModalOpen(false);
        setNewItem({ title: '', category: 'Facilities', imageUrl: '', caption: '' });
        fetchMedia();
      } else {
        alert('Failed to register asset');
      }
    } catch (err) {
      alert('Error adding asset');
    } finally {
      setSaving(false);
    }
  };

  const categories = ['All', 'Facilities', 'Surgeries', 'Equipment', 'Staff', 'Wards'];

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.caption && item.caption.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Hospital Media & Asset Library</h1>
          <p className="text-xs text-text-secondary">
            Manage high-resolution photography, medical diagnostic imagery, and hospital equipment graphics.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Asset</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by title or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-text-secondary font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                categoryFilter === cat
                  ? 'bg-dark text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-xs font-semibold">Loading media library...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 text-gray-400 space-y-2">
          <ImageIcon className="w-10 h-10 mx-auto text-gray-300" />
          <div className="text-xs font-bold text-dark">No media assets found</div>
          <p className="text-[11px] text-text-secondary">Try adjusting your search terms or filter category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col"
            >
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-dark/80 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-dark leading-tight line-clamp-1">{item.title}</h3>
                  {item.caption && (
                    <p className="text-[11px] text-text-secondary mt-1 line-clamp-2">{item.caption}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => handleCopy(item.id, item.imageUrl)}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      copiedId === item.id
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center space-x-1">
                    <a
                      href={item.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-50 transition"
                      title="Open full image"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Media Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-dark flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>Register New Media Asset</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-dark font-bold p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-dark mb-1">Asset Title / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 64-Slice Cardiac CT Scanner"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-dark mb-1">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
                >
                  <option value="Facilities">Facilities</option>
                  <option value="Surgeries">Surgeries</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Staff">Staff</option>
                  <option value="Wards">Wards</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-dark mb-1">Image URL (High Resolution)</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newItem.imageUrl}
                  onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none font-mono"
                />
              </div>

              {newItem.imageUrl && (
                <div className="h-28 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                  <img
                    src={newItem.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-dark mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief note about the equipment, facility, or doctor..."
                  value={newItem.caption}
                  onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-dark rounded-xl font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-md shadow-primary/20 transition"
                >
                  {saving ? 'Adding Asset...' : 'Save to Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
