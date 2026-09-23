import React from 'react';
import { Building2, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 text-slate-400 text-xs py-6 px-4 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200">Pramila Apartments</span>
          <span className="text-slate-500">•</span>
          <span>Residential Society Management System</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> ISO 27001 Security Standard
          </span>
          <span>•</span>
          <span>Prayagraj, Uttar Pradesh</span>
          <span>•</span>
          <span>Version 2.4.0-Production</span>
        </div>
      </div>
    </footer>
  );
}
