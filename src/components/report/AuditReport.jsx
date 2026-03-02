import React, { useState } from 'react';
import {
  CheckCircle2, XCircle, ChevronDown, ChevronUp,
  FileText, Eye, EyeOff,
} from 'lucide-react';
import ViolationCard from '../ui/ViolationCard';
import StatusBadge from '../ui/StatusBadge';

export default function AuditReport({ job }) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showOcr,        setShowOcr]        = useState(false);

  const violations = job.complianceResults || [];
  const critical   = violations.filter((v) => v.severity === 'CRITICAL');
  const warnings   = violations.filter((v) => v.severity === 'WARNING');
  const pass       = job.finalStatus === 'PASS';

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Result banner */}
      <div className={`card p-5 border-l-4
        ${pass ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl
            ${pass ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
            {pass
              ? <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              : <XCircle      className="w-6 h-6 text-red-400" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display text-lg font-700">
                {pass ? 'Content is Compliant' : 'Compliance Violations Detected'}
              </h2>
              <StatusBadge status={job.status} finalStatus={job.finalStatus} />
            </div>
            <p className="text-xs text-[var(--text-muted)]">Video ID: {job.videoId}</p>
          </div>
          {/* Stats */}
          {!pass && (
            <div className="flex gap-3">
              {critical.length > 0 && (
                <div className="text-center">
                  <div className="text-xl font-display font-700 text-red-400">{critical.length}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">CRITICAL</div>
                </div>
              )}
              {warnings.length > 0 && (
                <div className="text-center">
                  <div className="text-xl font-display font-700 text-amber-400">{warnings.length}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">WARNINGS</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {job.finalReport && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-brand-400" />
            <p className="label">AI Summary</p>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
            {job.finalReport}
          </p>
        </div>
      )}

      {/* Violations */}
      {violations.length > 0 && (
        <div className="space-y-3">
          <p className="label">Violations ({violations.length})</p>
          {violations.map((issue, i) => (
            <ViolationCard key={i} issue={issue} index={i} />
          ))}
        </div>
      )}

      {/* Transcript accordion */}
      {job.transcript && (
        <div className="card overflow-hidden">
          <button
            onClick={() => setShowTranscript((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-sm
                       font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]
                       transition-colors"
          >
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" /> View Transcript
            </span>
            {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showTranscript && (
            <div className="px-5 pb-5 border-t border-[var(--border)]">
              <p className="text-xs font-mono text-[var(--text-muted)] mt-4 leading-relaxed whitespace-pre-wrap">
                {job.transcript}
              </p>
            </div>
          )}
        </div>
      )}

      {/* OCR accordion */}
      {job.ocrText?.length > 0 && (
        <div className="card overflow-hidden">
          <button
            onClick={() => setShowOcr((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-sm
                       font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]
                       transition-colors"
          >
            <span className="flex items-center gap-2">
              <EyeOff className="w-4 h-4" /> OCR Text ({job.ocrText.length} items)
            </span>
            {showOcr ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showOcr && (
            <div className="px-5 pb-5 border-t border-[var(--border)]">
              <ul className="mt-4 space-y-1">
                {job.ocrText.map((t, i) => (
                  <li key={i} className="text-xs font-mono text-[var(--text-muted)] flex gap-2">
                    <span className="text-brand-600 shrink-0">{i + 1}.</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
