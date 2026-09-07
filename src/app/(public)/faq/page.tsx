'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/faqs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFaqs(data);
          if (data.length > 0) setOpenId(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ['all', 'Appointments', 'Billing & Insurance', 'Emergency', 'Medical Reports', 'General'];

  const filteredFaqs = faqs.filter((f) => {
    const matchesCat = activeCategory === 'all' || f.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      !search ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <nav className="flex items-center justify-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Frequently Asked Questions</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-sm text-text-secondary max-w-xl mx-auto">
          Find transparent answers regarding outpatient appointments, insurance coverage, billing, and clinical protocols.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mt-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs by question or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm text-dark placeholder-gray-400 focus:outline-none focus:border-primary bg-white shadow-sm"
          />
        </div>

        {/* Category Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {filteredFaqs.map((f) => {
          const isOpen = openId === f.id;
          return (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden transition"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : f.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-dark text-sm sm:text-base hover:text-primary transition"
              >
                <span>{f.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-gray-100 pt-3 animate-fadeIn">
                  {f.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
