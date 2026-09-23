'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ScanLine, CheckCircle2, AlertOctagon, UserCheck } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function SecurityScanPage() {
  const [passCodeInput, setPassCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || passCodeInput;
    if (!code) return;

    try {
      setLoading(true);
      setError(null);
      setScanResult(null);
      setCheckInSuccess(false);

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
        setCheckInSuccess(true);
        setScanResult((prev: any) => ({ ...prev, isCheckedIn: true, status: 'CHECKED_IN' }));
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
    <div className="max-w-xl mx-auto space-y-6">
      <Link
        href="/portal/security"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Gate Operations
      </Link>

      <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-700 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Security QR Pass Scanner</h1>
            <p className="text-xs text-slate-400">Scan visitor digital pass QR or enter verification token</p>
          </div>
        </div>

        {/* Viewfinder simulation */}
        <div className="bg-slate-950 border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center mb-5 relative overflow-hidden">
          <div className="w-44 h-44 mx-auto border-2 border-emerald-500/50 rounded-2xl relative flex items-center justify-center">
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-emerald-400"></div>
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-emerald-400"></div>
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-emerald-400"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-emerald-400"></div>
            <ScanLine className="w-14 h-14 text-emerald-400/60 animate-bounce" />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Quick Demo:</span>
            {demoCodes.map((code) => (
              <button
                key={code}
                onClick={() => {
                  setPassCodeInput(code);
                  handleVerify(code);
                }}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 text-emerald-400 font-mono px-2.5 py-1 rounded border border-slate-700"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter pass code (e.g. PR-PASS-DEMO101)"
            value={passCodeInput}
            onChange={(e) => setPassCodeInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleVerify()}
            disabled={loading || !passCodeInput}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-3.5 rounded-xl text-xs flex items-center gap-2 mb-4">
            <AlertOctagon className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {scanResult && (
          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5 animate-in fade-in duration-150 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-base">{scanResult.visitorName}</span>
                <span className="text-xs text-slate-400">({scanResult.relationship})</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {scanResult.statusValidity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 text-[10px] block">Destination</span>
                <span className="font-bold text-white text-sm">Flat {scanResult.flatNumber}</span>
                <span className="text-slate-400 text-[11px] block">{scanResult.tenantName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Purpose</span>
                <span>{scanResult.purpose}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Phone</span>
                <span>{scanResult.visitorPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Valid Until</span>
                <span className="font-semibold text-amber-300">{formatDateTime(scanResult.validUntil)}</span>
              </div>
            </div>

            {scanResult.statusValidity === 'VALID' && !scanResult.isCheckedIn && (
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <UserCheck className="w-4 h-4" /> Grant Gate Entry & Check In
              </button>
            )}

            {checkInSuccess && (
              <div className="text-center text-xs text-emerald-300 bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/30 font-semibold">
                Gate Entry Logged Successfully. Visitor is now inside premises.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
