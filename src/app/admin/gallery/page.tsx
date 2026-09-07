'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Play, 
  Plus, 
  Trash2, 
  X, 
  Filter, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminGalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all'); // all, image, video
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Form State
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Facilities');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Video preview player modal
  const [activeVideo, setActiveVideo] = useState<any | null>(null);

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const formatVideoUrl = (url: string) => {
    if (!url) return '';
    // If regular YouTube URL: https://www.youtube.com/watch?v=ID or https://youtu.be/ID
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formattedVideo = mediaType === 'video' ? formatVideoUrl(videoUrl) : null;
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          category, 
          mediaType,
          imageUrl, 
          videoUrl: formattedVideo,
          description 
        }),
      });
      const created = await res.json();
      setItems([created, ...items]);
      setShowModal(false);
      setTitle('');
      setVideoUrl('');
      setDescription('');
    } catch (err) {
      alert('Failed to add media');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this media item?')) return;
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      alert('Failed to delete media');
    }
  };

  const categories = ['all', 'Facilities', 'Hospital', 'Doctors', 'Equipment', 'Surgeries', 'Events'];

  const filteredItems = items.filter((item) => {
    const matchesType = typeFilter === 'all' || (item.mediaType || 'image') === typeFilter;
    const matchesCat = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesType && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Hospital Media & Video Gallery</h1>
          <p className="text-xs text-text-secondary">
            Upload and organize high-resolution medical photography, surgical videos, and hospital virtual tours.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Picture or Video</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Media Type Tabs */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              typeFilter === 'all' ? 'bg-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Media ({items.length})
          </button>
          <button
            onClick={() => setTypeFilter('image')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              typeFilter === 'image' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Pictures ({items.filter((i) => (i.mediaType || 'image') === 'image').length})</span>
          </button>
          <button
            onClick={() => setTypeFilter('video')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              typeFilter === 'video' ? 'bg-coral text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5" />
            <span>Videos ({items.filter((i) => i.mediaType === 'video').length})</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-xs text-text-secondary font-bold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition ${
                categoryFilter === cat
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-xs font-semibold">Loading media gallery...</div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 text-gray-400 space-y-2">
          <ImageIcon className="w-10 h-10 mx-auto text-gray-300" />
          <div className="text-xs font-bold text-dark">No media items found</div>
          <p className="text-[11px] text-text-secondary">Click "Add Picture or Video" above to register new content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const isVideo = item.mediaType === 'video';
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                {/* Media Thumbnail Container */}
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  {/* Category Pill */}
                  <span className="absolute top-2.5 left-2.5 bg-dark/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                    {item.category}
                  </span>

                  {/* Video Badge / Play Button */}
                  {isVideo ? (
                    <button
                      onClick={() => setActiveVideo(item)}
                      className="absolute inset-0 bg-dark/30 hover:bg-dark/50 transition flex items-center justify-center group/play cursor-pointer z-10"
                    >
                      <div className="w-11 h-11 rounded-full bg-coral text-white flex items-center justify-center shadow-lg shadow-coral/40 group-hover/play:scale-110 transition">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                      <span className="absolute bottom-2.5 right-2.5 bg-coral text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                        <VideoIcon className="w-3 h-3" /> Video
                      </span>
                    </button>
                  ) : (
                    <span className="absolute bottom-2.5 right-2.5 bg-dark/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Photo
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-xs font-bold text-dark line-clamp-1 leading-tight">{item.title}</h3>
                    {item.description && (
                      <p className="text-[11px] text-text-secondary mt-1 line-clamp-2 leading-snug">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    {isVideo && (
                      <button
                        onClick={() => setActiveVideo(item)}
                        className="text-[11px] font-bold text-coral hover:underline flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" /> Play Video
                      </button>
                    )}
                    {!isVideo && (
                      <a
                        href={item.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Full Photo
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title="Delete media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Media Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-dark flex items-center space-x-2">
                {mediaType === 'image' ? (
                  <ImageIcon className="w-4 h-4 text-primary" />
                ) : (
                  <VideoIcon className="w-4 h-4 text-coral" />
                )}
                <span>Add New Hospital Media</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-dark font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Media Type Selector Switch */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setMediaType('image')}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition ${
                  mediaType === 'image'
                    ? 'bg-white text-dark shadow-sm'
                    : 'text-gray-500 hover:text-dark'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-primary" />
                <span>Picture / Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition ${
                  mediaType === 'video'
                    ? 'bg-coral text-white shadow-sm'
                    : 'text-gray-500 hover:text-dark'
                }`}
              >
                <VideoIcon className="w-3.5 h-3.5" />
                <span>Video (YouTube / MP4)</span>
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-dark mb-1">
                  {mediaType === 'image' ? 'Picture Title' : 'Video Title'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    mediaType === 'image'
                      ? 'e.g. Laminar Flow Surgical Operating Suite'
                      : 'e.g. 360 Hospital Virtual Tour & Emergency Walkthrough'
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-dark mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none text-xs"
                >
                  <option value="Facilities">Facilities</option>
                  <option value="Hospital">Hospital Campus</option>
                  <option value="Surgeries">Surgeries & OT</option>
                  <option value="Doctors">Doctors & Specialists</option>
                  <option value="Equipment">Diagnostic Equipment</option>
                  <option value="Events">Medical Events & Seminars</option>
                </select>
              </div>

              {/* Video URL (Only shown when mediaType === 'video') */}
              {mediaType === 'video' && (
                <div>
                  <label className="block text-[11px] font-bold text-dark mb-1">
                    Video URL (YouTube link, Embed URL, or direct MP4)
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/embed/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-coral/50 rounded-xl focus:border-coral focus:outline-none font-mono text-xs"
                  />
                  <span className="text-[10px] text-text-secondary mt-1 block">
                    Tip: Enter any standard YouTube link, Vimeo, or MP4 video URL. It will automatically convert to an embeddable player.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-dark mb-1">
                  {mediaType === 'image' ? 'Image URL' : 'Video Cover Thumbnail Image URL'}
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-dark mb-1">Description / Caption</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the facility, surgery, or video..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 text-dark rounded-xl font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-5 py-2 text-white rounded-xl font-bold shadow-md transition ${
                    mediaType === 'video'
                      ? 'bg-coral hover:bg-coral/90 shadow-coral/20'
                      : 'bg-primary hover:bg-primary-hover shadow-primary/20'
                  }`}
                >
                  {saving
                    ? 'Saving...'
                    : mediaType === 'video'
                    ? 'Publish Video'
                    : 'Publish Picture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-gray-700 space-y-0 animate-fadeIn">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-coral text-white flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
                <h3 className="text-xs font-bold truncate max-w-lg">{activeVideo.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-gray-400 hover:text-white font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full aspect-video bg-black">
              {activeVideo.videoUrl?.endsWith('.mp4') ? (
                <video controls autoPlay className="w-full h-full">
                  <source src={activeVideo.videoUrl} type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
              ) : (
                <iframe
                  src={activeVideo.videoUrl}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            <div className="p-4 bg-[#0F172A] text-gray-300 text-xs space-y-1">
              <span className="text-[10px] uppercase font-black text-coral bg-coral/10 px-2 py-0.5 rounded">
                {activeVideo.category}
              </span>
              <p className="text-xs text-gray-300 pt-1">{activeVideo.description || 'No description provided.'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
