import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Clock, Activity, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import StatusBadge from '../components/ui/StatusBadge';

function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="label mb-1">{label}</p>
          <p className={`font-display text-3xl font-700 ${accent}`}>{value}</p>
          {sub && <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl bg-white/5`}>
          <Icon className={`w-5 h-5 ${accent}`} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { history, fetchHistory } = useStore();

  useEffect(() => { fetchHistory(); }, []);

  const total    = history.length;
  const passed   = history.filter((j) => j.finalStatus === 'PASS').length;
  const failed   = history.filter((j) => j.finalStatus === 'FAIL').length;
  const running  = history.filter((j) => j.status === 'processing').length;

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="font-display text-2xl font-700 text-[var(--text-primary)]">Dashboard</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Brand Guardian AI — compliance audit overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Audits"    value={total}   icon={Activity}    accent="text-brand-400" />
        <StatCard label="Passed"          value={passed}  icon={ShieldCheck} accent="text-emerald-400"
                  sub={total ? `${Math.round(passed/total*100)}% pass rate` : undefined} />
        <StatCard label="Failed"          value={failed}  icon={ShieldAlert} accent="text-red-400" />
        <StatCard label="In Progress"     value={running} icon={Clock}       accent="text-amber-400" />
      </div>

      {/* CTA */}
      <div className="card p-6 flex items-center justify-between gap-4
                      bg-gradient-to-r from-brand-900/40 to-transparent">
        <div>
          <h2 className="font-display font-700 text-lg text-[var(--text-primary)]">
            Audit a video
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Paste any YouTube URL to run a full FTC / YouTube compliance check.
          </p>
        </div>
        <Link to="/audit" className="btn-primary shrink-0">
          Start Audit <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Recent jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="label">Recent Audits</p>
          <Link to="/history" className="btn-ghost text-xs">View all</Link>
        </div>

        {history.length === 0 ? (
          <div className="card p-8 text-center">
            <ShieldCheck className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
            <p className="text-sm text-[var(--text-muted)]">No audits yet — start your first one!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 8).map((job) => (
              <Link
                key={job.sessionId}
                to={`/audit/${job.sessionId}`}
                className="card p-4 flex items-center gap-4 hover:border-[var(--border-bright)]
                           cursor-pointer transition-all duration-150"
              >
                <StatusBadge status={job.status} finalStatus={job.finalStatus} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-[var(--text-muted)] truncate">
                    {job.videoUrl}
                  </p>
                </div>
                <p className="text-xs text-[var(--text-muted)] shrink-0">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
