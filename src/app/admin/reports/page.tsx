'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Download, 
  Calendar, 
  X,
  Upload
} from 'lucide-react';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [patientId, setPatientId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Blood Test');
  const [fileUrl, setFileUrl] = useState('https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80');
  const [doctorName, setDoctorName] = useState('Dr. Addison Alexander');
  const [notes, setNotes] = useState('');

  const fetchReports = () => {
    setLoading(true);
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReports(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
    fetch('/api/patients').then((res) => res.json()).then((data) => Array.isArray(data) && setPatients(data));
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          title,
          category,
          fileUrl,
          doctorName,
          notes,
        }),
      });
      const created = await res.json();
      setReports([created, ...reports]);
      setShowModal(false);
      setTitle('');
      setNotes('');
    } catch (err) {
      alert('Failed to upload report');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    try {
      await fetch(`/api/reports?id=${id}`, { method: 'DELETE' });
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('Failed to delete report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Diagnostic Medical Reports</h1>
          <p className="text-xs text-text-secondary">Upload, categorize, and assign pathology, radiology, and MRI laboratory records to patients.</p>
        </div>
        <button
          onClick={() => {
            setPatientId(patients[0]?.id || '');
            setShowModal(true);
          }}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Lab Report</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                <th className="p-4">Report Ref</th>
                <th className="p-4">Report Title</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Category</th>
                <th className="p-4">Test Date</th>
                <th className="p-4">Interpreted By</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-gray-50/70 transition">
                  <td className="p-4 font-mono font-bold text-primary">{rep.reportNumber}</td>
                  <td className="p-4 font-bold text-dark">{rep.title}</td>
                  <td className="p-4">{rep.patient?.name} <span className="text-gray-400 font-mono text-[10px]">({rep.patient?.patientId})</span></td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">
                      {rep.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{rep.testDate}</td>
                  <td className="p-4 text-dark font-medium">{rep.doctorName}</td>
                  <td className="p-4 text-right space-x-2">
                    <a
                      href={rep.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-primary hover:bg-primary/10 rounded-lg inline-block"
                      title="View File"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(rep.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg inline-block"
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

      {/* Upload Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h2 className="text-xl font-black text-dark">Upload Patient Medical Report</h2>
            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-dark mb-1">Select Patient *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.patientId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-dark mb-1">Report Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 12-Lead Resting Electrocardiogram"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-dark mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Blood Test">Blood Test</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="MRI/CT">MRI/CT</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Interpreting Doctor</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-dark mb-1">Document URL / PDF File Path *</label>
                <input
                  type="text"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-dark mb-1">Clinical Findings & Remarks</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition"
                >
                  Upload & Assign Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
