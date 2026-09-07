'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star, Quote, Plus, CheckCircle2 } from 'lucide-react';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Cardiology Clinic');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !review) return;

    await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientName: name, department, rating, review }),
    });

    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setName('');
      setReview('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Patient Stories</span>
        </nav>

        <div className="border-b border-gray-200/80 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Healing Experiences</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
              Patient Testimonials & Reviews
            </h1>
            <p className="mt-2 text-sm text-text-secondary max-w-2xl">
              Hear directly from patients whose lives were transformed by our physicians and nursing team.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Share Your Healing Story</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed italic mb-6">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={t.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt={t.patientName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-dark">{t.patientName}</h3>
                  <p className="text-xs text-primary font-semibold">{t.department}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Story Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h2 className="text-xl font-black text-dark">Submit Your Feedback</h2>
            {submitted ? (
              <div className="py-6 text-center text-emerald-700 font-bold text-sm">
                Thank you! Your testimonial has been submitted for moderation.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-dark mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Department Treated In</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="5">5 Stars - Exceptional Care</option>
                    <option value="4">4 Stars - Very Good</option>
                    <option value="3">3 Stars - Satisfactory</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Your Healing Experience / Review</label>
                  <textarea
                    rows={4}
                    required
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Tell us about the doctors and nursing team who assisted your recovery..."
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
