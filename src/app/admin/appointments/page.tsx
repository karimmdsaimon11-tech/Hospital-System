'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RotateCcw,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface Appointment {
  id: string;
  appointmentNumber: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  appointmentDate: string;
  timeSlot: string;
  type: string;
  status: string;
  notes: string | null;
  paymentStatus: string;
  doctor: { id: string; name: string; specialty: string };
  department: { id: string; name: string };
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // New Appointment Modal State
  const [showModal, setShowModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [aptType, setAptType] = useState('In-person');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchAppointments = () => {
    setLoading(true);
    let url = '/api/appointments?';
    if (filterDoctor !== 'all') url += `doctorId=${filterDoctor}&`;
    if (filterStatus !== 'all') url += `status=${filterStatus}&`;
    if (search) url += `search=${encodeURIComponent(search)}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAppointments(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
    fetch('/api/doctors').then((res) => res.json()).then((data) => Array.isArray(data) && setDoctors(data));
    fetch('/api/departments').then((res) => res.json()).then((data) => Array.isArray(data) && setDepartments(data));
  }, [filterDoctor, filterStatus, search]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert('Failed to update appointment status');
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSubmitting(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientPhone,
          patientEmail,
          departmentId: selectedDept,
          doctorId: selectedDoc,
          appointmentDate,
          timeSlot,
          type: aptType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to book slot');

      setShowModal(false);
      fetchAppointments();
      setPatientName('');
      setPatientPhone('');
      setPatientEmail('');
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Appointments & Schedules</h1>
          <p className="text-xs text-text-secondary">Comprehensive schedule calendar, booking confirmation, and collision checks.</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* View mode toggle */}
          <div className="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm text-xs font-bold">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:text-dark'}`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg transition ${viewMode === 'calendar' ? 'bg-primary text-white' : 'text-gray-600 hover:text-dark'}`}
            >
              Calendar View
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-soft flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient name, phone, or appointment #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <select
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 font-medium focus:outline-none focus:border-primary bg-white"
        >
          <option value="all">All Doctors</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 font-medium focus:outline-none focus:border-primary bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Rescheduled">Rescheduled</option>
        </select>
      </div>

      {/* 18. Appointments List View */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Ref Number</th>
                  <th className="p-4">Patient Info</th>
                  <th className="p-4">Doctor & Dept</th>
                  <th className="p-4">Date & Time Slot</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-4 font-mono font-bold text-primary">
                      {apt.appointmentNumber}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-dark text-sm">{apt.patientName}</div>
                      <div className="text-[11px] text-gray-400">{apt.patientPhone} • {apt.patientEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-dark">{apt.doctor?.name}</div>
                      <div className="text-[11px] text-primary font-medium">{apt.department?.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-dark">{apt.appointmentDate}</div>
                      <div className="text-primary font-bold text-[11px]">{apt.timeSlot}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-gray-100 font-medium text-[11px]">
                        {apt.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        apt.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : apt.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-gray-200 text-[11px] font-bold bg-white text-dark focus:outline-none focus:border-primary"
                      >
                        <option value="Confirmed">Confirm</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancel</option>
                        <option value="Rescheduled">Reschedule</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Calendar View (Section 18) */
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-sm font-bold">
            <span>Calendar Schedule View</span>
            <span className="text-xs text-primary font-medium">Grouped by Date</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-21'].map((d) => {
              const dayApts = appointments.filter((a) => a.appointmentDate === d);
              return (
                <div key={d} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                  <div className="flex justify-between items-center font-bold text-xs border-b border-gray-200 pb-2">
                    <span className="text-dark">{d}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">
                      {dayApts.length} Slots
                    </span>
                  </div>
                  <div className="space-y-2">
                    {dayApts.map((a) => (
                      <div key={a.id} className="p-2.5 bg-white rounded-lg border border-gray-100 shadow-xs text-xs">
                        <div className="flex justify-between font-bold text-dark">
                          <span>{a.timeSlot}</span>
                          <span className="text-[10px] text-primary">{a.status}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1">{a.patientName} → Dr. {a.doctor?.name}</div>
                      </div>
                    ))}
                    {dayApts.length === 0 && (
                      <p className="text-[11px] text-gray-400 py-3 text-center">No bookings on this date</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Appointment Modal with collision check */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h2 className="text-xl font-black text-dark">Create New Appointment</h2>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-dark mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-dark mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-dark mb-1">Department</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="">-- Choose Dept --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Doctor Specialist *</label>
                  <select
                    required
                    value={selectedDoc}
                    onChange={(e) => setSelectedDoc(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-dark mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
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
                  disabled={modalSubmitting}
                  className="px-5 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition"
                >
                  {modalSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
