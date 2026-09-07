'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Calendar, 
  Clock, 
  User, 
  Layers,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    let url = '/api/audit-logs?limit=100';
    if (moduleFilter !== 'All') {
      url += `&module=${encodeURIComponent(moduleFilter)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLogs(data);
      })
      .catch((err) => console.error('Error fetching logs:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter]);

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(search.toLowerCase())) ||
      (log.recordId && log.recordId.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  const exportCSV = () => {
    if (logs.length === 0) return alert('No logs to export.');
    const headers = 'Timestamp,Staff Member,Action,Module,Record ID,Details\n';
    const rows = logs
      .map(
        (l) =>
          `"${new Date(l.createdAt).toISOString()}","${l.userName}","${l.action}","${l.module}","${
            l.recordId || 'N/A'
          }","${(l.details || '').replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `medicalpress_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const modules = [
    'All',
    'Global Settings',
    'Appointments',
    'Prescriptions',
    'Doctors',
    'SEO Settings',
    'Media Library',
    'Authentication',
  ];

  const getActionBadgeClass = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('created') || act.includes('added') || act.includes('registered')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (act.includes('updated') || act.includes('modified') || act.includes('changed')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (act.includes('deleted') || act.includes('removed') || act.includes('cancelled')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Security & Activity Audit Logs</h1>
          <p className="text-xs text-text-secondary">
            Immutable audit trail recording administrative changes, clinical record modifications, and system logins.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchLogs}
            className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-gray-200 text-dark hover:border-primary hover:text-primary rounded-xl text-xs font-bold transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-dark hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search logs by staff name or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-xs text-text-secondary font-bold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Module:
          </span>
          {modules.map((mod) => (
            <button
              key={mod}
              onClick={() => setModuleFilter(mod)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                moduleFilter === mod
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-gray-200 text-text-secondary uppercase font-black text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Timestamp (UTC/Local)</th>
                <th className="py-3.5 px-6">Staff Member</th>
                <th className="py-3.5 px-6">Action</th>
                <th className="py-3.5 px-6">Module</th>
                <th className="py-3.5 px-6">Target Record</th>
                <th className="py-3.5 px-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-semibold">
                    Loading security audit trail...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-semibold">
                    No audit records found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8FAFC]/80 transition font-sans">
                    <td className="py-3.5 px-6 whitespace-nowrap text-gray-600 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-dark/10 text-dark font-bold flex items-center justify-center text-[10px]">
                          {log.userName.charAt(0)}
                        </div>
                        <span className="font-bold text-dark">{log.userName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getActionBadgeClass(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-gray-100 text-dark">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap font-mono text-[11px] text-gray-500">
                      {log.recordId ? log.recordId.slice(0, 16) : '—'}
                    </td>
                    <td className="py-3.5 px-6 text-gray-700 max-w-xs truncate" title={log.details || ''}>
                      {log.details || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
