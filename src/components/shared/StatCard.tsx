import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  color?: 'emerald' | 'blue' | 'amber' | 'rose' | 'purple';
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'emerald',
}: StatCardProps) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      glow: 'shadow-emerald-600/5',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      glow: 'shadow-blue-600/5',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      glow: 'shadow-amber-600/5',
    },
    rose: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-700',
      glow: 'shadow-rose-600/5',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      glow: 'shadow-purple-600/5',
    },
  };

  const c = colorMap[color];

  return (
    <div className={`bg-white rounded-3xl p-5 border border-slate-200 shadow-md hover:shadow-lg transition-all relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-2xl ${c.bg} ${c.text} flex items-center justify-center border ${c.border} shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">{value}</div>
      {(subtitle || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                trendPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-500 text-[11px] font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
