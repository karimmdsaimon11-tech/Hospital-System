'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  Activity, 
  Target, 
  Newspaper, 
  Building2, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const { metrics, trends, popularDepartments, recentAppointments, recentLeads, recentAuditLogs } = data;

  const statCards = [
    { title: 'Total Appointments', value: metrics.appointmentsCount, icon: Calendar, color: 'text-primary bg-primary/10', sub: 'Total Booked' },
    { title: 'Pending Approval', value: metrics.pendingAppointmentsCount, icon: Clock, color: 'text-amber-600 bg-amber-50', sub: 'Requires Review' },
    { title: 'Registered Patients', value: metrics.patientsCount, icon: Users, color: 'text-emerald-600 bg-emerald-50', sub: `${metrics.newPatientsThisMonth} new this month` },
    { title: 'Active Doctors', value: metrics.doctorsCount, icon: UserCheck, color: 'text-sky-600 bg-sky-50', sub: 'On Duty & Clinic' },
    { title: 'Total Revenue', value: `$${metrics.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-indigo-600 bg-indigo-50', sub: 'Consultations & Care' },
    { title: 'Clinical Units', value: metrics.departmentsCount, icon: Building2, color: 'text-purple-600 bg-purple-50', sub: 'Active Departments' },
    { title: 'Hospital Services', value: metrics.servicesCount, icon: Activity, color: 'text-rose-600 bg-rose-50', sub: 'Diagnostic & Surgery' },
    { title: 'CRM Inquiries / Leads', value: metrics.leadsCount, icon: Target, color: 'text-teal-600 bg-teal-50', sub: 'Active Pipeline' },
    { title: 'Published Articles', value: metrics.blogsCount, icon: Newspaper, color: 'text-blue-600 bg-blue-50', sub: 'Clinical Insights' },
    { title: 'Monthly Growth', value: '+24.8%', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50', sub: 'Vs. Last Quarter' },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Hospital Executive Overview</h1>
          <p className="text-xs text-text-secondary">Real-time clinical throughput, appointments, and operational metrics.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href="/admin/appointments"
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow transition"
          >
            + New Appointment
          </Link>
          <Link
            href="/admin/doctors"
            className="px-4 py-2 bg-white border border-gray-200 hover:border-primary text-dark text-xs font-bold rounded-xl shadow-sm transition"
          >
            Manage Doctors
          </Link>
        </div>
      </div>

      {/* 43. Ten Key Operational Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-soft flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 line-clamp-1">{card.title}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-dark">{card.value}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Analytics Breakdown (Section 43) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Appointment Trends Chart Visual */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-dark">Appointment & Patient Influx Trends</h2>
              <p className="text-xs text-gray-400">Monthly consultation volume distribution</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Live Synchronized
            </span>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
            {trends.map((item: any, i: number) => {
              const maxVal = 140;
              const heightPct = Math.min(100, Math.round((item.appointments / maxVal) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-bold text-gray-400 group-hover:text-primary transition opacity-0 group-hover:opacity-100">
                    {item.appointments}
                  </span>
                  <div className="w-full bg-gray-100 rounded-t-lg h-44 flex items-end overflow-hidden p-1">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-primary/80 group-hover:bg-primary rounded-t transition-all duration-500"
                    />
                  </div>
                  <span className="text-xs font-bold text-dark">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Departments Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-soft space-y-4">
          <h2 className="text-base font-extrabold text-dark border-b border-gray-100 pb-3">
            Department Influx
          </h2>
          <div className="space-y-3.5">
            {popularDepartments.map((dept: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-dark">{dept.name}</span>
                  <span className="text-primary">{dept.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    style={{ width: `${dept.percentage}%` }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Feeds (Section 43) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-extrabold text-dark">Recent Appointments</h3>
            <Link href="/admin/appointments" className="text-xs text-primary font-bold hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentAppointments.map((apt: any) => (
              <div key={apt.id} className="p-3 rounded-xl bg-gray-50 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-dark">{apt.patientName}</h4>
                  <p className="text-[11px] text-gray-500">Dr. {apt.doctor?.name} • {apt.appointmentDate}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent CRM Leads */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-extrabold text-dark">Recent CRM Inquiries</h3>
            <Link href="/admin/leads" className="text-xs text-primary font-bold hover:underline">
              View Pipeline
            </Link>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead: any) => (
              <div key={lead.id} className="p-3 rounded-xl bg-gray-50 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-dark">{lead.name}</h4>
                  <p className="text-[11px] text-gray-500">{lead.source} • {lead.interestedService || 'General Care'}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-extrabold text-dark">System Audit Trail</h3>
            <Link href="/admin/audit-logs" className="text-xs text-primary font-bold hover:underline">
              Audit Logs
            </Link>
          </div>
          <div className="space-y-2.5 text-xs">
            {recentAuditLogs.slice(0, 5).map((log: any) => (
              <div key={log.id} className="pb-2 border-b border-gray-100 last:border-none">
                <div className="flex justify-between font-bold">
                  <span className="text-dark">{log.action}</span>
                  <span className="text-[10px] text-gray-400">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-[11px] text-gray-500">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
