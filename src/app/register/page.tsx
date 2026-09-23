'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, UserPlus, CheckCircle2, AlertCircle, ArrowRight, Upload, Shield, FileText, Camera } from 'lucide-react';
import { FileUploadZone } from '@/components/shared/FileUploadZone';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    avatarUrl: '',
    permanentAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    occupation: '',
    companyName: '',
    governmentIdType: 'AADHAAR',
    governmentIdNumber: '',
    documentTitle: 'Aadhaar Card Copy',
    documentUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message);
      } else {
        setError(data.error?.message || 'Failed to submit registration application');
      }
    } catch (err: any) {
      setError(err.message || 'Submission error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="glass-card rounded-3xl p-8 border border-slate-700/80 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center mx-auto text-white shadow-lg mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Tenant Registration Application</h2>
          <p className="text-xs text-slate-400 mt-1">Pramila Apartments Resident Onboarding & Verification</p>
        </div>

        {successMessage ? (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Application Submitted Successfully!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">{successMessage}</p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-emerald-400 transition-all"
              >
                Proceed to Login <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Personal Info & Person Photo */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> 1. Personal & Contact Information
              </h4>

              {/* Photo of Person */}
              <div className="mb-4">
                <FileUploadZone
                  label="Resident / Person Photo (Selfie)"
                  category="AVATARS"
                  mode="avatar"
                  value={formData.avatarUrl}
                  helperText="Upload a clear face photo or selfie for resident ID & gate access"
                  onUploadSuccess={(fileData) => setFormData((prev) => ({ ...prev, avatarUrl: fileData.url }))}
                  onRemove={() => setFormData((prev) => ({ ...prev, avatarUrl: '' }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Ramesh Chandra"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="+91 98765 00000"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="ramesh@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Create Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Verification & Doc Pic */}
            <div className="border-t border-slate-800 pt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> 2. Identification & Document Verification
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Government ID Type *</label>
                  <select
                    value={formData.governmentIdType}
                    onChange={(e) => {
                      const idType = e.target.value;
                      setFormData({
                        ...formData,
                        governmentIdType: idType,
                        documentTitle: `${idType} Proof Document`,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="AADHAAR">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVING_LICENSE">Driving License</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">ID Proof Number</label>
                  <input
                    type="text"
                    value={formData.governmentIdNumber}
                    onChange={(e) => setFormData({ ...formData, governmentIdNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 5421 9876 1234"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Employer / Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. TechCorp India"
                  />
                </div>
              </div>

              {/* Upload Document Pic / ID Proof */}
              <div className="pt-2">
                <FileUploadZone
                  label={`Upload ${formData.governmentIdType} Proof / Document Photo`}
                  category="DOCUMENTS"
                  mode="document"
                  value={formData.documentUrl}
                  helperText="Upload Aadhaar / PAN / Passport photo or scan (PNG, JPG, PDF)"
                  onUploadSuccess={(fileData) =>
                    setFormData((prev) => ({
                      ...prev,
                      documentUrl: fileData.url,
                      documentTitle: `${prev.governmentIdType} Proof - ${fileData.fileName}`,
                    }))
                  }
                  onRemove={() => setFormData((prev) => ({ ...prev, documentUrl: '' }))}
                />
              </div>
            </div>

            {/* Section 3: Emergency Contact & Permanent Address */}
            <div className="border-t border-slate-800 pt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                3. Address & Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">Permanent Residential Address</label>
                  <input
                    type="text"
                    value={formData.permanentAddress}
                    onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="House / Street / City / State / Pin code"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Emergency Contact Person</label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Parent / Guardian Name"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="+91 98765 00000"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold py-3.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? 'Submitting Application...' : 'Submit Application to Estate Management'}{' '}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

