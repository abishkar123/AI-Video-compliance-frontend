import React from 'react';

const STAGES = [
  { key: 'downloading', label: 'Download'  },
  { key: 'uploading',   label: 'Upload'    },
  { key: 'indexing',    label: 'Index'     },
  { key: 'auditing',    label: 'Audit'     },
  { key: 'completed',   label: 'Complete'  },
];

export default function ProgressBar({ stage, progress }) {
  const currentIdx = STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="space-y-3">
      {/* Steps */}
      <div className="flex items-center gap-1">
        {STAGES.map((s, i) => {
          const done    = i < currentIdx;
          const active  = i === currentIdx;
          return (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    transition-all duration-300
                    ${done   ? 'bg-brand-600 text-white'            : ''}
                    ${active ? 'bg-brand-500 text-white ring-2 ring-brand-400/50 ring-offset-1 ring-offset-[var(--bg-card)]' : ''}
                    ${!done && !active ? 'bg-white/10 text-[var(--text-muted)]' : ''}`}
                >
                  {done ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] ${active ? 'text-brand-400' : 'text-[var(--text-muted)]'}`}>
                  {s.label}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <div className={`flex-1 h-px mb-4 transition-colors duration-300
                  ${done ? 'bg-brand-600' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full
                     transition-all duration-500 ease-out"
          style={{ width: `${progress || 0}%` }}
        />
      </div>
      <p className="text-xs text-[var(--text-muted)] text-right">{progress || 0}%</p>
    </div>
  );
}
