'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Camera, 
  Play, 
  X, 
  Maximize2,
  Filter,
  Sparkles
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  mediaType: string;
  imageUrl: string;
  videoUrl?: string | null;
  description: string | null;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // all, image, video

  // Active modal state
  const [activeVideo, setActiveVideo] = useState<GalleryItem | null>(null);
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(() => {});
  }, []);

  const categories = ['all', 'Facilities', 'Hospital', 'Surgeries', 'Doctors', 'Equipment', 'Events'];

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCat === 'all' || item.category.toLowerCase() === selectedCat.toLowerCase();
    const matchesType = selectedType === 'all' || (item.mediaType || 'image') === selectedType;
    return matchesCat && matchesType;
  });

  const photoCount = items.filter((i) => (i.mediaType || 'image') === 'image').length;
  const videoCount = items.filter((i) => i.mediaType === 'video').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Media & Video Gallery</span>
        </nav>

        <div className="border-b border-gray-200/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Hospital Facilities, Surgical Suites & Video Tours</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
              Hospital Media & Video Gallery
            </h1>
            <p className="mt-2 text-sm text-text-secondary max-w-2xl">
              Explore our hybrid operating theaters, intensive care units, advanced 3T MRI imaging, and watch surgery demonstrations and virtual tours.
            </p>
          </div>

          {/* Type Filter Tabs: All, Photos, Videos */}
          <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm shrink-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedType === 'all'
                  ? 'bg-dark text-white shadow-xs'
                  : 'text-gray-600 hover:text-dark hover:bg-gray-100'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setSelectedType('image')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                selectedType === 'image'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photos ({photoCount})</span>
            </button>
            <button
              onClick={() => setSelectedType('video')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                selectedType === 'video'
                  ? 'bg-coral text-white shadow-xs'
                  : 'text-gray-600 hover:text-coral hover:bg-gray-100'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5" />
              <span>Videos ({videoCount})</span>
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-4 pb-2">
          <span className="text-xs font-bold text-gray-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> Topics:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 text-gray-400 space-y-2">
            <Camera className="w-12 h-12 mx-auto text-gray-300" />
            <h3 className="text-sm font-bold text-dark">No media matches the selected filters</h3>
            <p className="text-xs text-text-secondary">Try switching categories or selecting "All".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isVideo = item.mediaType === 'video';
              return (
                <div
                  key={item.id}
                  onClick={() => (isVideo ? setActiveVideo(item) : setActiveImage(item))}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  {/* Thumbnail Image Container */}
                  <div className="relative h-60 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] font-bold text-primary shadow-sm z-10">
                      {item.category}
                    </div>

                    {/* Media Type Overlay / Play Button */}
                    {isVideo ? (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-14 h-14 rounded-full bg-coral text-white flex items-center justify-center shadow-xl shadow-coral/50 group-hover:scale-110 transition duration-300">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                        <span className="absolute bottom-3 right-3 bg-coral text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
                          <VideoIcon className="w-3 h-3" /> Watch Video
                        </span>
                      </div>
                    ) : (
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition z-10 bg-white/90 backdrop-blur-sm text-dark text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                        <Maximize2 className="w-3 h-3" /> View Photo
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-dark line-clamp-1 group-hover:text-primary transition leading-snug">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                      {isVideo ? (
                        <span className="text-coral flex items-center gap-1 font-bold">
                          <Play className="w-3.5 h-3.5 fill-coral" /> Play Video
                        </span>
                      ) : (
                        <span className="text-primary flex items-center gap-1 font-bold">
                          <ImageIcon className="w-3.5 h-3.5" /> View Photo
                        </span>
                      )}
                      <span className="text-gray-400 text-[11px]">MedicalPress Media</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1E293B] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl border border-gray-700 animate-fadeIn">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-coral text-white flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 fill-white" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-bold truncate">{activeVideo.title}</h3>
                  <span className="text-[10px] text-coral uppercase font-bold">{activeVideo.category}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Screen Area */}
            <div className="relative w-full aspect-video bg-black">
              {activeVideo.videoUrl?.endsWith('.mp4') ? (
                <video controls autoPlay className="w-full h-full">
                  <source src={activeVideo.videoUrl} type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
              ) : (
                <iframe
                  src={activeVideo.videoUrl || ''}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Video Footer Info */}
            <div className="p-4 bg-[#0F172A] text-gray-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="line-clamp-2 max-w-2xl">{activeVideo.description || 'Hospital procedure and equipment showcase.'}</p>
              <Link
                href="/appointment"
                onClick={() => setActiveVideo(null)}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shrink-0 transition"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Picture Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-dark rounded-2xl overflow-hidden shadow-2xl border border-gray-800 animate-fadeIn">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-[65vh] w-full bg-black flex items-center justify-center">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="p-4 bg-[#1E293B] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-primary bg-primary/20 px-2 py-0.5 rounded">
                  {activeImage.category}
                </span>
                <h3 className="text-sm font-bold text-white mt-1">{activeImage.title}</h3>
                {activeImage.description && (
                  <p className="text-xs text-gray-400 mt-0.5">{activeImage.description}</p>
                )}
              </div>
              <a
                href={activeImage.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition shrink-0 ml-4"
              >
                View Full Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
