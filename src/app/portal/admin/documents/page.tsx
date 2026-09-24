'use client';

import React, { useEffect, useState } from 'react';
import {
  FolderLock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Eye,
  ExternalLink,
  Search,
  Filter,
  FileText,
  User,
  Sparkles,
  Building,
  Check,
  X,
  Clock,
  Download,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { DocumentViewerModal } from '@/components/shared/DocumentViewerModal';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) setDocuments((await res.json()).documents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleVerify = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      setVerifyingId(id);
      const res = await fetch(`/api/documents/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchDocs();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifyingId(null);
    }
  };

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      !search ||
      doc.title?.toLowerCase().includes(search.toLowerCase()) ||
      doc.documentType?.toLowerCase().includes(search.toLowerCase()) ||
      doc.tenant?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      doc.tenant?.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      doc.tenant?.tenancies?.[0]?.flat?.flatNumber?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || doc.documentType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingCount = documents.filter((d) => d.status === 'PENDING').length;
  const verifiedCount = documents.filter((d) => d.status === 'VERIFIED').length;
  const rejectedCount = documents.filter((d) => d.status === 'REJECTED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Identity & Verification Vault
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Secure Documents Vault</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Review resident identity proofs (Aadhaar, PAN), rental agreements, and police verifications with 1-click inspection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
            <FolderLock className="w-5 h-5 text-blue-600" />
            <div>
              <span className="text-lg font-black text-slate-900 block leading-tight">{documents.length}</span>
              <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Total Vault Files</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm ${
            statusFilter === 'ALL'
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] text-slate-500 uppercase font-extrabold block">All Documents</span>
          <span className="text-xl font-black text-slate-900">{documents.length} Files</span>
        </button>

        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm ${
            statusFilter === 'PENDING'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-700 uppercase font-extrabold block">Pending Review</span>
            {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>}
          </div>
          <span className="text-xl font-black text-amber-900">{pendingCount} Action Needed</span>
        </button>

        <button
          onClick={() => setStatusFilter('VERIFIED')}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm ${
            statusFilter === 'VERIFIED'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] text-emerald-700 uppercase font-extrabold block">Verified & Approved</span>
          <span className="text-xl font-black text-emerald-900">{verifiedCount} Files</span>
        </button>

        <button
          onClick={() => setStatusFilter('REJECTED')}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm ${
            statusFilter === 'REJECTED'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] text-rose-700 uppercase font-extrabold block">Declined / Resubmit</span>
          <span className="text-xl font-black text-rose-900">{rejectedCount} Files</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by tenant name, document title, flat number (e.g. A-101)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-bold shadow-sm"
        >
          <option value="ALL">All Document Types</option>
          <option value="AADHAAR">🪪 Aadhaar Card</option>
          <option value="RENTAL_AGREEMENT">📄 Rental Agreement</option>
          <option value="POLICE_VERIFICATION">🛡️ Police Verification</option>
          <option value="PAN_CARD">💳 PAN Card</option>
          <option value="OTHER">📁 Other Documents</option>
        </select>
      </div>

      {/* Documents Vault Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-extrabold">Preview & Title</th>
                <th className="py-3.5 px-4 font-extrabold">Resident Details</th>
                <th className="py-3.5 px-4 font-extrabold">Document Type</th>
                <th className="py-3.5 px-4 font-extrabold">Uploaded On</th>
                <th className="py-3.5 px-4 font-extrabold">Status</th>
                <th className="py-3.5 px-4 font-extrabold text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500 font-semibold">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading vault documents...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <FolderLock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-800">No documents found matching the filter.</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting the search or filter pills.</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const isImage = doc.fileUrl && (doc.fileUrl.startsWith('http') || doc.fileUrl.startsWith('/'));
                  const avatarUrl = doc.tenant?.user?.avatarUrl;
                  const tenantInitials = (doc.tenant?.fullName || 'Resident')
                    .split(' ')
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr key={doc.id} className="hover:bg-blue-50/40 transition-colors">
                      {/* Document Preview & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedDoc(doc)}
                            className="relative w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0 group flex items-center justify-center hover:border-blue-500 shadow-sm"
                            title="Click to zoom document"
                          >
                            {isImage ? (
                              <img
                                src={doc.fileUrl}
                                alt={doc.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                            )}
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                          </button>

                          <div>
                            <button
                              onClick={() => setSelectedDoc(doc)}
                              className="font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5 transition text-left leading-tight"
                            >
                              {doc.title || doc.documentType}
                            </button>
                            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                              ID: {doc.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Resident Info & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={doc.tenant?.fullName || 'Resident'}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-black text-[11px] flex items-center justify-center border border-blue-200 shrink-0">
                              {tenantInitials}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {doc.tenant?.fullName || 'Resident'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              Flat {doc.tenant?.tenancies?.[0]?.flat?.flatNumber || 'N/A'} • {doc.tenant?.phone || 'No phone'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Document Type Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-bold">
                          <FileText className="w-3 h-3 text-blue-600" />
                          {doc.documentType?.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Upload Date */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {formatDate(doc.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${
                            doc.status === 'VERIFIED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : doc.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              doc.status === 'VERIFIED'
                                ? 'bg-emerald-500'
                                : doc.status === 'PENDING'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          ></span>
                          {doc.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDoc(doc)}
                            className="px-3 py-1.5 bg-slate-100 text-slate-800 font-bold rounded-xl text-xs hover:bg-slate-200 flex items-center gap-1 border border-slate-200 transition-all shadow-sm"
                            title="Inspect Document"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" /> Inspect
                          </button>

                          {doc.status === 'PENDING' && (
                            <>
                              <button
                                disabled={verifyingId === doc.id}
                                onClick={() => handleVerify(doc.id, 'VERIFIED')}
                                className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-500 shadow-sm transition-all flex items-center gap-1 disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5" /> Verify
                              </button>
                              <button
                                disabled={verifyingId === doc.id}
                                onClick={() => handleVerify(doc.id, 'REJECTED')}
                                className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all flex items-center gap-1 disabled:opacity-50"
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <DocumentViewerModal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          documentTitle={selectedDoc.title}
          documentType={selectedDoc.documentType}
          fileUrl={selectedDoc.fileUrl}
          tenantName={selectedDoc.tenant?.fullName}
          status={selectedDoc.status}
        />
      )}
    </div>
  );
}
