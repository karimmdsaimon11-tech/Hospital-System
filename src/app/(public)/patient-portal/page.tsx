'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, 
  Search, 
  Calendar, 
  FileText, 
  Pill, 
  Download, 
  Printer, 
  ChevronRight, 
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function PatientPortalPage() {
  const [patientIdInput, setPatientIdInput] = useState('MED-90201'); // Demo pre-filled for instant testing!
  const [patient, setPatient] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'appointments' | 'prescriptions' | 'reports'>('appointments');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientIdInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/patients?patientId=${encodeURIComponent(patientIdInput.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No patient record found for this ID.');
      setPatient(data);
    } catch (err: any) {
      setError(err.message || 'Lookup failed');
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Patient Portal</span>
        </nav>

        <div className="border-b border-gray-200/80 pb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Medical Records Access</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Patient Portal & Records Lookup
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-2xl">
            Access your consultation history, digital doctor prescriptions, and laboratory reports directly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Lookup Box */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft max-w-xl">
          <h2 className="text-sm font-bold text-dark mb-1">Enter Your Hospital Patient ID</h2>
          <p className="text-xs text-gray-500 mb-4">Sample demo IDs to try: <code className="bg-gray-100 px-1 py-0.5 rounded text-primary font-bold">MED-90201</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-primary font-bold">MED-90202</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-primary font-bold">MED-90203</code></p>

          <form onSubmit={handleLookup} className="flex gap-2">
            <input
              type="text"
              value={patientIdInput}
              onChange={(e) => setPatientIdInput(e.target.value)}
              placeholder="e.g. MED-90201"
              required
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm text-dark font-mono flex-1 focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow transition flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Access Portal'}</span>
            </button>
          </form>

          {error && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Patient Record View */}
        {patient && (
          <div className="space-y-8 animate-fadeIn">
            {/* Patient Header Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-soft flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border-2 border-primary/20">
                <Image
                  src={patient.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                  alt={patient.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-black text-dark">{patient.name}</h2>
                    <span className="font-mono text-xs font-bold text-primary">{patient.patientId}</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                    Registered Patient
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-gray-100 text-xs text-gray-600">
                  <div><strong className="text-dark">Blood Group:</strong> {patient.bloodGroup}</div>
                  <div><strong className="text-dark">Gender:</strong> {patient.gender}</div>
                  <div><strong className="text-dark">Phone:</strong> {patient.phone}</div>
                  <div><strong className="text-dark">Known Allergies:</strong> {patient.allergies || 'None'}</div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 space-x-4">
              {[
                { key: 'appointments', label: `Appointments (${patient.appointments?.length || 0})`, icon: Calendar },
                { key: 'prescriptions', label: `Prescriptions (${patient.prescriptions?.length || 0})`, icon: Pill },
                { key: 'reports', label: `Medical Reports (${patient.reports?.length || 0})`, icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`pb-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
                      activeTab === tab.key
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-dark'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Appointments */}
            {activeTab === 'appointments' && (
              <div className="space-y-4">
                {patient.appointments && patient.appointments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patient.appointments.map((apt: any) => (
                      <div key={apt.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-soft space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-xs font-bold text-primary">{apt.appointmentNumber}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-dark">{apt.doctor?.name}</div>
                          <div className="text-xs text-primary font-medium">{apt.department?.name}</div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <span>Date: <strong>{apt.appointmentDate}</strong></span>
                          <span>Time: <strong>{apt.timeSlot}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No appointment records found.</p>
                )}
              </div>
            )}

            {/* Tab 2: Digital Prescriptions */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-6">
                {patient.prescriptions && patient.prescriptions.length > 0 ? (
                  patient.prescriptions.map((rx: any) => (
                    <div key={rx.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft space-y-4">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <div>
                          <span className="font-mono text-xs font-black text-primary">{rx.prescriptionNumber}</span>
                          <p className="text-xs text-gray-500">Issued by {rx.doctor?.name} on {new Date(rx.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => window.print()}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-dark font-bold text-xs rounded-lg flex items-center space-x-1.5"
                        >
                          <Printer className="w-3.5 h-3.5 text-primary" />
                          <span>Print Rx</span>
                        </button>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-dark">Diagnosis: </span>
                        <span className="text-xs text-text-secondary">{rx.diagnosis}</span>
                      </div>

                      {/* Medicines List */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                              <th className="p-2.5">Medicine Name</th>
                              <th className="p-2.5">Dosage</th>
                              <th className="p-2.5">Frequency</th>
                              <th className="p-2.5">Duration</th>
                              <th className="p-2.5">Instructions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {rx.items?.map((item: any) => (
                              <tr key={item.id}>
                                <td className="p-2.5 font-bold text-dark">{item.medicineName}</td>
                                <td className="p-2.5 text-primary font-semibold">{item.dosage}</td>
                                <td className="p-2.5 text-gray-600">{item.frequency}</td>
                                <td className="p-2.5 text-gray-600">{item.duration}</td>
                                <td className="p-2.5 text-gray-500">{item.instructions || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {rx.instructions && (
                        <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded-lg">
                          <strong>Doctor Advice: </strong>{rx.instructions}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No prescriptions found.</p>
                )}
              </div>
            )}

            {/* Tab 3: Medical Reports */}
            {activeTab === 'reports' && (
              <div className="space-y-4">
                {patient.reports && patient.reports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patient.reports.map((rep: any) => (
                      <div key={rep.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-soft flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-primary uppercase">{rep.category}</span>
                          <h3 className="text-sm font-bold text-dark">{rep.title}</h3>
                          <p className="text-[11px] text-gray-500">Date: {rep.testDate} • Ref: {rep.reportNumber}</p>
                          {rep.notes && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{rep.notes}</p>}
                        </div>
                        <a
                          href={rep.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-xs font-bold flex items-center space-x-1 transition shrink-0 ml-3"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>View / PDF</span>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No diagnostic laboratory reports uploaded yet.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
