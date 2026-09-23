'use client';

import React from 'react';
import { X, ExternalLink, Download, FileText, ShieldCheck } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentType: string;
  fileUrl: string;
  tenantName?: string;
  status?: string;
}

export function DocumentViewerModal({
  isOpen,
  onClose,
  documentTitle,
  documentType,
  fileUrl,
  tenantName,
  status = 'VERIFIED',
}: DocumentViewerModalProps) {
  if (!isOpen) return null;

  const isPdf = fileUrl.toLowerCase().endsWith('.pdf') || fileUrl.includes('application/pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 glass-header">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{documentTitle}</h3>
              <p className="text-xs text-slate-400">
                {documentType} {tenantName ? `• Tenant: ${tenantName}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition text-xs flex items-center space-x-1"
              title="Open full resolution in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 bg-slate-950 p-4 overflow-auto flex items-center justify-center min-h-[400px]">
          {isPdf ? (
            <iframe
              src={`${fileUrl}#toolbar=0`}
              className="w-full h-[65vh] rounded-xl border border-slate-800"
              title={documentTitle}
            />
          ) : (
            <div className="relative max-h-[65vh] flex items-center justify-center">
              <img
                src={fileUrl}
                alt={documentTitle}
                className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-lg border border-slate-800"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-900/90 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Encrypted Supabase Storage • Protected under Pramila Apartments Security Policy</span>
          </div>
          <a
            href={fileUrl}
            download
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );
}
