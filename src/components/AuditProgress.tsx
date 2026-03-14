import React from 'react';
import { CheckCircle2, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { AuditJob } from '../types';
import { Card, Badge } from './shared/Card';

interface AuditProgressProps {
  currentJob: AuditJob | null;
  isSubmitting: boolean;
  feedbackStatus: Record<string, 'up' | 'down' | null>;
  onFeedback: (sessionId: string, score: number) => void;
}

export const AuditProgress: React.FC<AuditProgressProps> = ({
  currentJob,
  isSubmitting,
  feedbackStatus,
  onFeedback,
}) => {
  if (!currentJob && !isSubmitting) return null;

  return (
    <div className="animate-in zoom-in-95 duration-500">
      <Card className="p-10 border-sky-500/20 shadow-sky-500/5">
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <Badge variant="info">Work in Progress</Badge>
              <h3 className="text-3xl font-bold text-slate-900 uppercase tracking-tighter">
                {currentJob?.stage || 'Initializing...'}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-5xl font-black text-sky-500">
                {currentJob?.progress || 0}%
              </p>
            </div>
          </div>

          <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-sky-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(14,165,233,0.5)]"
              style={{ width: `${currentJob?.progress || 0}%` }}
            />
          </div>

          {currentJob?.status === 'completed' && (
            <div className="pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {currentJob.finalStatus === 'PASS' ? (
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-10 h-10 text-rose-500" />
                  )}
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">
                      Verdict: {currentJob.finalStatus}
                    </h4>
                    <p className="text-sm text-slate-500">
                      Session ID: {currentJob.sessionId.slice(0, 8)}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-4 py-2 italic bg-slate-50/80 rounded-r-lg">
                  "{currentJob.finalReport}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Violations
                  </p>
                  <p
                    className={`text-2xl font-black ${
                      currentJob.complianceResults?.length
                        ? 'text-rose-500'
                        : 'text-emerald-500'
                    }`}
                  >
                    {currentJob.complianceResults?.length || 0}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Feedback
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onFeedback(currentJob.sessionId, 1)}
                      className={`p-2 rounded-lg transition-all ${
                        feedbackStatus[currentJob.sessionId] === 'up'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-white text-slate-400 hover:text-emerald-500 border border-slate-200'
                      }`}
                      title="Feedback helpful"
                    >
                      <ThumbsUp className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onFeedback(currentJob.sessionId, 0)}
                      className={`p-2 rounded-lg transition-all ${
                        feedbackStatus[currentJob.sessionId] === 'down'
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-white text-slate-400 hover:text-rose-500 border border-slate-200'
                      }`}
                      title="Feedback not helpful"
                    >
                      <ThumbsDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
