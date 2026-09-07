'use client';

import React, { useState, useEffect } from 'react';
import { Droplet, Save, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function AdminBloodBankPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);

  const fetchBloodData = () => {
    setLoading(true);
    fetch('/api/blood-bank')
      .then((res) => res.json())
      .then((data) => {
        if (data.inventory) setInventory(data.inventory);
        if (data.requests) setRequests(data.requests);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBloodData();
  }, []);

  const handleUpdateUnit = async (id: string, units: number) => {
    try {
      const res = await fetch('/api/blood-bank', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, unitsAvailable: units }),
      });
      const updated = await res.json();
      setInventory(inventory.map((i) => (i.id === updated.id ? updated : i)));
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      alert('Failed to update inventory');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Blood Bank & Reserves Management</h1>
          <p className="text-xs text-text-secondary">Track real-time whole blood & platelet unit inventories and emergency requisitions.</p>
        </div>
      </div>

      {savedMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Blood reserve units updated. Public blood bank inventory refreshed.</span>
        </div>
      )}

      {/* 8 Blood Groups Inventory Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {inventory.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-soft text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 font-black text-base flex items-center justify-center mx-auto border border-rose-100">
              {item.bloodGroup}
            </div>

            <div>
              <input
                type="number"
                min="0"
                value={item.unitsAvailable}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setInventory(inventory.map((i) => (i.id === item.id ? { ...i, unitsAvailable: val } : i)));
                }}
                onBlur={(e) => handleUpdateUnit(item.id, parseInt(e.target.value) || 0)}
                className="w-16 text-center text-xl font-black text-dark border border-gray-200 rounded-lg py-1 focus:outline-none focus:border-primary"
              />
              <span className="block text-[10px] text-gray-400 mt-1">Units on Hand</span>
            </div>

            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
              item.status === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>

      {/* Emergency Requisition Queue */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-bold text-sm text-dark flex items-center space-x-2">
          <Droplet className="w-4 h-4 text-rose-600" />
          <span>Recent Emergency Blood Requisitions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                <th className="p-4">Patient Name</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Units Needed</th>
                <th className="p-4">Hospital / Ward</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/70 transition">
                  <td className="p-4 font-bold text-dark">{req.patientName}</td>
                  <td className="p-4 font-black text-rose-600">{req.bloodGroup}</td>
                  <td className="p-4 font-bold text-dark">{req.unitsRequired} Units</td>
                  <td className="p-4 text-gray-600">{req.hospital}</td>
                  <td className="p-4 text-gray-600">{req.contactPhone}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                      {req.status}
                    </span>
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
