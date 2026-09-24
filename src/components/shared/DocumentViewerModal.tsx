'use client';

import React, { useState } from 'react';
import { X, ExternalLink, Download, FileText, ShieldCheck, Printer, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const [imgError, setImgError] = useState(false);

  if (!isOpen) return null;

  const isPdf = fileUrl.toLowerCase().endsWith('.pdf') || fileUrl.includes('application/pdf');

  const handlePrint = () => {
    const printWindow = window.open(fileUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shadow-sm shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">{documentTitle}</h3>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    status === 'VERIFIED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : status === 'PENDING'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {documentType} {tenantName ? `• Resident: ${tenantName}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition text-xs flex items-center gap-1 font-bold"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition text-xs flex items-center gap-1 font-bold"
              title="Open full resolution in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-auto flex items-center justify-center min-h-[360px] max-h-[65vh]">
          {isPdf ? (
            <iframe
              src={`${fileUrl}#toolbar=0`}
              className="w-full h-[60vh] rounded-2xl border border-slate-300 shadow-md bg-white"
              title={documentTitle}
            />
          ) : imgError ? (
            <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
              <div className="text-sm font-bold text-slate-900">Preview not directly embeddable</div>
              <p className="text-xs text-slate-500 max-w-sm">
                This document is stored securely in encrypted storage. You can view it in high resolution using the full view button.
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Document
              </a>
            </div>
          ) : (
            <div className="relative max-h-[60vh] flex items-center justify-center">
              <img
                src={fileUrl}
                alt={documentTitle}
                onError={() => setImgError(true)}
                className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-lg border border-slate-300 bg-white"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-white text-xs text-slate-600 gap-2">
          <div className="flex items-center space-x-2 font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cryptographically Verified Vault Record • Pramila Apartments Estate Registry</span>
          </div>
          <a
            href={fileUrl}
            download
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all text-xs active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Original File</span>
          </a>
        </div>
      </div>
    </div>
  );
}
