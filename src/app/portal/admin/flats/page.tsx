'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Home,
  Plus,
  Search,
  Filter,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Globe,
  Tag,
  DollarSign,
  Building,
  Edit,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function FlatsPage() {
  const [flats, setFlats] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFlat, setEditingFlat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

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
    notes: 'Sunlit road-facing balcony, 24x7 water line, individual electric sub-meter.',
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
        setActionSuccess('Flat unit created successfully and added to inventory!');
        setTimeout(() => setActionSuccess(null), 3000);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleVacancy = async (flatId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'VACANT' ? 'OCCUPIED' : 'VACANT';
    try {
      const res = await fetch(`/api/flats/${flatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setActionSuccess(
          newStatus === 'VACANT'
            ? 'Flat is now listed as VACANT on website for prospective tenants!'
            : 'Flat marked as OCCUPIED.'
        );
        setTimeout(() => setActionSuccess(null), 3000);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateFlat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlat) return;

    try {
      const res = await fetch(`/api/flats/${editingFlat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFlat),
      });
      if (res.ok) {
        setEditingFlat(null);
        setActionSuccess('Flat vacancy details & pricing updated successfully!');
        setTimeout(() => setActionSuccess(null), 3000);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const vacantCount = flats.filter((f) => f.status === 'VACANT').length;
  const occupiedCount = flats.filter((f) => f.status === 'OCCUPIED').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-1 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-emerald-600" /> Real-Time Website Vacancy Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Flat Inventory & Vacancy Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish vacant flats to the public website, manage monthly rent & deposits, and track occupied leases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#suites"
            target="_blank"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs flex items-center gap-1.5 border border-slate-300 transition-all shadow-sm"
          >
            <Globe className="w-4 h-4 text-emerald-600" /> View Public Vacancies →
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Flat
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-extrabold block">Total Units</span>
          <span className="text-xl font-black text-slate-900">{flats.length} Flats</span>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <span className="text-[10px] text-emerald-700 uppercase font-extrabold block">Listed Vacancies</span>
          <span className="text-xl font-black text-emerald-800">{vacantCount} Vacant (Live)</span>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-sm">
          <span className="text-[10px] text-blue-700 uppercase font-extrabold block">Active Tenancies</span>
          <span className="text-xl font-black text-blue-800">{occupiedCount} Occupied</span>
        </div>
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm">
          <span className="text-[10px] text-amber-700 uppercase font-extrabold block">Occupancy Rate</span>
          <span className="text-xl font-black text-amber-800">
            {flats.length > 0 ? Math.round((occupiedCount / flats.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search flat number (e.g. A-101), BHK type, or tenant name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 font-bold shadow-sm"
        >
          <option value="">All Inventory Statuses</option>
          <option value="VACANT">🟢 Vacant (Listed on Website)</option>
          <option value="OCCUPIED">🔵 Occupied (Active Tenant)</option>
          <option value="RESERVED">🟡 Reserved</option>
          <option value="MAINTENANCE">🔴 Under Maintenance</option>
        </select>
      </div>

      {/* Flats Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">Flat Number</th>
              <th className="py-3.5 px-4">Type & Layout</th>
              <th className="py-3.5 px-4">Monthly Rent & Deposit</th>
              <th className="py-3.5 px-4">Live Website Status</th>
              <th className="py-3.5 px-4">Current Resident</th>
              <th className="py-3.5 px-4 text-right">Vacancy Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {flats.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No flats found matching your search.
                </td>
              </tr>
            ) : (
              flats.map((flat) => {
                const activeTenant = flat.tenancies?.[0]?.tenant;
                const isVacant = flat.status === 'VACANT';

                return (
                  <tr key={flat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-emerald-700 flex items-center justify-center font-black border border-slate-200">
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-mono font-black text-slate-900 text-sm block">
                            Flat {flat.flatNumber}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {flat.building?.name} • Floor {flat.floor?.floorNumber ?? '1'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">{flat.flatType} Residence</span>
                      <span className="text-[10px] text-slate-500">
                        {flat.bedrooms} Bed • {flat.bathrooms} Bath • {flat.areaSqFt} sq.ft
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-slate-900 block">{formatCurrency(flat.monthlyRent)}/mo</span>
                      <span className="text-[10px] text-slate-500">Deposit: {formatCurrency(flat.deposit)}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleVacancy(flat.id, flat.status)}
                        className={`text-[10px] font-extrabold px-3 py-1 rounded-full border transition-all inline-flex items-center gap-1 shadow-sm ${
                          isVacant
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                            : flat.status === 'OCCUPIED'
                            ? 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                        title="Click to toggle vacancy status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isVacant ? 'bg-emerald-600 animate-ping' : 'bg-blue-600'}`}></span>
                        {isVacant ? 'Listed as Vacant' : flat.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      {activeTenant ? (
                        <div className="flex items-center gap-2.5">
                          {activeTenant.user?.avatarUrl ? (
                            <img
                              src={activeTenant.user.avatarUrl}
                              alt={activeTenant.fullName}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-black text-[10px] flex items-center justify-center border border-blue-200 shrink-0">
                              {activeTenant.fullName
                                .split(' ')
                                .map((n: string) => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">{activeTenant.fullName}</span>
                            <span className="text-[10px] text-slate-500">{activeTenant.phone}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">— No Active Tenant —</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingFlat(flat)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 border border-slate-200 shadow-sm"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Pricing / Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Flat & Pricing Modal */}
      {editingFlat && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <button
              onClick={() => setEditingFlat(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <Edit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Edit Flat {editingFlat.flatNumber} Vacancy & Pricing
                </h3>
                <p className="text-xs text-slate-500">Configure rent, status, and public website notes</p>
              </div>
            </div>

            <form onSubmit={handleUpdateFlat} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Vacancy Status on Website</label>
                  <select
                    value={editingFlat.status}
                    onChange={(e) => setEditingFlat({ ...editingFlat, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="VACANT">🟢 VACANT (List Live on Website)</option>
                    <option value="OCCUPIED">🔵 OCCUPIED (Assigned)</option>
                    <option value="RESERVED">🟡 RESERVED</option>
                    <option value="MAINTENANCE">🔴 UNDER MAINTENANCE</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Residence Type</label>
                  <select
                    value={editingFlat.flatType}
                    onChange={(e) => setEditingFlat({ ...editingFlat, flatType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="2BHK">2BHK Deluxe</option>
                    <option value="2BHK Executive">2BHK Executive</option>
                    <option value="1BHK">1BHK Compact</option>
                    <option value="3BHK">3BHK Grand</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Monthly Asking Rent (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingFlat.monthlyRent}
                    onChange={(e) => setEditingFlat({ ...editingFlat, monthlyRent: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-black focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingFlat.deposit}
                    onChange={(e) => setEditingFlat({ ...editingFlat, deposit: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-black focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Features & Notes for Visitors</label>
                <textarea
                  rows={3}
                  value={editingFlat.notes || ''}
                  onChange={(e) => setEditingFlat({ ...editingFlat, notes: e.target.value })}
                  placeholder="e.g. Balcony road facing, sunlit, cross-ventilation, individual sub-meter, ready to move in..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFlat(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20"
                >
                  Save & Publish Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Flat Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Add Flat Unit to Inventory</h3>
                <p className="text-xs text-slate-500">Create new flat and list it live on website</p>
              </div>
            </div>

            <form onSubmit={handleCreateFlat} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Flat Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-301"
                    value={newFlat.flatNumber}
                    onChange={(e) => setNewFlat({ ...newFlat, flatNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Residence Type</label>
                  <select
                    value={newFlat.flatType}
                    onChange={(e) => setNewFlat({ ...newFlat, flatType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="2BHK">2BHK Deluxe</option>
                    <option value="2BHK Executive">2BHK Executive</option>
                    <option value="1BHK">1BHK</option>
                    <option value="3BHK">3BHK</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newFlat.monthlyRent}
                    onChange={(e) => setNewFlat({ ...newFlat, monthlyRent: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-black focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Security Deposit (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newFlat.deposit}
                    onChange={(e) => setNewFlat({ ...newFlat, deposit: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-black focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Key Features / Notes</label>
                <textarea
                  rows={2}
                  value={newFlat.notes}
                  onChange={(e) => setNewFlat({ ...newFlat, notes: e.target.value })}
                  placeholder="e.g. Road facing, spacious open balcony, independent sub-meter..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20"
                >
                  Create & Publish Flat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
