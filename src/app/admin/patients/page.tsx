'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Users, 
  Search, 
  Plus, 
  FileText, 
  Calendar, 
  Pill, 
  Eye, 
  X,
  Phone,
  Mail,
  HeartPulse
} from 'lucide-react';

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  // New Patient Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '1985-05-15',
    gender: 'Male',
    bloodGroup: 'O+',
    address: 'New York, NY',
    emergencyContact: 'Spouse',
    allergies: '',
    medicalHistory: '',
  });

  const fetchPatients = () => {
    setLoading(true);
    fetch(`/api/patients?search=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPatients(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const viewPatientDetails = async (patientId: string) => {
    try {
      const res = await fetch(`/api/patients?patientId=${encodeURIComponent(patientId)}`);
      const data = await res.json();
      setSelectedPatient(data);
    } catch (err) {
      alert('Failed to load patient records');
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const created = await res.json();
      setPatients([created, ...patients]);
      setShowAddModal(false);
    } catch (err) {
      alert('Failed to register patient');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Patient Management</h1>
          <p className="text-xs text-text-secondary">Comprehensive digital patient health records, demographics, and clinical history.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-soft">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient ID (MED-...), name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                <th className="p-4">Patient ID</th>
                <th className="p-4">Name & Gender</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Records Count</th>
                <th className="p-4 text-right">View History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition">
                  <td className="p-4 font-mono font-bold text-primary">
                    {p.patientId}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-dark text-sm">{p.name}</div>
                    <div className="text-[11px] text-gray-400">{p.gender} • DOB: {p.dob}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-black border border-rose-100">
                      {p.bloodGroup}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div>{p.phone}</div>
                    <div className="text-[11px] text-gray-400">{p.email}</div>
                  </td>
                  <td className="p-4 text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span>{p._count?.appointments || 0} Apts</span>
                      <span>{p._count?.prescriptions || 0} Rx</span>
                      <span>{p._count?.reports || 0} Reports</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => viewPatientDetails(p.patientId)}
                      className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg font-bold text-xs transition inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Chart</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Profile Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-primary">{selectedPatient.patientId}</span>
                <h2 className="text-2xl font-black text-dark">{selectedPatient.name}</h2>
                <p className="text-xs text-gray-500">{selectedPatient.address} • {selectedPatient.phone}</p>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-gray-400 hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl text-xs">
              <div><span className="text-gray-400 block">Blood Group</span><strong className="text-rose-600 font-black text-sm">{selectedPatient.bloodGroup}</strong></div>
              <div><span className="text-gray-400 block">Gender</span><strong className="text-dark font-semibold">{selectedPatient.gender}</strong></div>
              <div><span className="text-gray-400 block">Emergency Contact</span><strong className="text-dark font-semibold">{selectedPatient.emergencyContact}</strong></div>
              <div><span className="text-gray-400 block">Allergies</span><strong className="text-dark font-semibold">{selectedPatient.allergies || 'None'}</strong></div>
            </div>

            {/* Appointments */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-dark flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Appointment History ({selectedPatient.appointments?.length || 0})</span>
              </h3>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {selectedPatient.appointments?.map((a: any) => (
                  <div key={a.id} className="p-3 bg-white border border-gray-200 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-dark">Dr. {a.doctor?.name}</strong> ({a.department?.name})
                      <div className="text-gray-400">{a.appointmentDate} at {a.timeSlot}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescriptions */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-dark flex items-center space-x-1.5">
                <Pill className="w-4 h-4 text-primary" />
                <span>Issued Prescriptions ({selectedPatient.prescriptions?.length || 0})</span>
              </h3>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {selectedPatient.prescriptions?.map((rx: any) => (
                  <div key={rx.id} className="p-3 bg-white border border-gray-200 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-primary font-mono">{rx.prescriptionNumber}</span>
                      <span className="text-gray-400">{new Date(rx.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700"><strong>Diagnosis:</strong> {rx.diagnosis}</p>
                    <p className="text-gray-500">{rx.items?.length || 0} prescribed medications</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2 bg-dark text-white font-bold text-xs rounded-xl"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h2 className="text-xl font-black text-dark">Register Patient Demographics</h2>
            <form onSubmit={handleAddPatient} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-dark mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-dark mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-dark mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition"
                >
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
