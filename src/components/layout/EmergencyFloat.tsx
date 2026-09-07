'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Calendar, MessageCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageContext';

export default function EmergencyFloat() {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-2.5 px-3 md:hidden shadow-2xl flex items-center justify-between gap-1.5">
      {/* 1. Direct Phone Call */}
      <a
        href="tel:+18006543210"
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg bg-gray-50 text-dark hover:bg-gray-100 transition border border-gray-200"
      >
        <Phone className="w-4 h-4 text-primary mb-0.5" />
        <span className="text-[10px] font-bold">Call</span>
      </a>

      {/* 2. WhatsApp Direct */}
      <a
        href="https://wa.me/18006543210"
        target="_blank"
        rel="noreferrer"
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition border border-emerald-200"
      >
        <MessageCircle className="w-4 h-4 text-emerald-600 mb-0.5" />
        <span className="text-[10px] font-bold">WhatsApp</span>
      </a>

      {/* 3. Book Appointment */}
      <Link
        href="/appointment"
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg bg-primary text-white font-bold transition shadow-sm"
      >
        <Calendar className="w-4 h-4 text-white mb-0.5" />
        <span className="text-[10px] font-bold">Book</span>
      </Link>

      {/* 4. 24/7 Emergency */}
      <Link
        href="/emergency"
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg bg-coral/15 text-coral hover:bg-coral hover:text-white transition border border-coral/30"
      >
        <AlertCircle className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] font-bold">Emergency</span>
      </Link>
    </div>
  );
}
