import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import useStore from '../../store/useStore';
import ProgressBar from '../ui/ProgressBar';
import AuditReport from '../report/AuditReport';

const STAGE_LABELS = {
  queued:      'Queued — waiting to start…',
  downloading: 'Downloading video from YouTube…',
  uploading:   'Uploading to Azure Video Indexer…',
  indexing:    'Extracting transcript & OCR…',
  Uploading:   'Uploading to Azure Video Indexer…',
  Processing:  'Processing in Azure Video Indexer…',
  Processed:   'Finalising extraction…',
  auditing:    'Running RAG compliance audit…',
  completed:   'Audit complete',
  failed:      'Audit failed',
};

export default function AuditStatus() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { activeJob, loadJob, startAudit } = useStore();

  useEffect(() => {
    if (!activeJob || activeJob.sessionId !== sessionId) {
      loadJob(sessionId);
    }
  }, [sessionId]);

  if (!activeJob) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-5 h-5 text-[var(--text-muted)] animate-spin" />
      </div>
    );
  }

  const isRunning   = activeJob.status === 'queued' || activeJob.status === 'processing';
  const isCompleted = activeJob.status === 'completed';
  const isFailed    = activeJob.status === 'failed';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link to="/audit" className="btn-ghost text-xs px-2">
        <ArrowLeft className="w-3.5 h-3.5" /> New Audit
      </Link>

      {/* Job header */}
      <div className="card p-5 space-y-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="label">Session ID</p>
            <p className="font-mono text-sm text-[var(--text-primary)]">{activeJob.sessionId}</p>
          </div>
          <div>
            <p className="label">Video ID</p>
            <p className="font-mono text-sm text-[var(--text-primary)]">{activeJob.videoId}</p>
          </div>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1 truncate">{activeJob.videoUrl}</p>
      </div>

      {/* Progress — show while running */}
      {isRunning && (
        <div className="card p-5 space-y-4">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {STAGE_LABELS[activeJob.stage] || 'Processing…'}
          </p>
          <ProgressBar stage={activeJob.stage} progress={activeJob.progress} />
          <p className="text-xs text-[var(--text-muted)] animate-pulse-slow">
            This may take 2–5 minutes depending on video length.
          </p>
        </div>
      )}

      {/* Error */}
      {isFailed && (
        <div className="card p-5 border-l-2 border-l-red-500">
          <p className="text-sm font-semibold text-red-400 mb-1">Audit Failed</p>
          <p className="text-xs text-[var(--text-muted)]">{activeJob.error}</p>
          <button
            onClick={() => navigate('/audit')}
            className="btn-primary mt-4 text-xs"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Report */}
      {isCompleted && <AuditReport job={activeJob} />}
    </div>
  );
}
