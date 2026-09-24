import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 text-xs py-6 px-4 lg:px-8 mt-auto shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-slate-900">Pramila Apartments</span>
          <span className="text-slate-300">•</span>
          <span>500m from DMCH Road, Darbhanga, Bihar</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 text-[11px]">
          <span className="flex items-center gap-1 text-slate-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 24x7 Security & Pure Living
          </span>
          <span className="text-slate-300">•</span>
          <span>Version 2.5.0-Executive</span>
        </div>
      </div>
    </footer>
  );
}
