'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  UserX,
  CheckCircle2,
} from 'lucide-react';

export function AiVisitorSecurityWidget() {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ai/visitor-insights');
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading && !insights) {
    return (
      <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
        <span>AI Auditing Gate Security & Active Visitors...</span>
      </div>
    );
  }

  if (!insights) return null;

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    EXCELLENT: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    STABLE: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
    ATTENTION_REQUIRED: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    HIGH_RISK: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  };

  const badge = statusColors[insights.securityStatus] || statusColors.EXCELLENT;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
      {/* Top Score Bar */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 text-sm">AI Gate Security & Visitor Audit</h3>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                Live Scan
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Automated pattern analysis for visitor overstays, unverified late entries, and perimeter safety.
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-black text-slate-900 font-mono">
            {insights.securityHealthScore}/100
          </div>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
            {insights.securityStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center text-xs">
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
          <span className="text-slate-500 text-[10px] font-bold block">Visitors Inside</span>
          <span className="text-base font-black text-slate-900">{insights.activeInsideCount}</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
          <span className="text-slate-500 text-[10px] font-bold block">Flagged Anomalies</span>
          <span className="text-base font-black text-amber-600">{insights.flaggedCount}</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
          <span className="text-slate-500 text-[10px] font-bold block">Gate Status</span>
          <span className="text-xs font-black text-emerald-700">All Passes Verified</span>
        </div>
      </div>

      {/* Anomaly Alerts List */}
      {insights.alerts && insights.alerts.length > 0 ? (
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Active Security Flags:
          </span>
          {insights.alerts.map((a: any) => (
            <div
              key={a.id}
              className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{a.visitorName} (Flat {a.flatNumber})</span>
                </div>
                <p className="text-[11px] text-amber-900">{a.message}</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-1">Action: {a.actionRequired}</p>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 shrink-0">
                {a.type}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Zero security anomalies detected. All current visitors checked in with valid resident QR passes.</span>
        </div>
      )}
    </div>
  );
}
