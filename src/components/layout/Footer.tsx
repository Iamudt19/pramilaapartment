import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-black text-neutral-400 text-xs py-6 px-4 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-white" />
          <span className="font-bold text-white">Pramila Apartments</span>
          <span className="text-neutral-600">•</span>
          <span>500m from DMCH Road, Darbhanga, Bihar</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-400 text-[11px]">
          <span className="flex items-center gap-1 text-white">
            <ShieldCheck className="w-3.5 h-3.5" /> 24x7 Security & Pure Living
          </span>
          <span>•</span>
          <span>Version 2.5.0-Executive</span>
        </div>
      </div>
    </footer>
  );
}
