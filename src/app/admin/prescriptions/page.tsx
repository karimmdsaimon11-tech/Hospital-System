'use client';

import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Plus, 
  Search, 
  Printer, 
  Trash2, 
  Calendar, 
  User, 
  X,
  FileText
} from 'lucide-react';

export default function AdminPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Prescription Modal
  const [showModal, setShowModal] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [items, setItems] = useState<any[]>([
    { medicineName: 'Amoxicillin + Clavulanic Acid', dosage: '625mg', frequency: '1-0-1', duration: '7 Days', instructions: 'After meals' },
  ]);

  const [activePrintRx, setActivePrintRx] = useState<any | null>(null);

  const fetchPrescriptions = () => {
    setLoading(true);
    fetch('/api/prescriptions')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPrescriptions(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPrescriptions();
    fetch('/api/patients').then((res) => res.json()).then((data) => Array.isArray(data) && setPatients(data));
    fetch('/api/doctors').then((res) => res.json()).then((data) => Array.isArray(data) && setDoctors(data));
  }, []);

  const addItemRow = () => {
    setItems([...items, { medicineName: '', dosage: '', frequency: '1-0-1', duration: '5 Days', instructions: '' }]);
  };

  const removeItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCreateRx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !diagnosis) {
      alert('Please fill patient, doctor, and diagnosis.');
      return;
    }

    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          doctorId,
          diagnosis,
          instructions,
          followUpDate,
          items,
        }),
      });
      const created = await res.json();
      setPrescriptions([created, ...prescriptions]);
      setShowModal(false);
    } catch (err) {
      alert('Failed to save prescription');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Electronic Prescriptions</h1>
          <p className="text-xs text-text-secondary">Digital clinical prescriptions, drug dosages, and printable official hospital slips.</p>
        </div>
        <button
          onClick={() => {
            setPatientId(patients[0]?.id || '');
            setDoctorId(doctors[0]?.id || '');
            setShowModal(true);
          }}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Write Digital Prescription</span>
        </button>
      </div>

      {/* Prescriptions Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                <th className="p-4">Rx Ref</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Doctor</th>
                <th className="p-4">Diagnosis</th>
                <th className="p-4">Medicines Prescribed</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-gray-50/70 transition">
                  <td className="p-4 font-mono font-bold text-primary">
                    {rx.prescriptionNumber}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-dark">{rx.patient?.name}</div>
                    <div className="text-[11px] text-gray-400">{rx.patient?.patientId}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-dark">{rx.doctor?.name}</div>
                    <div className="text-[11px] text-primary">{rx.doctor?.department?.name}</div>
                  </td>
                  <td className="p-4 text-gray-700 max-w-xs truncate">
                    {rx.diagnosis}
                  </td>
                  <td className="p-4 text-gray-500">
                    {rx.items?.length || 0} drugs
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setActivePrintRx(rx)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-primary hover:text-white rounded-lg font-bold text-xs transition inline-flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Rx</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Write Prescription Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-black text-dark">Issue Digital Prescription</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRx} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block font-bold text-dark mb-1">Prescribing Doctor *</label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-dark mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Bronchitis with Mild Spasm"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Dynamic Medicines Table */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-dark uppercase tracking-wider text-[11px]">Prescribed Medications</h3>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-primary font-bold text-xs flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded-lg">
                      <input
                        type="text"
                        placeholder="Drug Name"
                        value={it.medicineName}
                        onChange={(e) => {
                          const n = [...items];
                          n[idx].medicineName = e.target.value;
                          setItems(n);
                        }}
                        className="col-span-4 px-2 py-1.5 border rounded text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Dosage (500mg)"
                        value={it.dosage}
                        onChange={(e) => {
                          const n = [...items];
                          n[idx].dosage = e.target.value;
                          setItems(n);
                        }}
                        className="col-span-2 px-2 py-1.5 border rounded text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Frequency (1-0-1)"
                        value={it.frequency}
                        onChange={(e) => {
                          const n = [...items];
                          n[idx].frequency = e.target.value;
                          setItems(n);
                        }}
                        className="col-span-2 px-2 py-1.5 border rounded text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={it.duration}
                        onChange={(e) => {
                          const n = [...items];
                          n[idx].duration = e.target.value;
                          setItems(n);
                        }}
                        className="col-span-3 px-2 py-1.5 border rounded text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeItemRow(idx)}
                        className="col-span-1 text-rose-500 hover:text-rose-700 flex justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-dark mb-1">Physician Advice / Dietary Guidelines</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
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
                  Save & Issue Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Prescription Modal Slip (Letterhead format) */}
      {activePrintRx && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="border-b-2 border-primary pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black text-dark tracking-tight">MedicalPRESS HOSPITAL</h2>
                <p className="text-xs text-gray-500">742 Evergreen Medical Parkway, Healthcare District, NY 10001</p>
                <p className="text-xs text-primary font-bold">Official Outpatient Prescription Slip</p>
              </div>
              <div className="text-right text-xs">
                <span className="font-mono font-bold text-primary">{activePrintRx.prescriptionNumber}</span>
                <p className="text-gray-400">{new Date(activePrintRx.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl">
              <div><strong>Patient:</strong> {activePrintRx.patient?.name} ({activePrintRx.patient?.gender}, {activePrintRx.patient?.bloodGroup})</div>
              <div><strong>Patient ID:</strong> {activePrintRx.patient?.patientId}</div>
              <div><strong>Consultant:</strong> {activePrintRx.doctor?.name}</div>
              <div><strong>Specialty:</strong> {activePrintRx.doctor?.specialty}</div>
            </div>

            <div>
              <strong className="text-xs text-dark block mb-1">Diagnosis:</strong>
              <p className="text-xs text-text-secondary bg-gray-50 p-3 rounded-lg">{activePrintRx.diagnosis}</p>
            </div>

            <div className="space-y-2">
              <strong className="text-xs text-dark block">Prescribed Medicines (Rx):</strong>
              <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 font-bold text-gray-600">
                  <tr>
                    <th className="p-2.5">Medicine</th>
                    <th className="p-2.5">Dosage</th>
                    <th className="p-2.5">Frequency</th>
                    <th className="p-2.5">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activePrintRx.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="p-2.5 font-bold text-dark">{item.medicineName}</td>
                      <td className="p-2.5 text-primary font-semibold">{item.dosage}</td>
                      <td className="p-2.5 text-gray-600">{item.frequency}</td>
                      <td className="p-2.5 text-gray-600">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {activePrintRx.instructions && (
              <div className="text-xs text-gray-600 italic">
                <strong>Advice: </strong>{activePrintRx.instructions}
              </div>
            )}

            <div className="pt-6 border-t flex items-center justify-between">
              <button
                onClick={() => setActivePrintRx(null)}
                className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-lg text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-dark hover:bg-dark/80 text-white font-bold text-xs rounded-xl flex items-center space-x-2"
              >
                <Printer className="w-4 h-4 text-primary" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
