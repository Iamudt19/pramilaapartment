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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2 shadow-sm">
            <ParkingCircle className="w-3.5 h-3.5 text-blue-600" /> RFID & Parking Allocation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Parking Slots & Resident Vehicles</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Manage parking allocations, RFID tags, and registered resident vehicles</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('slots')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'slots'
              ? 'bg-blue-700 text-white font-black shadow-md shadow-blue-700/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Parking Slots ({parkingSlots.length})
        </button>
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'vehicles'
              ? 'bg-blue-700 text-white font-black shadow-md shadow-blue-700/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Registered Vehicles ({vehicles.length})
        </button>
      </div>

      {activeTab === 'slots' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {parkingSlots.map((slot) => (
            <div key={slot.id} className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-lg text-blue-800">{slot.slotNumber}</span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    slot.status === 'ASSIGNED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  {slot.status}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>Location: <strong className="text-slate-800">{slot.areaLocation}</strong></div>
                <div>Slot Type: <strong className="text-slate-800">{slot.slotType}</strong></div>
                {slot.flat && <div>Assigned Flat: <strong className="text-blue-700">Flat {slot.flat.flatNumber}</strong></div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-extrabold">Vehicle Number</th>
                  <th className="py-3.5 px-4 font-extrabold">Type & Model</th>
                  <th className="py-3.5 px-4 font-extrabold">Flat & Resident</th>
                  <th className="py-3.5 px-4 font-extrabold">RFID Tag</th>
                  <th className="py-3.5 px-4 font-extrabold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">{v.vehicleNumber}</td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-semibold text-slate-900">{v.brandModel || 'Personal Vehicle'}</div>
                      <div className="text-[10px] text-slate-500 uppercase font-medium">{v.vehicleType}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-800">Flat {v.flat?.flatNumber}</span>
                      <span className="text-[11px] text-slate-500 block font-medium">{v.tenant?.fullName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-blue-700 font-bold">{v.rfidTagNumber || 'RFID-TAG-PA-01'}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
