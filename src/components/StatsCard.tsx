import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'emerald' | 'cyan' | 'amber' | 'rose' | 'violet';
}

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-400',
    gradient: 'from-emerald-400 to-emerald-600',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    icon: 'text-cyan-400',
    gradient: 'from-cyan-400 to-cyan-600',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
    gradient: 'from-amber-400 to-amber-600',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    icon: 'text-rose-400',
    gradient: 'from-rose-400 to-rose-600',
  },
  violet: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    icon: 'text-violet-400',
    gradient: 'from-violet-400 to-violet-600',
  },
};

export function StatsCard({ title, value, icon, trend, color }: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-6 backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

