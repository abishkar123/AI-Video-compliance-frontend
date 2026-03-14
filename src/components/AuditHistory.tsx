import React from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, RefreshCcw } from 'lucide-react';
import type { AuditJob } from '../types';
import { Card, Badge } from './shared/Card';

interface AuditHistoryProps {
  history: AuditJob[];
  onRefresh: () => void;
  onSelectJob: (job: AuditJob) => void;
}

export const AuditHistory: React.FC<AuditHistoryProps> = ({
  history,
  onRefresh,
  onSelectJob,
}) => {
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Recent Audits</h2>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all border border-transparent hover:border-slate-200"
          title="Refresh history"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {history.map((job) => (
          <div
            key={job.sessionId}
            className="group p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${
                  job.finalStatus === 'PASS'
                    ? 'text-emerald-500 bg-emerald-50'
                    : 'text-rose-500 bg-rose-50'
                }`}
              >
                {job.finalStatus === 'PASS' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="font-bold text-slate-800 group-hover:text-sky-600 transition-colors truncate max-w-sm">
                  {job.videoUrl}
                </p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {new Date(job.createdAt).toLocaleDateString()} •{' '}
                  {job.sessionId.slice(0, 8)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant={
                  job.status === 'completed'
                    ? job.finalStatus === 'PASS'
                      ? 'success'
                      : 'danger'
                    : 'warning'
                }
              >
                {job.finalStatus || job.status}
              </Badge>
              <button
                onClick={() => onSelectJob(job)}
                className="p-2 bg-slate-50 text-slate-400 border border-slate-200 rounded-lg hover:text-sky-500 hover:bg-white hover:border-sky-500/30 transition-all"
                title="View details"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <div className="py-20 text-center text-slate-400 bg-white border border-dashed border-slate-200 rounded-xl">
            No history found. Start your first audit.
          </div>
        )}
      </div>
    </div>
  );
};
