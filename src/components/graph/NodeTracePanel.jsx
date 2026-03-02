import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2, Clock, SkipForward } from 'lucide-react';

const STATUS_ICON = {
  pending:   <Clock      className="w-4 h-4 text-slate-500" />,
  running:   <Loader2    className="w-4 h-4 text-brand-400 animate-spin" />,
  completed: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  failed:    <XCircle    className="w-4 h-4 text-red-400" />,
  skipped:   <SkipForward className="w-4 h-4 text-slate-600" />,
};

const STATUS_LABEL = {
  pending:   'bg-slate-700/40 text-slate-400 border-slate-600/30',
  running:   'bg-brand-600/20 text-brand-400 border-brand-600/30',
  completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  failed:    'bg-red-500/15 text-red-400 border-red-500/25',
  skipped:   'bg-slate-800/60 text-slate-600 border-slate-700/30',
};

function SnapshotViewer({ snapshot }) {
  const [open, setOpen] = useState(false);
  if (!snapshot) return null;
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors"
      >
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        State snapshot
      </button>
      {open && (
        <pre className="mt-2 p-3 rounded-lg bg-[var(--bg-base)] border border-[var(--border)]
                        text-[10px] font-mono text-[var(--text-muted)] overflow-x-auto max-h-48">
          {JSON.stringify(snapshot, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function NodeTracePanel({ nodes = [] }) {
  if (nodes.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-[var(--text-muted)]">
        No node traces yet — run an audit to see activity.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {nodes.map((node, i) => (
        <div
          key={node.nodeId}
          className={`card p-4 border-l-2 animate-fade-up
            ${node.status === 'completed' ? 'border-l-emerald-500'
            : node.status === 'failed'    ? 'border-l-red-500'
            : node.status === 'running'   ? 'border-l-brand-500'
            : node.status === 'skipped'   ? 'border-l-slate-600'
            : 'border-l-slate-700'}`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              {STATUS_ICON[node.status] || STATUS_ICON.pending}
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {node.label || node.nodeId}
                </p>
                {node.description && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{node.description}</p>
                )}
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px]
                               font-semibold border ${STATUS_LABEL[node.status] || STATUS_LABEL.pending}`}>
                {node.status?.toUpperCase()}
              </span>
              {node.durationMs != null && (
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {node.durationMs}ms
                </span>
              )}
            </div>
          </div>

          {/* Timing */}
          {node.startedAt && (
            <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-mono text-[var(--text-muted)]">
              <div>
                <span className="label" style={{ fontSize: 9 }}>Started</span>
                <p>{new Date(node.startedAt).toLocaleTimeString()}</p>
              </div>
              {node.completedAt && (
                <div>
                  <span className="label" style={{ fontSize: 9 }}>Completed</span>
                  <p>{new Date(node.completedAt).toLocaleTimeString()}</p>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {node.error && (
            <div className="mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400 font-mono">{node.error}</p>
            </div>
          )}

          {/* State snapshot accordion */}
          <SnapshotViewer snapshot={node.stateSnapshot} />
        </div>
      ))}
    </div>
  );
}
