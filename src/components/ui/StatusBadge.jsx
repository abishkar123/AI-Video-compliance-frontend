import React from 'react';
import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';

export default function StatusBadge({ status, finalStatus }) {
  if (status === 'completed') {
    const pass = finalStatus === 'PASS';
    return (
      <span className={pass ? 'badge-pass' : 'badge-fail'}>
        {pass ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {pass ? 'PASS' : 'FAIL'}
      </span>
    );
  }

  if (status === 'failed') {
    return (
      <span className="badge-critical">
        <XCircle className="w-3 h-3" />
        ERROR
      </span>
    );
  }

  if (status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold
                       bg-brand-600/15 text-brand-400 border border-brand-600/25">
        <Loader2 className="w-3 h-3 animate-spin" />
        Processing
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold
                     bg-white/10 text-[var(--text-muted)] border border-white/10">
      <Clock className="w-3 h-3" />
      Queued
    </span>
  );
}
