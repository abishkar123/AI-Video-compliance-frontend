import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw } from 'lucide-react';
import useStore from '../store/useStore';
import StatusBadge from '../components/ui/StatusBadge';

export default function HistoryPage() {
  const { history, fetchHistory } = useStore();

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-700 text-[var(--text-primary)]">Audit History</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{history.length} audits total</p>
        </div>
        <button onClick={fetchHistory} className="btn-ghost text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {history.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-[var(--text-muted)]">No audit history yet.</p>
          <Link to="/audit" className="btn-primary mt-4 inline-flex">Start your first audit</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((job, i) => (
            <Link
              key={job.sessionId}
              to={`/audit/${job.sessionId}`}
              className="card p-4 flex items-center gap-4 hover:border-[var(--border-bright)]
                         cursor-pointer transition-all duration-150 animate-fade-up"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <StatusBadge status={job.status} finalStatus={job.finalStatus} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-[var(--text-primary)] truncate">
                  {job.videoUrl}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
                  {job.sessionId}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-[var(--text-muted)]">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">
                  {new Date(job.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
