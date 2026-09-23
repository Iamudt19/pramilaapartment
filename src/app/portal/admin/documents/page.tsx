'use client';

import React, { useEffect, useState } from 'react';
import { FolderLock, CheckCircle2, XCircle, ShieldCheck, Eye, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      const res = await fetch(`/api/documents/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchDocs();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Secure Documents Vault</h1>
          <p className="text-xs text-slate-400 mt-1">Tenant identity verification, rental agreements, and police verifications</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Document Title & Type</th>
              <th className="py-3 px-4">Resident & Flat</th>
              <th className="py-3 px-4">Upload Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Verified By</th>
              <th className="py-3 px-4 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No uploaded resident documents found.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <FolderLock className="w-4 h-4 text-emerald-400" /> {doc.title}
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase">{doc.documentType}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-200 block">{doc.tenant?.fullName}</span>
                    <span className="text-[10px] text-slate-500">Flat {doc.tenant?.tenancies?.[0]?.flat?.flatNumber || 'N/A'}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                    {formatDate(doc.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.status === 'VERIFIED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : doc.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-xs">
                    {doc.verifiedBy || 'Pending'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {doc.status === 'PENDING' ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleVerify(doc.id, 'VERIFIED')}
                          className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px] hover:bg-emerald-400"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleVerify(doc.id, 'REJECTED')}
                          className="px-2.5 py-1 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg text-[11px] hover:bg-rose-900"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
