'use client';

import React, { useState } from 'react';
import { ScanLine, X, CheckCircle2, AlertOctagon, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function QrScannerModal({ isOpen, onClose, onSuccess }: QrScannerModalProps) {
  const [passCodeInput, setPassCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || passCodeInput;
    if (!code) return;

    try {
      setLoading(true);
      setError(null);
      setScanResult(null);

      const res = await fetch('/api/visitors/verify-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passCode: code.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setScanResult(data.data);
      } else {
        setError(data.error?.message || 'Invalid or expired visitor pass code');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!scanResult?.requestId) return;

    try {
      setLoading(true);
      const res = await fetch('/api/visitors/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: scanResult.requestId,
          gateNumber: 'Main Gate 1',
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error?.message || 'Failed to record check-in');
      }
    } catch (err: any) {
      setError(err.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const demoCodes = ['PR-PASS-DEMO101', 'PR-PASS-INSIDE01'];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ScanLine className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Security Gate Scanner</h3>
            <p className="text-xs text-slate-400">Verify digital pass or scan QR token</p>
          </div>
        </div>

        {/* Scanner Simulation Viewfinder */}
        <div className="relative bg-slate-950 border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center mb-5 overflow-hidden">
          <div className="w-40 h-40 mx-auto border-2 border-emerald-500/50 rounded-2xl relative flex items-center justify-center">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
            <ScanLine className="w-12 h-12 text-emerald-400/60 animate-bounce" />
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-medium">Position QR code inside the frame or enter pass token</p>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Quick Demo:</span>
            {demoCodes.map((code) => (
              <button
                key={code}
                onClick={() => {
                  setPassCodeInput(code);
                  handleVerify(code);
                }}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono px-2 py-1 rounded border border-slate-700"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Input Field */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter pass code (e.g. PR-PASS-DEMO101)"
            value={passCodeInput}
            onChange={(e) => setPassCodeInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleVerify()}
            disabled={loading || !passCodeInput}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2 mb-4">
            <AlertOctagon className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Verified Result Card */}
        {scanResult && (
          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-sm">{scanResult.visitorName}</span>
                <span className="text-xs text-slate-400">({scanResult.relationship})</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  scanResult.statusValidity === 'VALID'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {scanResult.statusValidity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4">
              <div>
                <span className="text-slate-500 text-[10px] block">Destination</span>
                <span className="font-bold text-white">Flat {scanResult.flatNumber}</span>
                <span className="text-slate-400 text-[11px] block">{scanResult.tenantName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Purpose</span>
                <span>{scanResult.purpose}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Phone Number</span>
                <span>{scanResult.visitorPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Valid Until</span>
                <span className="font-medium text-amber-300">{formatDateTime(scanResult.validUntil)}</span>
              </div>
            </div>

            {scanResult.statusValidity === 'VALID' && !scanResult.isCheckedIn && (
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" /> Grant Gate Entry & Check In
              </button>
            )}

            {scanResult.isCheckedIn && (
              <div className="text-center text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20 font-semibold">
                Visitor is already Checked In inside the premises.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
