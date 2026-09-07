'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, AlertCircle, Send } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  salaryRange: string | null;
  experienceRequired: string;
  deadline: string;
  description: string;
  requirements: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/careers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setJobs(data);
      })
      .catch(() => {});
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setSubmitting(true);
    try {
      await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobPostingId: selectedJob.id,
          name,
          email,
          phone,
          coverLetter,
        }),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSelectedJob(null);
        setSubmitted(false);
        setName('');
        setEmail('');
        setPhone('');
        setCoverLetter('');
      }, 2500);
    } catch (error) {
      alert('Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-text-secondary mb-3">
          <Link href="/" className="hover:text-primary transition">Medical Press</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-dark font-bold">Careers</span>
        </nav>

        <div className="border-b border-gray-200/80 pb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Join Our Medical Family</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Careers at MedicalPress
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-2xl">
            Build your medical career with world-class surgical faculties, robotic technology suites, and competitive healthcare benefits.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-soft flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-primary uppercase">{job.department}</span>
                <h2 className="text-lg font-bold text-dark mt-1">{job.title}</h2>
                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{job.employmentType} • Exp: {job.experienceRequired}</span>
                  </div>
                  {job.salaryRange && (
                    <div className="text-emerald-700 font-bold">
                      Salary: {job.salaryRange}
                    </div>
                  )}
                </div>

                <p className="mt-4 text-xs text-text-secondary line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Deadline: {job.deadline}</span>
                <button
                  onClick={() => setSelectedJob(job)}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div>
              <span className="text-xs text-primary font-bold">{selectedJob.department}</span>
              <h2 className="text-xl font-black text-dark">Apply: {selectedJob.title}</h2>
            </div>

            {submitted ? (
              <div className="py-8 text-center text-emerald-700 font-bold text-sm">
                Application successfully submitted! Our Human Resources medical recruitment team will review your credentials.
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-dark mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-dark mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-dark mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-dark mb-1">Brief Cover Letter / Relevant Clinical Experience</label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Mention previous hospitals, license numbers, and specialties..."
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-dark focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
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
