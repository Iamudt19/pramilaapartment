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
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-950/40',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      glow: 'shadow-blue-950/40',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'shadow-amber-950/40',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      glow: 'shadow-rose-950/40',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      glow: 'shadow-purple-950/40',
    },
  };

  const c = colorMap[color];

  return (
    <div className={`glass-card glass-card-hover rounded-2xl p-5 border ${c.border} shadow-lg ${c.glow} relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center border ${c.border}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl lg:text-3xl font-black text-white tracking-tight">{value}</div>
      {(subtitle || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                trendPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-400 text-[11px]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
