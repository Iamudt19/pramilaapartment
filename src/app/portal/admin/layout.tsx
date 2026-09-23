'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lock, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';

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
        <div className="max-w-md w-full bg-neutral-950 border border-neutral-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center mx-auto text-black shadow-xl">
            <Lock className="w-8 h-8 font-bold" />
          </div>

          <div>
            <h2 className="text-2xl font-serif-luxury font-black text-white tracking-tight">Admin Portal Protected</h2>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              This area is restricted to estate administrators. Please enter the master admin password to proceed.
            </p>
          </div>

          {error && (
            <div className="bg-neutral-900 border border-neutral-700 text-neutral-200 p-3 rounded-2xl text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-white" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="text-left">
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Master Admin Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter admin password (Password@123)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Default Password: <code className="text-white font-bold">Password@123</code></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-neutral-200 text-black font-extrabold py-3 rounded-xl text-xs shadow-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
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
