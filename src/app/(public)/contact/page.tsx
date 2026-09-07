'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  ChevronRight,
  MessageCircle
} from 'lucide-react';

export default function ContactPage() {
  const [settings, setSettings] = useState({
    hospitalName: 'MedicalPress Hospital',
    phone: '+1-800-654-3210',
    emergencyPhone: '+1-800-999-HELP',
    email: 'care@medicalpress.com',
    address: '742 Evergreen Medical Parkway, Healthcare District, NY 10001',
    openingHours: 'Monday to Saturday — 8:00 AM to 9:00 PM',
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hospitalName) {
          setSettings({
            hospitalName: data.hospitalName,
            phone: data.phone,
            emergencyPhone: data.emergencyPhone,
            email: data.email,
            address: data.address,
            openingHours: data.openingHours,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');

      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been received and routed to our patient services team. A representative will contact you shortly.',
      });
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Submission failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Contact Hospital</span>
        </nav>

        <div className="border-b border-gray-200/80 pb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>24/7 Patient Coordination</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Contact MedicalPress
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-2xl">
            Have questions about doctor schedules, visiting guidelines, or international patient care? Reach out anytime.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Hospital Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-soft space-y-5">
              <h2 className="text-xl font-black text-dark border-b border-gray-100 pb-3">
                Hospital Information
              </h2>

              <ul className="space-y-4 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-dark font-bold">Hospital Campus Address:</strong>
                    <span>{settings.address}</span>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-dark font-bold">General Reception & Appointments:</strong>
                    <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="text-primary hover:underline font-semibold">
                      {settings.phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-coral font-bold">24/7 Emergency & Level 1 Trauma:</strong>
                    <a href={`tel:${settings.emergencyPhone.replace(/[^0-9+]/g, '')}`} className="text-coral hover:underline font-extrabold text-base">
                      {settings.emergencyPhone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-dark font-bold">Email Inquiries:</strong>
                    <a href={`mailto:${settings.email}`} className="text-primary hover:underline">
                      {settings.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-dark font-bold">Outpatient Visiting Hours:</strong>
                    <span>{settings.openingHours}</span>
                  </div>
                </li>
              </ul>

              {/* WhatsApp Quick Chat */}
              <div className="pt-4 border-t border-gray-100">
                <a
                  href="https://wa.me/18006543210"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat With Patient Coordinator on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Google Map Box */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-soft h-64 relative">
              <iframe
                title="Hospital Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.6173574100654!2d-73.98513108459418!3d40.74881797932822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1619890289291!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Contact & Lead Form (Section 70: creates a lead in CRM) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-soft">
            <h2 className="text-2xl font-black text-dark mb-1">Send a Message</h2>
            <p className="text-xs text-text-secondary mb-6">
              Fill out the form below and our medical team will get back to you promptly.
            </p>

            {status && (
              <div className={`p-4 rounded-xl text-xs mb-6 flex items-center space-x-2 ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-dark mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Eleanor Davis"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1-555-0100"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Inquiry Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Insurance Coverage Inquiry"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-dark mb-1">Your Message / Question *</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you today? Please share any relevant details..."
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Transmitting Message...' : 'Send Message'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
