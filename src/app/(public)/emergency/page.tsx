import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { 
  Siren, 
  PhoneCall, 
  Clock, 
  MapPin, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  Activity
} from 'lucide-react';

export const revalidate = 0;

export default async function EmergencyPage() {
  const [settings, ambulances] = await Promise.all([
    prisma.globalSetting.findUnique({ where: { id: 'default' } }),
    prisma.ambulance.findMany({ orderBy: { vehicleNumber: 'asc' } }),
  ]);

  const emergencyPhone = settings?.emergencyPhone || '+1-800-999-HELP';
  const ambulancePhone = settings?.ambulancePhone || '+1-800-555-AMBU';

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Emergency & Trauma</span>
        </nav>

        {/* Emergency Alert Banner */}
        <div className="bg-coral rounded-3xl p-8 sm:p-12 text-white shadow-card flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider">
              <Siren className="w-4 h-4 animate-pulse" />
              <span>24/7 Level 1 Trauma Care Center</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Emergency & Ambulance Dispatch
            </h1>
            <p className="text-sm text-white/90">
              Immediate triage, cardiovascular catheterization resuscitation, and acute stroke thrombolysis teams standing by 24 hours a day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href={`tel:${emergencyPhone.replace(/[^0-9+]/g, '')}`}
              className="px-8 py-4 bg-white text-coral hover:bg-gray-100 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center space-x-3 transition"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Emergency: {emergencyPhone}</span>
            </a>
            <a
              href={`tel:${ambulancePhone.replace(/[^0-9+]/g, '')}`}
              className="px-8 py-4 bg-dark text-white hover:bg-dark/80 rounded-2xl font-extrabold text-base shadow-lg flex items-center justify-center space-x-3 transition"
            >
              <Siren className="w-5 h-5 text-coral" />
              <span>Ambulance: {ambulancePhone}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Ambulance Fleet Real-Time Status */}
        <div>
          <h2 className="text-xl font-black text-dark mb-4 flex items-center space-x-2">
            <Siren className="w-5 h-5 text-primary" />
            <span>Mobile ICU Ambulance Fleet Status</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ambulances.map((amb) => (
              <div
                key={amb.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-gray-400">{amb.vehicleNumber}</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        amb.isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {amb.isAvailable ? 'Available on Standby' : 'Dispatched / In Mission'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-dark">{amb.ambulanceType}</h3>
                  <div className="mt-4 space-y-1 text-xs text-gray-500">
                    <div><strong>Driver / Paramedic:</strong> {amb.driverName}</div>
                    <div><strong>Service Zone:</strong> {amb.serviceArea}</div>
                    <div><strong>Direct Dispatch Line:</strong> {amb.driverPhone}</div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <a
                    href={`tel:${amb.driverPhone.replace(/[^0-9+]/g, '')}`}
                    className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-primary hover:text-white text-dark font-bold text-xs flex items-center justify-center space-x-2 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Request This Unit</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency First-Response Instructions */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-soft">
          <h2 className="text-2xl font-black text-dark mb-6">
            Life-Threatening Protocols: What to Do While Ambulance Is En Route
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
              <span className="text-xs font-bold text-rose-700 uppercase">Heart Attack Signs</span>
              <h3 className="text-base font-bold text-dark">Chest Pressure & Shortness</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Keep the patient seated upright and resting calmly. Loosen tight clothing around neck. If not allergic, give one 325mg chewable aspirin while calling our hotline immediately.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase">Stroke Protocol (F.A.S.T)</span>
              <h3 className="text-base font-bold text-dark">Face, Arms, Speech, Time</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Check for facial drooping, arm weakness or numbness, and slurred speech. Note the exact minute symptoms began; our thrombolytic team needs this critical window.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
              <span className="text-xs font-bold text-sky-700 uppercase">Severe Bleeding & Trauma</span>
              <h3 className="text-base font-bold text-dark">Direct Constant Pressure</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Apply continuous firm direct pressure with a clean sterile cloth. Elevate the injured limb above heart level if possible. Do not remove saturated bandages; layer more on top.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
