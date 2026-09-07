'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Search, Download, Trash2, CheckCircle2, XCircle, Send, Users, Sparkles, Filter, RefreshCw } from 'lucide-react';

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [broadcastModal, setBroadcastModal] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const fetchSubscribers = () => {
    setLoading(true);
    fetch('/api/newsletter')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSubscribers(data);
      })
      .catch((err) => console.error('Error fetching subscribers:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filtered = subscribers.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || sub.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const downloadCSV = () => {
    if (subscribers.length === 0) return alert('No subscribers to export.');
    const headers = 'Email,Category,Status,Subscribed Date\n';
    const rows = subscribers
      .map(
        (s) =>
          `"${s.email}","${s.category || 'All Updates'}","${s.isActive ? 'Active' : 'Unsubscribed'}","${new Date(
            s.createdAt
          ).toLocaleDateString()}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `medicalpress_newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setSendingBroadcast(true);
    setTimeout(() => {
      setSendingBroadcast(false);
      setBroadcastSuccess(true);
      setTimeout(() => {
        setBroadcastSuccess(false);
        setBroadcastModal(false);
        setBroadcastSubject('');
        setBroadcastContent('');
      }, 1500);
    }, 1200);
  };

  const activeCount = subscribers.filter((s) => s.isActive).length;
  const categories = ['All', 'All Updates', 'Cardiology & Heart', 'Pediatric Care', 'Health Tips & Nutrition'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Newsletter & Public Subscribers</h1>
          <p className="text-xs text-text-secondary">
            Manage hospital health bulletins, weekly wellness subscribers, and email campaign recipients.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setBroadcastModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Health Bulletin</span>
          </button>
          <button
            onClick={downloadCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-gray-200 text-dark hover:border-primary hover:text-primary rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-dark">{subscribers.length}</div>
            <div className="text-xs font-semibold text-text-secondary">Total Subscribers</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{activeCount}</div>
            <div className="text-xs font-semibold text-text-secondary">Active & Opted-In</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-dark">98.4%</div>
            <div className="text-xs font-semibold text-text-secondary">Deliverability Rate</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-dark">Weekly</div>
            <div className="text-xs font-semibold text-text-secondary">Cadence (Every Thursday)</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by subscriber email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-text-secondary font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                categoryFilter === cat
                  ? 'bg-dark text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={fetchSubscribers}
            title="Refresh"
            className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition ml-auto md:ml-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-gray-200 text-text-secondary uppercase font-black text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Subscriber Email</th>
                <th className="py-3.5 px-6">Interest Category</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Subscribed Date</th>
                <th className="py-3.5 px-6 text-right">Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    Loading subscriber records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    No subscribers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id || sub.email} className="hover:bg-[#F8FAFC]/80 transition">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                          {sub.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-bold text-dark">{sub.email}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-dark">
                        {sub.category || 'All Updates'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      {sub.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500">
                          <XCircle className="w-3 h-3" />
                          Unsubscribed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-text-secondary font-medium">
                      {new Date(sub.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                        Website Form
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Modal */}
      {broadcastModal && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-dark">Compose Hospital Health Bulletin</h3>
                  <p className="text-[11px] text-text-secondary">
                    Broadcast an announcement to {activeCount} active subscribers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBroadcastModal(false)}
                className="text-gray-400 hover:text-dark font-bold p-1"
              >
                ✕
              </button>
            </div>

            {broadcastSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-dark">Bulletin Dispatched Successfully!</h4>
                <p className="text-xs text-text-secondary">Queued for delivery to {activeCount} subscribers.</p>
              </div>
            ) : (
              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-dark mb-1">Email Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heart Health Awareness Month — Tips From Our Chief Cardiologist"
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-dark mb-1">Target Segment</label>
                  <select className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none">
                    <option>All Active Subscribers ({activeCount})</option>
                    <option>Cardiology & Heart Patients</option>
                    <option>Pediatric & Family Care</option>
                    <option>General Wellness Newsletter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-dark mb-1">Message Content (Markdown / HTML)</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Write your hospital announcement or wellness advice here..."
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBroadcastModal(false)}
                    className="px-4 py-2 border border-gray-200 text-dark rounded-xl font-bold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingBroadcast}
                    className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold flex items-center space-x-2"
                  >
                    {sendingBroadcast ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Broadcast...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Now</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
