'use client';

import React, { useEffect, useState } from 'react';
import { Building, Plus, Layers, Home, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PropertyPage() {
  const [property, setProperty] = useState<any>(null);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBuilding, setNewBuilding] = useState({ name: '', code: '', totalFloors: 4, address: '', notes: '' });

  const fetchData = async () => {
    try {
      const [propRes, bldgRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/buildings'),
      ]);
      if (propRes.ok) setProperty((await propRes.json()).property);
      if (bldgRes.ok) setBuildings((await bldgRes.json()).buildings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/buildings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBuilding),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewBuilding({ name: '', code: '', totalFloors: 4, address: '', notes: '' });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Property & Building Management</h1>
          <p className="text-xs text-slate-400 mt-1">Configure society structures, wings, and floor layouts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Add Building / Tower
        </button>
      </div>

      {/* Property Overview Card */}
      {property && (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Master Property</span>
            <h2 className="text-xl font-bold text-white">{property.name}</h2>
            <p className="text-xs text-slate-400 mt-1">{property.address}</p>
            <div className="flex items-center gap-4 text-xs text-slate-300 mt-3">
              <span>Contact: <strong>{property.contactNumber}</strong></span>
              <span>•</span>
              <span>Email: <strong>{property.managementEmail}</strong></span>
              <span>•</span>
              <span>Timezone: <strong>{property.timezone}</strong></span>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-700/60 p-4 rounded-2xl text-center min-w-[160px]">
            <span className="text-2xl font-black text-emerald-400">{buildings.length}</span>
            <span className="text-xs text-slate-400 block font-medium">Towers / Blocks</span>
          </div>
        </div>
      )}

      {/* Buildings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {buildings.map((b) => (
          <div key={b.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  {b.code}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{b.name}</h3>
                <p className="text-xs text-slate-400">{b.address || 'Pramila Apartments Campus'}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Building className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-center">
              <div>
                <span className="text-base font-bold text-white block">{b.totalFloors}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Floors</span>
              </div>
              <div>
                <span className="text-base font-bold text-emerald-400 block">{b.flats?.length || 0}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Flats</span>
              </div>
              <div>
                <span className="text-base font-bold text-cyan-400 block">{b.parkingSlots?.length || 0}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Parking</span>
              </div>
            </div>

            {/* Floors preview */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">Configured Floors</span>
              <div className="flex flex-wrap gap-1.5">
                {b.floors?.map((f: any) => (
                  <span
                    key={f.id}
                    className="text-xs bg-slate-900 border border-slate-700/60 text-slate-300 px-2.5 py-1 rounded-lg"
                  >
                    {f.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Building Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add New Tower / Building</h3>
            <form onSubmit={handleCreateBuilding} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Building Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tower C (Nakshatra)"
                  value={newBuilding.name}
                  onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. T-C"
                    value={newBuilding.code}
                    onChange={(e) => setNewBuilding({ ...newBuilding, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Total Floors *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={newBuilding.totalFloors}
                    onChange={(e) => setNewBuilding({ ...newBuilding, totalFloors: parseInt(e.target.value) || 4 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Wing Address / Description</label>
                <input
                  type="text"
                  placeholder="e.g. East Wing, Pramila Apartments"
                  value={newBuilding.address}
                  onChange={(e) => setNewBuilding({ ...newBuilding, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Create Building
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
