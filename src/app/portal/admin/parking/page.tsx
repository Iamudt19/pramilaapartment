'use client';

import React, { useEffect, useState } from 'react';
import { ParkingCircle, Car, Plus, CheckCircle2 } from 'lucide-react';

export default function AdminParkingPage() {
  const [parkingSlots, setParkingSlots] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'slots' | 'vehicles'>('slots');

  const fetchData = async () => {
    try {
      const [parkRes, vehRes] = await Promise.all([
        fetch('/api/parking'),
        fetch('/api/vehicles'),
      ]);
      if (parkRes.ok) setParkingSlots((await parkRes.json()).parkingSlots || []);
      if (vehRes.ok) setVehicles((await vehRes.json()).vehicles || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Parking Slots & Resident Vehicles</h1>
          <p className="text-xs text-slate-400 mt-1">Manage parking allocations, RFID tags, and registered resident vehicles</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('slots')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'slots'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Parking Slots ({parkingSlots.length})
        </button>
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'vehicles'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Registered Vehicles ({vehicles.length})
        </button>
      </div>

      {activeTab === 'slots' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {parkingSlots.map((slot) => (
            <div key={slot.id} className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-base text-emerald-400">{slot.slotNumber}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    slot.status === 'ASSIGNED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {slot.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div>Location: <strong className="text-slate-200">{slot.areaLocation}</strong></div>
                <div>Slot Type: <strong className="text-slate-200">{slot.slotType}</strong></div>
                {slot.flat && <div>Assigned Flat: <strong className="text-emerald-400">Flat {slot.flat.flatNumber}</strong></div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Vehicle Number</th>
                <th className="py-3 px-4">Type & Model</th>
                <th className="py-3 px-4">Flat & Resident</th>
                <th className="py-3 px-4">RFID Tag</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-white text-sm">{v.vehicleNumber}</td>
                  <td className="py-3 px-4 text-slate-300">
                    <div>{v.brandModel || 'Personal Vehicle'}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{v.vehicleType}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-emerald-400">Flat {v.flat?.flatNumber}</span>
                    <span className="text-[10px] text-slate-400 block">{v.tenant?.fullName}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-cyan-400">{v.rfidTagNumber || 'RFID-TAG-PA-01'}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
