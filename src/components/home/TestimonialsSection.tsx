'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle } from 'lucide-react';

interface Testimonial {
  id: string;
  patientName: string;
  patientRole: string | null;
  photo: string | null;
  review: string;
  rating: number;
  department: string;
}

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 bg-white relative overflow-hidden border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Patient Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Patient Healing Stories
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary">
            Read firsthand accounts from patients who trusted MedicalPress for major surgeries, 
            emergency trauma care, and personalized wellness recoveries.
          </p>
        </div>

        {/* Testimonial Feature Card */}
        <div className="max-w-4xl mx-auto bg-background rounded-2xl p-8 sm:p-12 shadow-soft border border-medical-border/50 relative">
          <Quote className="absolute top-6 right-8 w-16 h-16 text-primary/10 -rotate-12" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* Patient Avatar */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
              <Image
                src={current.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={current.patientName}
                fill
                className="object-cover"
              />
            </div>

            {/* Testimonial Content */}
            <div className="flex-1 text-center sm:text-left">
              {/* Star Rating */}
              <div className="flex items-center justify-center sm:justify-start space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < current.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <blockquote className="text-base sm:text-lg text-dark italic font-medium leading-relaxed mb-4">
                &ldquo;{current.review}&rdquo;
              </blockquote>

              <div>
                <h4 className="font-extrabold text-dark text-base">{current.patientName}</h4>
                <p className="text-xs font-semibold text-primary">{current.patientRole || 'Patient'} • <span className="text-gray-500 font-normal">{current.department}</span></p>
              </div>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="flex space-x-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentIndex === i ? 'w-8 bg-primary' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={prev}
                className="p-2 rounded-full bg-white border border-gray-200 text-dark hover:bg-primary hover:text-white hover:border-primary transition shadow-sm"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="p-2 rounded-full bg-white border border-gray-200 text-dark hover:bg-primary hover:text-white hover:border-primary transition shadow-sm"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
