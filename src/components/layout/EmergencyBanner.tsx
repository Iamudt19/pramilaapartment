'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function EmergencyBanner() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/emergency-alerts');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.alerts?.length > 0) {
            setAlerts(data.alerts);
          }
        }
      } catch (e) {
        // silent
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed || alerts.length === 0) return null;

  const activeAlert = alerts[0];

  return (
    <div className="bg-rose-900/90 text-white border-b border-rose-500/50 px-4 py-3 shadow-lg flex items-center justify-between sticky top-0 z-50 animate-pulse-subtle">
      <div className="flex items-center gap-3 max-w-5xl mx-auto flex-1">
        <div className="bg-rose-600 p-2 rounded-lg text-white">
          <AlertTriangle className="w-5 h-5 animate-bounce" />
        </div>
        <div>
          <span className="font-bold text-rose-200 uppercase tracking-wider text-xs bg-rose-950 px-2 py-0.5 rounded mr-2">
            EMERGENCY ALERT: {activeAlert.alertType}
          </span>
          <span className="font-semibold">{activeAlert.title}: </span>
          <span className="text-rose-100 text-sm">{activeAlert.message}</span>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-rose-800 rounded-lg text-rose-200 hover:text-white"
        title="Dismiss Alert"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
