'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('All Updates');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, category }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');

      setStatus({
        type: 'success',
        message: 'Thank you for subscribing! You will receive our latest health insights and announcements.',
      });
      setEmail('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#202b33] to-[#172127] rounded-3xl p-8 sm:p-12 text-white shadow-card relative overflow-hidden">
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/20 text-primary mb-4">
          <Mail className="w-6 h-6" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
          Subscribe to MedicalPress Health Briefings
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-gray-300">
          Get evidence-based clinical articles, seasonal wellness advice, and exclusive hospital updates delivered to your inbox weekly.
        </p>

        <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your personal or work email..."
            required
            className="px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-primary flex-1 max-w-md backdrop-blur-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-extrabold shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Subscribing...' : 'Subscribe Now'}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        {status && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-center justify-center space-x-2 ${
            status.type === 'success' ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{status.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
