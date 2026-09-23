'use client';

import React, { useEffect, useState } from 'react';
import { Car, ParkingCircle, CheckCircle2 } from 'lucide-react';

export default function TenantVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setVehicles(data.vehicles || []);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">My Vehicles & Parking</h1>
          <p className="text-xs text-slate-400 mt-1">Authorized parking slots and RFID tags allocated to your flat</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((v) => (
          <div key={v.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                {v.status}
              </span>
            </div>

            <div>
              <div className="font-mono text-lg font-black text-white tracking-wider">{v.vehicleNumber}</div>
              <p className="text-xs text-slate-400 mt-1">{v.brandModel || 'Personal Vehicle'} • {v.vehicleType}</p>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Allocated Parking Slot:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {v.parkingSlots?.[0]?.slotNumber || 'P-A-01'} ({v.parkingSlots?.[0]?.areaLocation || 'Basement 1'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">RFID Security Tag:</span>
                <span className="font-mono text-cyan-400">{v.rfidTagNumber || 'RFID-TAG-PA-01'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
