import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { 
  Calendar, 
  Search, 
  PhoneCall, 
  Clock, 
  ShieldCheck, 
  Award, 
  HeartPulse, 
  Activity, 
  Users, 
  User,
  Camera,
  ArrowRight, 
  Building2, 
  FileText, 
  Stethoscope,
  Siren,
  Sparkles,
  Droplet,
  CheckCircle2,
  Mail
} from 'lucide-react';
import DoctorsSection from '@/components/home/DoctorsSection';
import DepartmentsSection from '@/components/home/DepartmentsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterForm from '@/components/home/NewsletterForm';

export const revalidate = 0; // Ensures database changes appear instantly on refresh!

export default async function HomePage() {
  // Fetch live database data safely
  let settings: any = null;
  let departments: any[] = [];
  let doctors: any[] = [];
  let services: any[] = [];
  let packages: any[] = [];
  let testimonials: any[] = [];
  let blogPosts: any[] = [];
  let ambulances: any[] = [];

  try {
    const results = await Promise.all([
      prisma.globalSetting.findUnique({ where: { id: 'default' } }),
      prisma.department.findMany({ where: { status: 'Active' }, orderBy: { name: 'asc' } }),
      prisma.doctor.findMany({
        where: { status: 'Active' },
        include: { department: true },
        orderBy: { name: 'asc' },
      }),
      prisma.service.findMany({
        where: { status: 'Published' },
        include: { department: true },
        take: 6,
      }),
      prisma.healthPackage.findMany({
        where: { status: 'Active' },
        take: 4,
      }),
      prisma.testimonial.findMany({
        where: { isApproved: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.blogPost.findMany({
        where: { status: 'Published' },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.ambulance.findMany({ take: 3 }),
    ]);

    settings = results[0];
    departments = results[1] || [];
    doctors = results[2] || [];
    services = results[3] || [];
    packages = results[4] || [];
    testimonials = results[5] || [];
    blogPosts = results[6] || [];
    ambulances = results[7] || [];
  } catch (err) {
    console.error('Database query error on HomePage:', err);
  }

  const globalInfo = settings || {
    hospitalName: 'MedicalPress Hospital',
    tagline: 'Advanced Healthcare & Compassionate Care',
    phone: '+1-800-654-3210',
    emergencyPhone: '+1-800-999-HELP',
    openingHours: 'Monday to Saturday — 8AM to 9PM',
    announcementText: 'Welcome to MedicalPress — Advanced Healthcare & Compassionate Care',
  };

  return (
    <div className="space-y-0">
      {/* 7. HERO SECTION (Section 7) */}
      <section className="relative bg-gradient-to-r from-[#1b2b35] via-[#202b33] to-[#16303d] text-white py-20 lg:py-28 overflow-hidden">
        {/* Background Image Overlay with Realistic Healthcare Atmosphere */}
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80"
            alt="Modern Hospital Environment"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Medical Cross Icon Badge */}
              <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold tracking-wide uppercase backdrop-blur-md">
                <div className="w-3.5 h-3.5 rounded-sm bg-primary flex items-center justify-center text-white text-[10px]">
                  +
                </div>
                <span>Internationally Accredited Clinical Excellence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Medical Services <br />
                <span className="text-primary">That You Can Trust</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Advanced medical care delivered by experienced professionals with compassion, 
                cutting-edge technology and unwavering dedication to clinical integrity.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/appointment"
                  className="px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-sm sm:text-base shadow-lg shadow-primary/30 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book an Appointment</span>
                </Link>

                <Link
                  href="/doctors"
                  className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-sm transition flex items-center space-x-2"
                >
                  <Search className="w-4 h-4 text-primary" />
                  <span>Find a Doctor</span>
                </Link>

                <a
                  href={`tel:${globalInfo.emergencyPhone.replace(/[^0-9+]/g, '')}`}
                  className="px-5 py-3.5 rounded-xl bg-coral/20 hover:bg-coral text-coral hover:text-white font-bold text-sm sm:text-base border border-coral/40 transition flex items-center space-x-2"
                >
                  <Siren className="w-4 h-4 animate-pulse" />
                  <span>Emergency: {globalInfo.emergencyPhone}</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-700/60 max-w-lg text-xs text-gray-300">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  <span>JCI Gold Seal Quality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>24/7 Level 1 Trauma</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-primary shrink-0" />
                  <span>Top Ranked Doctors</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image (Doctor in turquoise scrubs with stethoscope) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Subtle cyan glow behind doctor */}
                <div className="absolute -inset-4 rounded-3xl bg-primary/20 filter blur-2xl opacity-70" />
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-dark-card aspect-[4/5] flex items-center justify-center">
                  {globalInfo.heroDoctorImage ? (
                    <>
                      <img
                        src={globalInfo.heroDoctorImage}
                        alt={globalInfo.heroDoctorName || "Doctor Profile"}
                        className="w-full h-full object-cover object-top"
                      />
                      {globalInfo.heroDoctorName && (
                        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-dark/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-sm">
                              {globalInfo.heroDoctorName.replace(/^(Dr\.\s*|Dr\s*)/i, '').split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'MD'}
                            </div>
                            <div>
                              <div className="font-extrabold text-sm">{globalInfo.heroDoctorName}</div>
                              <div className="text-xs text-primary font-medium">{globalInfo.heroDoctorTitle || 'Specialist Consultant'}</div>
                            </div>
                          </div>
                          <Link
                            href="/appointment"
                            className="text-xs bg-primary hover:bg-primary-hover px-3 py-1.5 rounded-lg font-bold"
                          >
                            Consult
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Empty Doctor Photo Shape / Placeholder */
                    <div className="w-full h-full p-5 flex flex-col items-center justify-center bg-gradient-to-b from-[#1b2b35]/70 to-[#0e1e28]/90">
                      <div className="w-full h-full border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center p-6 text-center transition hover:border-primary/50">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary/70 mb-4 shadow-inner">
                          <User className="w-10 h-10 text-primary/60" />
                        </div>
                        <h3 className="text-base font-bold text-white/90">Doctor Photo Slot</h3>
                        <p className="text-xs text-gray-400 mt-1.5 max-w-[210px] leading-relaxed">
                          Shape is kept empty. Add your doctor picture anytime from Admin Panel.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. QUICK ACTIONS SECTION (Section 8) */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'Book Appointment', href: '/appointment', icon: Calendar, color: 'text-primary bg-primary/10' },
            { title: 'Find a Doctor', href: '/doctors', icon: Search, color: 'text-sky-600 bg-sky-50' },
            { title: 'Emergency 24/7', href: '/emergency', icon: Siren, color: 'text-coral bg-coral/10' },
            { title: 'Departments', href: '/departments', icon: Building2, color: 'text-emerald-600 bg-emerald-50' },
            { title: 'Medical Reports', href: '/patient-portal', icon: FileText, color: 'text-indigo-600 bg-indigo-50' },
            { title: 'Contact Hospital', href: '/contact', icon: PhoneCall, color: 'text-amber-600 bg-amber-50' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="bg-white rounded-xl p-4 sm:p-5 shadow-card hover:shadow-lg border border-gray-100 hover:border-primary transition group flex flex-col items-center text-center"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-dark group-hover:text-primary transition line-clamp-2">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 9. STATISTICS SECTION (Section 9) */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-soft border border-medical-border grid grid-cols-2 lg:grid-cols-5 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-primary">25+</div>
              <div className="mt-1 text-xs sm:text-sm font-bold text-dark">Years Experience</div>
              <div className="text-[11px] text-text-secondary">Established 2001</div>
            </div>
            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-dark">100+</div>
              <div className="mt-1 text-xs sm:text-sm font-bold text-dark">Expert Doctors</div>
              <div className="text-[11px] text-text-secondary">Board-certified Specialists</div>
            </div>
            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-primary">50+</div>
              <div className="mt-1 text-xs sm:text-sm font-bold text-dark">Medical Departments</div>
              <div className="text-[11px] text-text-secondary">Multi-specialty Units</div>
            </div>
            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-dark">100K+</div>
              <div className="mt-1 text-xs sm:text-sm font-bold text-dark">Recovered Patients</div>
              <div className="text-[11px] text-text-secondary">99.4% Positive Outcome</div>
            </div>
            <div className="pt-4 lg:pt-0 col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl font-black text-coral">24/7</div>
              <div className="mt-1 text-xs sm:text-sm font-bold text-dark">Emergency Care</div>
              <div className="text-[11px] text-text-secondary">Immediate ICU Dispatch</div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FEATURED DEPARTMENTS (Section 10) */}
      <DepartmentsSection departments={departments} />

      {/* 11 & 12. MEET OUR DOCTORS (Section 11 & 12) */}
      <DoctorsSection initialDoctors={doctors} departments={departments} />

      {/* 13. HOSPITAL SERVICES SECTION (Section 13 & 68: 3-column responsive) */}
      <section className="py-20 bg-white border-t border-gray-100" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Activity className="w-4 h-4" />
              <span>Comprehensive Healthcare</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
              Our Advanced Services
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-secondary">
              From automated robotics diagnostics and 24/7 blood transfusion banking to dental oral surgery, 
              we cover every clinical need with precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-background rounded-xl overflow-hidden border border-medical-border shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={srv.image}
                    alt={srv.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {srv.price > 0 && (
                    <div className="absolute top-3 right-3 bg-dark/85 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-white shadow">
                      From ${srv.price}
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
                      {srv.department?.name || 'Hospital Service'}
                    </span>
                    <h3 className="text-lg font-extrabold text-dark mt-1 group-hover:text-primary transition line-clamp-1">
                      {srv.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3">
                      {srv.shortDesc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-medical-border/60 flex items-center justify-between">
                    <Link
                      href={`/services/${srv.slug}`}
                      className="text-xs font-bold text-dark hover:text-primary transition flex items-center space-x-1"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    </Link>
                    <Link
                      href="/appointment"
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition"
                    >
                      Book Care
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-dark text-white font-bold text-sm shadow hover:bg-primary transition"
            >
              <span>Explore All Hospital Services & Labs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 14. WHY CHOOSE US (Section 14) */}
      <section className="py-20 bg-background border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Core Medical Values</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
              Why Choose MedicalPress?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-secondary">
              We combine world-class medical innovation with heartfelt compassion to deliver 
              exceptional healthcare experiences and transparent clinical outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Experienced Specialists',
                desc: 'Over 100+ internationally accredited consultants, Fellows of Royal Colleges, and leading surgical minds.',
                icon: Award,
              },
              {
                title: 'Advanced Medical Technology',
                desc: 'Equipped with 3 Tesla MRI, 128-Slice Low-Dose CT, robotic navigational surgery suites, and molecular lab testing.',
                icon: Sparkles,
              },
              {
                title: '24/7 Emergency & Trauma',
                desc: 'Dedicated Level 1 Trauma bays, rapid stroke response team, and mobile ICU ambulances with telemetry.',
                icon: Siren,
              },
              {
                title: 'Patient-Centered Care',
                desc: 'Individualized treatment plans designed around your comfort, personal dignity, and family support.',
                icon: HeartPulse,
              },
              {
                title: 'Modern Healing Facilities',
                desc: 'Private boutique inpatient suites, laminar airflow operating rooms, and healing gardens designed for recovery.',
                icon: Building2,
              },
              {
                title: 'Affordable & Transparent',
                desc: 'Cashless global insurance partnerships, transparent bundled surgery costs, and zero hidden hospital fees.',
                icon: CheckCircle2,
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-8 border border-gray-100 shadow-soft hover:shadow-card transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-dark mb-2">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 15. APPOINTMENT CALL TO ACTION (Section 15) */}
      <section className="py-16 bg-gradient-to-r from-dark via-[#243542] to-dark text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Make an Appointment
            </h2>
            <p className="text-base text-gray-300">
              Book your consultation with our experienced medical specialists. Immediate online slot confirmation with zero waiting.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/appointment"
              className="px-8 py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-sm shadow-lg shadow-primary/30 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </Link>
            <Link
              href="/doctors"
              className="px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
            >
              <span>Browse Doctors</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 31. PREVENTIVE HEALTH PACKAGES (Section 31) */}
      <section className="py-20 bg-white" id="packages">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Preventive Wellness Audits</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
              Health Checkup Packages
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-secondary">
              Early detection saves lives. Choose from comprehensive wellness screenings designed 
              by clinical professors for every stage of your life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-background rounded-2xl overflow-hidden border border-medical-border shadow-soft hover:shadow-card hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {pkg.discount > 0 && (
                    <div className="absolute top-3 right-3 bg-coral text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow">
                      {pkg.discount}% OFF
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-dark group-hover:text-primary transition line-clamp-1">
                      {pkg.name}
                    </h3>

                    <div className="mt-3 flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-dark">${pkg.price}</span>
                      {pkg.originalPrice > pkg.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ${pkg.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200/70 text-xs text-gray-500 space-y-1">
                      <div><strong className="text-dark">Duration:</strong> {pkg.duration}</div>
                      <div><strong className="text-dark">Schedule:</strong> {pkg.availability}</div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-text-secondary font-medium line-clamp-2">
                        {pkg.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200/70">
                    <Link
                      href={`/appointment?package=${encodeURIComponent(pkg.name)}`}
                      className="w-full flex items-center justify-center space-x-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition shadow-sm"
                    >
                      <span>Get Package / Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 29. TESTIMONIALS SLIDER (Section 29) */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 27. LATEST HEALTH NEWS & BLOG (Section 27) */}
      <section className="py-20 bg-background" id="news">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Medical News & Insights</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
                Latest Health Articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="mt-4 sm:mt-0 inline-flex items-center space-x-2 text-sm font-bold text-primary hover:underline"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-card hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-primary shadow-sm">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-gray-400 font-semibold mb-2">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • By {post.author}
                    </div>
                    <h3 className="text-base font-extrabold text-dark group-hover:text-primary transition line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-text-secondary line-clamp-3 leading-relaxed">
                      {post.shortDesc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-primary flex items-center space-x-1 hover:underline"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 35 & 36. EMERGENCY & AMBULANCE DISPATCH BANNER (Section 35 & 36) */}
      <section className="py-12 bg-coral text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-5 text-center lg:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
              <Siren className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-coral-light">
                24/7 Rapid Trauma & Mobile ICU Response
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-0.5">
                Have a Medical Emergency?
              </h3>
              <p className="text-xs sm:text-sm text-white/90 max-w-xl mt-1">
                Our GPS-coordinated ICU ambulances and Level 1 Trauma Center operate 24 hours a day with zero delays.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${globalInfo.emergencyPhone.replace(/[^0-9+]/g, '')}`}
              className="px-6 py-3.5 rounded-xl bg-white text-coral font-black text-base shadow-lg hover:bg-gray-100 transition flex items-center space-x-2"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Call {globalInfo.emergencyPhone}</span>
            </a>
            <Link
              href="/emergency"
              className="px-5 py-3.5 rounded-xl bg-dark hover:bg-dark/80 text-white font-bold text-sm transition"
            >
              Emergency Center Info
            </Link>
          </div>
        </div>
      </section>

      {/* 41. NEWSLETTER (Section 41) */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
