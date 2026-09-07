'use client';

import React, { useState, useEffect } from 'react';
import { Siren, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminAmbulancePage() {
  const [ambulances, setAmbulances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFleet = () => {
    setLoading(true);
    fetch('/api/ambulance')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAmbulances(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/ambulance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isAvailable: !current }),
      });
      const updated = await res.json();
      setAmbulances(ambulances.map((a) => (a.id === updated.id ? updated : a)));
    } catch (err) {
      alert('Failed to update ambulance status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Ambulance Fleet Dispatch</h1>
          <p className="text-xs text-text-secondary">Track mobile ICU units, neonatal emergency transport, and driver dispatch lines.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                <th className="p-4">Vehicle Number</th>
                <th className="p-4">Unit Type</th>
                <th className="p-4">Paramedic / Driver</th>
                <th className="p-4">Direct Dispatch Hotline</th>
                <th className="p-4">Coverage Zone</th>
                <th className="p-4 text-right">Availability Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ambulances.map((amb) => (
                <tr key={amb.id} className="hover:bg-gray-50/70 transition">
                  <td className="p-4 font-mono font-bold text-dark">{amb.vehicleNumber}</td>
                  <td className="p-4 font-bold text-primary">{amb.ambulanceType}</td>
                  <td className="p-4 text-dark font-medium">{amb.driverName}</td>
                  <td className="p-4 text-gray-600 font-mono">{amb.driverPhone}</td>
                  <td className="p-4 text-gray-500">{amb.serviceArea}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleAvailability(amb.id, amb.isAvailable)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                        amb.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      {amb.isAvailable ? 'Available on Standby' : 'Dispatched / In Mission'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
