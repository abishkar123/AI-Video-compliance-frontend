import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

export default function ViolationCard({ issue, index }) {
  const isCritical = issue.severity === 'CRITICAL';

  return (
    <div
      className={`card p-4 animate-fade-up border-l-2
        ${isCritical ? 'border-l-red-500' : 'border-l-amber-500'}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 p-1.5 rounded-lg shrink-0
          ${isCritical ? 'bg-red-500/15' : 'bg-amber-500/15'}`}>
          {isCritical
            ? <XCircle    className="w-4 h-4 text-red-400" />
            : <AlertTriangle className="w-4 h-4 text-amber-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={isCritical ? 'badge-critical' : 'badge-warning'}>
              {issue.severity}
            </span>
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              {issue.category}
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {issue.description}
          </p>
          {issue.timestamp && (
            <p className="mt-1.5 text-xs font-mono text-brand-400">@ {issue.timestamp}</p>
          )}
        </div>
      </div>
    </div>
  );
}
