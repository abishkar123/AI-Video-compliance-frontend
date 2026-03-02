import React from 'react';
import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';

const RUN_ICON = {
  completed: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
  failed:    <XCircle      className="w-3.5 h-3.5 text-red-400 shrink-0" />,
  running:   <Loader2      className="w-3.5 h-3.5 text-brand-400 animate-spin shrink-0" />,
  queued:    <Clock        className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
};

export default function RunList({ runs = [], selectedRunId, onSelect }) {
  if (runs.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-[var(--text-muted)]">
        No runs yet
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-220px)]">
      {runs.map((run) => {
        const selected = run.runId === selectedRunId;
        return (
          <button
            key={run.runId}
            onClick={() => onSelect(run.runId)}
            className={`w-full text-left px-4 py-3 border-b border-[var(--border)]
                        hover:bg-white/5 transition-colors
                        ${selected ? 'bg-brand-600/10 border-l-2 border-l-brand-500' : ''}`}
          >
            <div className="flex items-center gap-2 mb-1">
              {RUN_ICON[run.status] || RUN_ICON.queued}
              <span className="text-xs font-mono text-[var(--text-primary)] truncate">
                {run.runId?.slice(0, 8)}…
              </span>
              {run.durationMs && (
                <span className="text-[10px] font-mono text-[var(--text-muted)] ml-auto shrink-0">
                  {run.durationMs}ms
                </span>
              )}
            </div>
            <p className="text-[10px] text-[var(--text-muted)] truncate pl-5">
              {run.videoUrl || run.videoId}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] pl-5 mt-0.5">
              {run.startedAt ? new Date(run.startedAt).toLocaleString() : '—'}
            </p>
          </button>
        );
      })}
    </div>
  );
}
