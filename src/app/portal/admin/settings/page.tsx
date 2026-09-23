'use client';

import React, { useEffect, useState } from 'react';
import { Sliders, Save, CheckCircle2, AlertCircle, Building2, Zap, Shield, FileText, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'property' | 'billing' | 'visitor' | 'tenancy' | 'security'>('property');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveSuccess(false);

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="text-center py-12 text-slate-400">Loading system settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Configuration Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Zero Hard-Coding Rule: Operational policies, billing rates, visitor rules, and society parameters are database-driven.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving Changes...' : 'Save Configuration'}
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-3.5 rounded-2xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Configuration saved successfully! All billing rules, gates, and visitor workflows are instantly updated.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: 'property', label: '1. Property Profile', icon: Building2 },
          { key: 'billing', label: '2. Billing & Tariffs', icon: Zap },
          { key: 'visitor', label: '3. Visitor Policy Engine', icon: Shield },
          { key: 'tenancy', label: '4. Tenancy & Leases', icon: FileText },
          { key: 'security', label: '5. Security Gate Rules', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-800 space-y-6">
        {/* Tab 1: Property Profile */}
        {activeTab === 'property' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Apartment Identity & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Apartment / Society Name</label>
                <input
                  type="text"
                  value={settings['property.name'] || ''}
                  onChange={(e) => updateField('property.name', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Management Contact Phone</label>
                <input
                  type="text"
                  value={settings['property.contact'] || ''}
                  onChange={(e) => updateField('property.contact', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Complete Physical Address</label>
                <input
                  type="text"
                  value={settings['property.address'] || ''}
                  onChange={(e) => updateField('property.address', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Management Email (Notifications)</label>
                <input
                  type="email"
                  value={settings['property.management_email'] || ''}
                  onChange={(e) => updateField('property.management_email', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Timezone</label>
                  <input
                    type="text"
                    value={settings['property.timezone'] || 'Asia/Kolkata'}
                    onChange={(e) => updateField('property.timezone', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Currency</label>
                  <input
                    type="text"
                    value={settings['property.currency'] || 'INR'}
                    onChange={(e) => updateField('property.currency', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Billing & Tariffs */}
        {activeTab === 'billing' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Billing Engine & Utility Tariffs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Rent Due Day (1-28)</label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={settings['billing.rent_due_day'] ?? 5}
                  onChange={(e) => updateField('billing.rent_due_day', parseInt(e.target.value) || 5)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Grace Period (Days)</label>
                <input
                  type="number"
                  min="0"
                  value={settings['billing.grace_period_days'] ?? 5}
                  onChange={(e) => updateField('billing.grace_period_days', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Late Payment Fixed Fee (₹)</label>
                <input
                  type="number"
                  value={settings['billing.late_fee_fixed'] ?? 500}
                  onChange={(e) => updateField('billing.late_fee_fixed', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Electricity Rate per Unit (₹/kWh)</label>
                <input
                  type="number"
                  step="0.5"
                  value={settings['billing.electricity_rate_per_unit'] ?? 10.0}
                  onChange={(e) => updateField('billing.electricity_rate_per_unit', parseFloat(e.target.value) || 10.0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold text-emerald-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Fixed Water Charge (₹/mo)</label>
                <input
                  type="number"
                  value={settings['billing.water_charge_fixed'] ?? 400}
                  onChange={(e) => updateField('billing.water_charge_fixed', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Annual Rent Increase (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={settings['billing.annual_increase_pct'] ?? 8.0}
                  onChange={(e) => updateField('billing.annual_increase_pct', parseFloat(e.target.value) || 8.0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Visitor Policy Engine */}
        {activeTab === 'visitor' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Visitor Access & Policy Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div>
                  <span className="font-semibold text-white text-xs block">Management Approval Required</span>
                  <span className="text-[10px] text-slate-400">If enabled, outside visitors require admin clearance before pass is active</span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(settings['visitor.management_approval_required'])}
                  onChange={(e) => updateField('visitor.management_approval_required', e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div>
                  <span className="font-semibold text-white text-xs block">Mandatory Government ID Proof</span>
                  <span className="text-[10px] text-slate-400">Require Aadhaar or ID document upload on visitor requests</span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(settings['visitor.require_id_proof'])}
                  onChange={(e) => updateField('visitor.require_id_proof', e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Unauthorized Visitor Violation Penalty (₹/day)</label>
                <input
                  type="number"
                  value={settings['visitor.unauthorized_penalty_amount'] ?? 2000}
                  onChange={(e) => updateField('visitor.unauthorized_penalty_amount', parseFloat(e.target.value) || 2000)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold text-rose-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Max Visitor Duration (Hours)</label>
                <input
                  type="number"
                  value={settings['visitor.max_duration_hours'] ?? 12}
                  onChange={(e) => updateField('visitor.max_duration_hours', parseInt(e.target.value) || 12)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Tenancy & Leases */}
        {activeTab === 'tenancy' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Tenancy & Vacating Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Vacating Notice Period (Days)</label>
                <input
                  type="number"
                  value={settings['tenancy.notice_period_days'] ?? 30}
                  onChange={(e) => updateField('tenancy.notice_period_days', parseInt(e.target.value) || 30)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Quiet Hours Start Time</label>
                <input
                  type="text"
                  value={settings['tenancy.quiet_hours_start'] || '22:00'}
                  onChange={(e) => updateField('tenancy.quiet_hours_start', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="22:00"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Security Gate Rules */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Security & QR Cryptography</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">QR Pass Validity Window (Hours)</label>
                <input
                  type="number"
                  value={settings['security.qr_validity_hours'] ?? 12}
                  onChange={(e) => updateField('security.qr_validity_hours', parseInt(e.target.value) || 12)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Configuration Settings
          </button>
        </div>
      </form>
    </div>
  );
}
