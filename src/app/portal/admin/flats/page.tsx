'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Plus, Search, Filter, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function FlatsPage() {
  const [flats, setFlats] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newFlat, setNewFlat] = useState({
    buildingId: '',
    floorId: '',
    flatNumber: '',
    flatType: '2BHK',
    areaSqFt: 1150,
    bedrooms: 2,
    bathrooms: 2,
    monthlyRent: 22000,
    maintenance: 2500,
    deposit: 44000,
    ownerId: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      const [flatsRes, bldgRes, ownRes] = await Promise.all([
        fetch(`/api/flats?search=${search}&status=${statusFilter}`),
        fetch('/api/buildings'),
        fetch('/api/owners'),
      ]);

      if (flatsRes.ok) setFlats((await flatsRes.json()).flats || []);
      if (bldgRes.ok) {
        const bData = (await bldgRes.json()).buildings || [];
        setBuildings(bData);
        if (bData.length > 0 && !newFlat.buildingId) {
          setNewFlat((prev) => ({
            ...prev,
            buildingId: bData[0].id,
            floorId: bData[0].floors?.[0]?.id || '',
          }));
        }
      }
      if (ownRes.ok) setOwners((await ownRes.json()).owners || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter]);

  const handleCreateFlat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/flats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFlat),
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectedBuildingFloors =
    buildings.find((b) => b.id === newFlat.buildingId)?.floors || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Flat Inventory & Units</h1>
          <p className="text-xs text-slate-400 mt-1">Manage apartments, tenancy assignments, meters, and status</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Add Flat Unit
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search flat number (e.g. A-101) or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="">All Statuses</option>
          <option value="OCCUPIED">Occupied</option>
          <option value="VACANT">Vacant</option>
          <option value="RESERVED">Reserved</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
      </div>

      {/* Flats Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Flat No</th>
              <th className="py-3 px-4">Building / Floor</th>
              <th className="py-3 px-4">Type & Area</th>
              <th className="py-3 px-4">Current Resident</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Monthly Rent</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {flats.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No flats found matching criteria.
                </td>
              </tr>
            ) : (
              flats.map((flat) => {
                const activeTenancy = flat.tenancies?.[0];
                return (
                  <tr key={flat.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {flat.flatNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{flat.building?.name}</div>
                      <div className="text-[10px] text-slate-500">{flat.floor?.name}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="font-semibold">{flat.flatType}</span>
                      <span className="text-[10px] text-slate-500 block">{flat.areaSqFt} sq.ft ({flat.bedrooms}B/{flat.bathrooms}T)</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {activeTenancy?.tenant ? (
                        <div>
                          <span className="font-semibold text-white">{activeTenancy.tenant.fullName}</span>
                          <span className="text-[10px] text-slate-400 block">{activeTenancy.tenant.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">— No Active Tenant —</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {flat.owner?.name || 'Society Owned'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {formatCurrency(flat.monthlyRent)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          flat.status === 'OCCUPIED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : flat.status === 'VACANT'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {flat.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/portal/admin/flats/${flat.id}`}
                        className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                      >
                        Overview <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Flat Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create New Flat Unit</h3>
            <form onSubmit={handleCreateFlat} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Building *</label>
                  <select
                    value={newFlat.buildingId}
                    onChange={(e) => {
                      const b = buildings.find((x) => x.id === e.target.value);
                      setNewFlat({
                        ...newFlat,
                        buildingId: e.target.value,
                        floorId: b?.floors?.[0]?.id || '',
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Floor *</label>
                  <select
                    value={newFlat.floorId}
                    onChange={(e) => setNewFlat({ ...newFlat, floorId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {selectedBuildingFloors.map((f: any) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Flat Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-302"
                    value={newFlat.flatNumber}
                    onChange={(e) => setNewFlat({ ...newFlat, flatNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Flat Type *</label>
                  <select
                    value={newFlat.flatType}
                    onChange={(e) => setNewFlat({ ...newFlat, flatType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="1BHK">1 BHK</option>
                    <option value="2BHK">2 BHK</option>
                    <option value="3BHK">3 BHK</option>
                    <option value="4BHK">4 BHK</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newFlat.monthlyRent}
                    onChange={(e) => setNewFlat({ ...newFlat, monthlyRent: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Maintenance (₹)</label>
                  <input
                    type="number"
                    value={newFlat.maintenance}
                    onChange={(e) => setNewFlat({ ...newFlat, maintenance: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Deposit (₹)</label>
                  <input
                    type="number"
                    value={newFlat.deposit}
                    onChange={(e) => setNewFlat({ ...newFlat, deposit: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Flat Owner</label>
                <select
                  value={newFlat.ownerId}
                  onChange={(e) => setNewFlat({ ...newFlat, ownerId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Society / Pramila Apartments</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.phone})
                    </option>
                  ))}
                </select>
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
                  Create Flat Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
