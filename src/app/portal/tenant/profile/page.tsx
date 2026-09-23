'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FolderLock, ShieldCheck, User, Phone, Mail, Upload, Plus, FileText, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { FileUploadZone } from '@/components/shared/FileUploadZone';

export default function TenantProfilePage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [newDoc, setNewDoc] = useState({
    documentType: 'RENTAL_AGREEMENT',
    title: 'Notarized Rental Agreement',
    fileUrl: '',
  });

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) setDocuments((await res.json()).documents || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.fileUrl) {
      alert('Please upload a document file or photo first.');
      return;
    }
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc),
      });
      if (res.ok) {
        setShowUploadModal(false);
        setNewDoc({
          documentType: 'RENTAL_AGREEMENT',
          title: 'Notarized Rental Agreement',
          fileUrl: '',
        });
        fetchDocs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Resident Profile & Verification Vault</h1>
        <p className="text-xs text-slate-400 mt-1">Manage verified identity credentials, rental agreements, and contact details</p>
      </div>

      {/* Profile Card with Photo */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center font-bold text-white text-2xl shadow-lg overflow-hidden shrink-0 border-2 border-emerald-500/30">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'R'
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Verified Resident
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Flat {user?.flatNumber || 'A-101'} • {user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Assigned Flat</span>
            <span className="font-bold text-emerald-400 text-sm">Flat {user?.flatNumber || 'A-101'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Building Tower</span>
            <span className="font-bold text-white">{user?.buildingName || 'Tower A (Surya)'}</span>
          </div>
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base">Identity & Verification Documents</h3>
            <p className="text-xs text-slate-400">Secure private vault with end-to-end access control</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Upload Document / ID
          </button>
        </div>

        <div className="space-y-3">
          {documents.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No documents uploaded yet.</p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden text-emerald-400">
                    {doc.fileUrl?.match(/\.(jpg|jpeg|png|webp|gif)/i) || doc.fileUrl?.includes('/uploads/') ? (
                      <img src={doc.fileUrl} alt={doc.title} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0 truncate">
                    <span className="font-bold text-white block truncate">{doc.title}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {doc.documentType} • Uploaded {formatDate(doc.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg transition"
                    >
                      View
                    </a>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'VERIFIED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Modal with FileUploadZone */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Upload Document to Secure Vault</h3>
            <form onSubmit={handleUploadDoc} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Document Type *</label>
                <select
                  value={newDoc.documentType}
                  onChange={(e) => {
                    const dt = e.target.value;
                    setNewDoc({ ...newDoc, documentType: dt, title: `${dt} Document` });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="RENTAL_AGREEMENT">Rental Agreement Copy</option>
                  <option value="AADHAAR">Aadhaar Card Photo/Scan</option>
                  <option value="PAN">PAN Card Photo/Scan</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="POLICE_VERIFICATION">Police Verification Certificate</option>
                  <option value="VEHICLE_RC">Vehicle Registration Certificate (RC)</option>
                  <option value="OTHER">Other Proof Document</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Registered Lease Agreement 2026"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <FileUploadZone
                  label="Upload Document Photo or File"
                  category="DOCUMENTS"
                  mode="document"
                  value={newDoc.fileUrl}
                  helperText="Upload JPG, PNG, WEBP, or PDF (Max 10MB)"
                  onUploadSuccess={(fileData) =>
                    setNewDoc((prev) => ({
                      ...prev,
                      fileUrl: fileData.url,
                      title: prev.title || fileData.fileName,
                    }))
                  }
                  onRemove={() => setNewDoc((prev) => ({ ...prev, fileUrl: '' }))}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newDoc.fileUrl}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

