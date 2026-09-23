'use client';

import React, { useEffect, useState } from 'react';
import { Car, Search, CheckCircle2 } from 'lucide-react';

export default function SecurityVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setVehicles(data.vehicles || []);
      });
  }, []);

  const filtered = vehicles.filter(
    (v) =>
      v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.flat?.flatNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Gate Vehicle Verification Registry</h1>
        <p className="text-xs text-slate-400 mt-1">Verify resident cars, 2-wheelers, and RFID tags for fast barrier clearance</p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search vehicle number (e.g. UP 70 BK 1234)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
        />
      </div>

      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Vehicle Number</th>
              <th className="py-3 px-4">Type & Make</th>
              <th className="py-3 px-4">Allocated Flat</th>
              <th className="py-3 px-4">Resident Owner</th>
              <th className="py-3 px-4">Gate Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3 px-4 font-bold text-white text-sm">{v.vehicleNumber}</td>
                <td className="py-3 px-4 font-sans text-slate-300">
                  <div>{v.brandModel || 'Personal Vehicle'}</div>
                  <span className="text-[10px] text-slate-500 uppercase">{v.vehicleType}</span>
                </td>
                <td className="py-3 px-4 font-bold text-emerald-400 font-mono">Flat {v.flat?.flatNumber}</td>
                <td className="py-3 px-4 font-sans text-slate-300">{v.tenant?.fullName}</td>
                <td className="py-3 px-4">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    AUTHORIZED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
