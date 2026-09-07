'use client';

import React, { useState, useEffect } from 'react';
import { Target, Search, Filter, Phone, Mail, Clock, CheckCircle2, AlertCircle, Edit2, Trash2 } from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchLeads = () => {
    setLoading(true);
    let url = '/api/leads?';
    if (statusFilter !== 'all') url += `status=${statusFilter}&`;
    if (sourceFilter !== 'all') url += `source=${sourceFilter}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLeads(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sourceFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    } catch (err) {
      alert('Failed to update lead status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this lead?')) return;
    try {
      await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert('Failed to delete lead');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">CRM & Patient Leads Pipeline</h1>
          <p className="text-xs text-text-secondary">Capture, track, and convert patient inquiries across all digital hospital touchpoints.</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-soft flex flex-wrap gap-3 text-xs">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 font-medium focus:outline-none focus:border-primary bg-white"
        >
          <option value="all">All Pipeline Stages</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Booked">Appointment Booked</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 font-medium focus:outline-none focus:border-primary bg-white"
        >
          <option value="all">All Channels / Sources</option>
          <option value="Appointment">Appointment Form</option>
          <option value="Contact Form">Contact Page</option>
          <option value="WhatsApp">WhatsApp Chat</option>
          <option value="Health Package">Health Package Booking</option>
          <option value="Newsletter">Newsletter Signup</option>
          <option value="Career Application">Career Application</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                <th className="p-4">Lead Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Source Channel</th>
                <th className="p-4">Service Interest</th>
                <th className="p-4">Staff Assigned</th>
                <th className="p-4">Pipeline Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/70 transition">
                  <td className="p-4 font-bold text-dark text-sm">
                    {lead.name}
                  </td>
                  <td className="p-4 text-gray-600">
                    <div>{lead.phone}</div>
                    <div className="text-[11px] text-gray-400">{lead.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded bg-gray-100 font-semibold text-gray-700 text-[11px]">
                      {lead.source}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700 max-w-xs truncate">
                    {lead.interestedService || 'General Inquiry'}
                  </td>
                  <td className="p-4 text-gray-500 font-medium">
                    {lead.assignedStaff || 'Front Desk'}
                  </td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        lead.status === 'Converted'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : lead.status === 'Lost'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-primary/10 text-primary border-primary/20'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Booked">Appointment Booked</option>
                      <option value="Converted">Converted</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Lead"
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
    </div>
  );
}
