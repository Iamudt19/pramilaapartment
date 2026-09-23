'use client';

import React, { useEffect, useState } from 'react';
import { Users, Plus, Phone, CheckCircle2, User } from 'lucide-react';

export default function TenantFamilyPage() {
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/tenants')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tenants?.[0]) {
          setFamilyMembers(data.tenants[0].familyMembers || []);
        }
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Family & Co-Residents</h1>
          <p className="text-xs text-slate-400 mt-1">Manage registered family members permitted to enter and reside in the apartment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.length === 0 ? (
          <div className="col-span-full glass-card rounded-3xl p-8 text-center text-slate-500 text-xs">
            No additional family members registered yet.
          </div>
        ) : (
          familyMembers.map((m) => (
            <div key={m.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                  {m.name.charAt(0)}
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Approved
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{m.name}</h3>
                <span className="text-xs text-emerald-400 font-semibold">{m.relationship}</span>
                {m.phone && <p className="text-xs text-slate-400 mt-1">Phone: {m.phone}</p>}
                {m.age && <p className="text-xs text-slate-400">Age: {m.age} yrs</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
