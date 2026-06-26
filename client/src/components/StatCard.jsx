import { TrendingUp, TrendingDown } from 'lucide-react';

const accentMap = {
  indigo: 'bg-indigo-500/10 text-indigo-400',
  emerald: 'bg-emerald-500/10 text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-400',
  rose: 'bg-rose-500/10 text-rose-400',
  violet: 'bg-violet-500/10 text-violet-400',
};

export default function StatCard({ title, value, icon: Icon, accent = 'indigo', trend }) {
  return (
    <div className="card-hover p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-zinc-50">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              {trend.direction === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span className={trend.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'}>
                {trend.value}
              </span>
              <span className="text-zinc-500">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${accentMap[accent] || accentMap.indigo}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
