'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ChevronRight,
  Sparkles,
  Stethoscope,
  Printer
} from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageContext';

interface Department {
  id: string;
  name: string;
  slug: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  departmentId: string;
  visitingHours: string;
}

interface Slot {
  time: string;
  isAvailable: boolean;
}

export default function AppointmentPage() {
  const { t } = useLanguage();

  // Form State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('In-person');
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Slots State
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [slotMessage, setSlotMessage] = useState<string>('');

  // Submission State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);

  // Load departments and doctors
  useEffect(() => {
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDepartments(data);
      })
      .catch(() => {});

    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDoctors(data);
      })
      .catch(() => {});

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateFormatted = tomorrow.toISOString().split('T')[0];
    setAppointmentDate(dateFormatted);
  }, []);

  // Filter doctors by selected department
  const filteredDoctors = selectedDept
    ? doctors.filter((doc) => doc.departmentId === selectedDept)
    : doctors;

  // Whenever doctor or date changes, fetch available time slots from backend
  useEffect(() => {
    if (!selectedDoc || !appointmentDate) {
      setAvailableSlots([]);
      setSlotMessage('');
      return;
    }

    setSlotsLoading(true);
    setSlotMessage('');
    setSelectedSlot('');

    fetch(`/api/appointments/available-slots?doctorId=${selectedDoc}&date=${appointmentDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.available && Array.isArray(data.slots)) {
          setAvailableSlots(data.slots);
          if (data.slots.length === 0) {
            setSlotMessage('No slots available on this date.');
          }
        } else {
          setAvailableSlots([]);
          setSlotMessage(data.message || 'Doctor not available on selected date.');
        }
      })
      .catch(() => {
        setSlotMessage('Failed to check doctor schedule.');
      })
      .finally(() => {
        setSlotsLoading(false);
      });
  }, [selectedDoc, appointmentDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name || !phone || !email || !selectedDoc || !appointmentDate || !selectedSlot) {
      setError('Please complete all required fields including doctor, date, and available time slot.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: name,
          patientPhone: phone,
          patientEmail: email,
          departmentId: selectedDept,
          doctorId: selectedDoc,
          appointmentDate,
          timeSlot: selectedSlot,
          type: appointmentType,
          notes: message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      setSuccessReceipt(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while booking. Please try another slot.');
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-[#F2F8F9] py-12 px-4 sm:px-6 lg:px-8">
      {/* 21. Header & Breadcrumbs (Section 21) */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Make an Appointment</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
          Make an Appointment
        </h1>
        <p className="mt-2 text-sm text-text-secondary max-w-lg mx-auto">
          Book your consultation with our experienced medical specialists. Real-time availability with guaranteed zero waiting.
        </p>
      </div>

      {/* 21. Centered Realistic Dark Clipboard */}
      <div className="max-w-[820px] mx-auto">
        {/* Physical Clipboard Base */}
        <div className="clipboard-board p-4 sm:p-7 relative">
          {/* Metallic Silver Top Clip */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
            {/* Hanging Hole Ring */}
            <div className="w-6 h-6 rounded-full border-2 border-[#80868b] bg-[#222d36] shadow-inner mb-1 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#1b242b]" />
            </div>
            {/* Metallic Clip Bar */}
            <div className="clipboard-metal-clip w-44 sm:w-56 h-8 rounded-lg flex items-center justify-between px-4 border border-white/40">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4a4e52] shadow-inner border border-gray-400" />
              <div className="clipboard-metal-spring w-20 h-3 rounded-sm border border-gray-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#4a4e52] shadow-inner border border-gray-400" />
            </div>
          </div>

          {/* White Paper Sheet on Clipboard */}
          <div className="clipboard-paper rounded-xl p-6 sm:p-10 pt-10 mt-3 relative z-10 border border-gray-200">
            {/* Paper Header / Hospital Watermark */}
            <div className="border-b-2 border-primary/20 pb-5 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-black shadow-sm">
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <div className="absolute w-1.5 h-5 bg-white rounded-sm" />
                    <div className="absolute h-1.5 w-5 bg-white rounded-sm" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-dark tracking-tight">
                    MedicalPRESS <span className="text-xs font-semibold text-primary uppercase">Outpatient Clinic</span>
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium">Official Appointment & Consultation Request Form</p>
                </div>
              </div>
              <div className="text-left sm:text-right text-xs text-gray-500">
                <div>Date: <strong className="text-dark">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></div>
                <div className="text-emerald-700 font-bold text-[11px] flex items-center space-x-1 sm:justify-end">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-time Doctor Sync Active</span>
                </div>
              </div>
            </div>

            {/* If Appointment Submitted Successfully: Show Printable Receipt */}
            {successReceipt ? (
              <div className="py-6 space-y-6 animate-fadeIn">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-emerald-900">
                    Appointment Request Confirmed!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-700 mt-1 max-w-md mx-auto">
                    Your consultation slot has been reserved in our hospital schedule. A copy has been dispatched to your email.
                  </p>
                </div>

                {/* Printable Appointment Slip */}
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Appointment Reference</span>
                    <span className="text-base font-mono font-black text-primary">{successReceipt.appointmentNumber}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block font-medium">Patient Name</span>
                      <strong className="text-dark text-sm">{successReceipt.patientName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Contact Phone</span>
                      <strong className="text-dark text-sm">{successReceipt.patientPhone}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Consulting Doctor</span>
                      <strong className="text-dark text-sm">{successReceipt.doctor?.name || 'Assigned Specialist'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Department</span>
                      <strong className="text-dark text-sm">{successReceipt.department?.name || 'General Care'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Appointment Date</span>
                      <strong className="text-dark text-sm font-semibold">{successReceipt.appointmentDate}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Reserved Time Slot</span>
                      <strong className="text-primary text-sm font-black">{successReceipt.timeSlot}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Consultation Mode</span>
                      <strong className="text-dark text-sm">{successReceipt.type}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Status</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        {successReceipt.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 px-4 rounded-xl bg-dark text-white font-bold text-xs flex items-center justify-center space-x-2 hover:bg-dark/80 transition"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Appointment Slip</span>
                  </button>
                  <button
                    onClick={() => {
                      setSuccessReceipt(null);
                      setName('');
                      setPhone('');
                      setEmail('');
                      setMessage('');
                      setSelectedSlot('');
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center space-x-2 hover:bg-primary-hover transition"
                  >
                    <span>Book Another Consultation</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Paper Appointment Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Section 1: Clinical Department & Doctor Selection */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-1.5 flex items-center space-x-1.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>1. Select Specialty & Specialist</span>
                  </h3>

                  {/* Two-column on desktop, single-column on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Department */}
                    <div>
                      <label className="block text-xs font-extrabold text-dark mb-1.5">
                        Medical Department <span className="text-coral">*</span>
                      </label>
                      <select
                        value={selectedDept}
                        onChange={(e) => {
                          setSelectedDept(e.target.value);
                          setSelectedDoc('');
                        }}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm"
                      >
                        <option value="">-- Select Medical Department --</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Doctor */}
                    <div>
                      <label className="block text-xs font-extrabold text-dark mb-1.5">
                        Preferred Specialist <span className="text-coral">*</span>
                      </label>
                      <select
                        value={selectedDoc}
                        onChange={(e) => setSelectedDoc(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm"
                      >
                        <option value="">-- Choose Specialist Doctor --</option>
                        {filteredDoctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} ({doc.specialty})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Consultation Type */}
                  <div className="pt-1">
                    <label className="block text-xs font-extrabold text-dark mb-2">
                      Consultation Mode
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['In-person', 'Video Consultation', 'Follow-up', 'Emergency Consultation'].map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setAppointmentType(type)}
                          className={`py-2 px-2.5 rounded-lg text-xs font-bold border text-center transition ${
                            appointmentType === type
                              ? 'bg-primary text-white border-primary shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 2: Date & Dynamic Slots */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-1.5 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>2. Select Date & Real-Time Time Slot</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date Picker */}
                    <div>
                      <label className="block text-xs font-extrabold text-dark mb-1.5">
                        Appointment Date <span className="text-coral">*</span>
                      </label>
                      <input
                        type="date"
                        min={getMinDate()}
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm font-medium"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">Select date to load doctor visiting hours</p>
                    </div>

                    {/* Available Time Slots Grid */}
                    <div>
                      <label className="block text-xs font-extrabold text-dark mb-1.5">
                        Available Time Slots <span className="text-coral">*</span>
                      </label>

                      {slotsLoading ? (
                        <div className="py-4 text-center text-xs text-gray-500 animate-pulse">
                          Checking doctor schedule and existing bookings...
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                          {availableSlots.map((slot, idx) => (
                            <button
                              type="button"
                              key={idx}
                              disabled={!slot.isAvailable}
                              onClick={() => setSelectedSlot(slot.time)}
                              className={`py-2 px-1 text-xs font-bold rounded-lg border transition ${
                                selectedSlot === slot.time
                                  ? 'bg-primary text-white border-primary shadow-sm'
                                  : slot.isAvailable
                                  ? 'bg-white text-dark border-gray-200 hover:border-primary hover:text-primary'
                                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                          {slotMessage || 'Please choose a specialist and appointment date to view available time slots.'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Patient Information */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-1.5 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>3. Patient Personal Information</span>
                  </h3>

                  {/* Two-column on desktop, single-column on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-extrabold text-dark mb-1.5">
                        Patient Full Name <span className="text-coral">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Jonathan Miller"
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-extrabold text-dark mb-1.5">
                        Contact Phone Number <span className="text-coral">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1-555-0101"
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm"
                      />
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-extrabold text-dark mb-1.5">
                        Email Address (for confirmation ticket) <span className="text-coral">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="patient@example.com"
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-dark text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm"
                      />
                    </div>

                    {/* Message / Symptoms */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-extrabold text-dark mb-1.5">
                        Brief Symptoms / Reason for Consultation
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please describe any primary symptoms, ongoing medications, or specific concerns..."
                        className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-dark text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Request Button */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] text-gray-500 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>No pre-payment required. Pay comfortably at reception on consultation day.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-sm shadow-lg shadow-primary/30 transition transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <span>{submitting ? 'Securing Your Slot...' : 'Submit Request'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
