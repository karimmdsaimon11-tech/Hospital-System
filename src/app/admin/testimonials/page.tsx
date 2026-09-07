'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = () => {
    setLoading(true);
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (err) {
      alert('Failed to delete testimonial');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Patient Testimonials</h1>
          <p className="text-xs text-text-secondary">Review, moderate, and publish verified patient healing stories.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                <th className="p-4">Patient</th>
                <th className="p-4">Department</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review Story</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/70 transition">
                  <td className="p-4 font-bold text-dark">{t.patientName}</td>
                  <td className="p-4 font-semibold text-primary">{t.department}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-0.5 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 max-w-md line-clamp-2 italic">
                    &ldquo;{t.review}&rdquo;
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      title="Delete"
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
    </div>
  );
}
