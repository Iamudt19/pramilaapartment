'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  Coins,
  ArrowRight,
} from 'lucide-react';

interface AiMaintenanceAssistantProps {
  title: string;
  description: string;
  onApplyTriage?: (data: { category: string; priority: string }) => void;
}

export function AiMaintenanceAssistant({
  title,
  description,
  onApplyTriage,
}: AiMaintenanceAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [triage, setTriage] = useState<any>(null);

  const handleDiagnose = async () => {
    if (!title && !description) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/maintenance-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        const data = await res.json();
        setTriage(data);
        if (onApplyTriage) {
          onApplyTriage({
            category: data.category,
            priority: data.priority,
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800">AI Fault Diagnostics & Safety Advisor</span>
        </div>

        <button
          type="button"
          onClick={handleDiagnose}
          disabled={loading || (!title && !description)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"
        >
          <Sparkles className="w-3 h-3" />
          <span>{loading ? 'Diagnosing...' : 'AI Auto-Triage'}</span>
        </button>
      </div>

      {triage && (
        <div className="space-y-3 pt-2 border-t border-slate-200 animate-fadeIn text-xs">
          {/* Priority & Category Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
              Category: {triage.category}
            </span>
            <span
              className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                triage.priority === 'EMERGENCY'
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : triage.priority === 'HIGH'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-blue-50 text-blue-800 border-blue-300'
              }`}
            >
              Priority: {triage.priority}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-600" />
              Est. Cost: ₹{triage.estimatedCostRange.min} - ₹{triage.estimatedCostRange.max}
            </span>
          </div>

          {/* Safety Instructions */}
          {triage.immediateSafetyTips && triage.immediateSafetyTips.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Immediate Resident Safety Instructions:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                {triage.immediateSafetyTips.map((tip: string, idx: number) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Technician Action Plan */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1">
            <span className="font-bold text-slate-800 block text-[11px]">
              Assigned Specialist: <span className="text-emerald-700">{triage.recommendedStaff}</span>
            </span>
            <p className="text-[11px] text-slate-600">{triage.suggestedActionPlan}</p>
          </div>
        </div>
      )}
    </div>
  );
}
