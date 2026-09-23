'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lock, KeyRound, ArrowRight, AlertCircle, ShieldCheck, Building2 } from 'lucide-react';

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, login } = useAuth();
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isAuthorizedAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'PROPERTY_MANAGER';

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@pramila.com', password: adminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminPassword('');
        await login('admin@pramila.com');
      } else {
        setError(data.error?.message || 'Incorrect Admin Password. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl glass-card text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-xl shadow-blue-500/20">
            <Lock className="w-8 h-8 text-amber-300" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Admin Portal Protected</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              This area is restricted to estate administrators and property managers. Please enter the master admin password to proceed.
            </p>
          </div>

          {error && (
            <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-3 rounded-2xl text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="text-left">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Master Admin Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter admin password (Password@123)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Default Password: <code className="text-emerald-400">Password@123</code></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? 'Verifying Password...' : 'Unlock & Enter Admin Suite'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
