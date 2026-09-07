'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Droplet, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  PhoneCall, 
  HeartHandshake, 
  Send
} from 'lucide-react';

interface BloodItem {
  id: string;
  bloodGroup: string;
  unitsAvailable: number;
  status: string;
  lastUpdated: string;
}

export default function BloodBankPage() {
  const [inventory, setInventory] = useState<BloodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Request Form State
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [unitsRequired, setUnitsRequired] = useState('1');
  const [contactPhone, setContactPhone] = useState('');
  const [hospital, setHospital] = useState('MedicalPress Main');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/blood-bank')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.inventory)) {
          setInventory(data.inventory);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !contactPhone) return;

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/blood-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          bloodGroup,
          unitsRequired,
          contactPhone,
          hospital,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit blood request');

      setStatusMsg({
        type: 'success',
        message: 'Your emergency blood request has been received by our Blood Transfusion Unit. Our duty officer will contact you immediately.',
      });
      setPatientName('');
      setContactPhone('');
    } catch (err: any) {
      setStatusMsg({ type: 'error', message: err.message || 'Request failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Blood Bank & Transfusion</span>
        </nav>

        <div className="border-b border-gray-200/80 pb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Droplet className="w-3.5 h-3.5 text-rose-600" />
            <span>24/7 Transfusion Medicine Unit</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Blood Bank & Real-Time Reserves
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-2xl">
            Accredited nucleic-acid tested (NAT) red blood cells, single-donor platelets, and fresh frozen plasma.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Live Inventory Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-dark">Live Blood Inventory Units</h2>
            <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Updated Live</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-soft text-center flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2 font-black text-base border border-rose-100">
                  {item.bloodGroup}
                </div>
                <div>
                  <div className="text-2xl font-black text-dark">{item.unitsAvailable}</div>
                  <div className="text-[11px] text-gray-400 font-medium">Units in Stock</div>
                </div>
                <div className="mt-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Critical'
                        ? 'bg-rose-100 text-rose-800'
                        : item.status === 'Adequate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Request Form & Donor Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Request Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-soft">
            <h2 className="text-xl font-black text-dark mb-1">
              Submit Emergency Blood Requisition
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              Requests are monitored around the clock by our blood transfusion technologists.
            </p>

            {statusMsg && (
              <div className={`p-4 rounded-xl text-xs mb-6 flex items-center space-x-2 ${
                statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
                <span>{statusMsg.message}</span>
              </div>
            )}

            <form onSubmit={handleRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-dark mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Patient name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1-555-0100"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Required Blood Group *</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary bg-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Units Required *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={unitsRequired}
                    onChange={(e) => setUnitsRequired(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-dark mb-1">Receiving Hospital / Clinic</label>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{submitting ? 'Transmitting Request...' : 'Transmit Emergency Request'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Donor Drive Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-dark to-[#18232a] text-white rounded-2xl p-6 sm:p-8 shadow-soft space-y-4">
              <HeartHandshake className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-black">Become a Voluntary Blood Donor</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                One pint of whole blood can save up to three lives in surgical traumas and pediatric oncology. 
                Join our emergency on-call voluntary donor registry.
              </p>
              <div className="pt-2">
                <a
                  href="tel:+18006543210"
                  className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow hover:bg-primary-hover transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Donor Registry Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
