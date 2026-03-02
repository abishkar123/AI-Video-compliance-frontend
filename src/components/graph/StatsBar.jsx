import React from 'react';
import { Activity, Timer, AlertTriangle } from 'lucide-react';

function Stat({ icon: Icon, label, value, accent }) {
  return (
    <div className="card px-4 py-3 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/5">
        <Icon className={`w-4 h-4 ${accent}`} />
      </div>
      <div>
        <p className="label text-[10px]">{label}</p>
        <p className={`font-display font-700 text-lg ${accent}`}>{value ?? '—'}</p>
      </div>
    </div>
  );
}

export default function StatsBar({ stats }) {
  if (!stats) return null;

  const passRate = stats.total
    ? Math.round((stats.passed / stats.total) * 100)
    : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Stat icon={Activity} label="Total Runs"   value={stats.total}      accent="text-brand-400" />
      <Stat icon={Activity} label="Pass Rate"    value={passRate != null ? `${passRate}%` : '—'} accent="text-emerald-400" />
      <Stat icon={Timer}    label="Avg Duration" value={stats.avgMs ? `${stats.avgMs}ms` : '—'}  accent="text-amber-400" />
      <Stat icon={AlertTriangle} label="Failed Runs" value={stats.failed}  accent="text-red-400" />

      {/* Per-node averages */}
      {stats.nodeAverages?.length > 0 && (
        <div className="col-span-2 lg:col-span-4 card p-4">
          <p className="label mb-3">Per-node averages</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.nodeAverages.map((n) => (
              <div key={n.nodeId} className="text-center">
                <p className="text-xs font-semibold text-[var(--text-primary)] capitalize">{n.nodeId}</p>
                <p className="font-display font-700 text-base text-brand-400">{n.avgMs}ms</p>
                <p className="text-[10px] text-[var(--text-muted)]">
                  {n.failureRate}% failure rate
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
