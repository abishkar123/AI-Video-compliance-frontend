import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Youtube, ArrowRight, AlertCircle } from 'lucide-react';
import useStore from '../../store/useStore';

export default function AuditForm() {
  const [videoUrl, setVideoUrl] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { startAudit } = useStore();
  const navigate = useNavigate();

  const validate = (url) => {
    if (!url.trim()) return 'Please enter a YouTube URL.';
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return 'Only YouTube URLs are supported (youtube.com or youtu.be).';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(videoUrl);
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      const sessionId = await startAudit(videoUrl.trim());
      navigate(`/audit/${sessionId}`);
    } catch (ex) {
      setError(ex.response?.data?.errors?.[0]?.msg || ex.message || 'Failed to start audit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                        bg-brand-600/20 border border-brand-600/30 mb-4">
          <ShieldCheck className="w-7 h-7 text-brand-400" />
        </div>
        <h1 className="font-display text-3xl font-700 text-[var(--text-primary)] mb-2">
          New Compliance Audit
        </h1>
        <p className="text-[var(--text-muted)] text-sm">
          Paste a YouTube URL — our AI pipeline will extract transcripts, OCR text,
          and audit against FTC / YouTube compliance rules.
        </p>
      </div>

      {/* Form card */}
      <div className="card p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label mb-2 block">YouTube Video URL</label>
            <div className="relative">
              <Youtube className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="url"
                className="input-field pl-10"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => { setVideoUrl(e.target.value); setError(''); }}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                            bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                 rounded-full animate-spin" />
                Starting audit…
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Start Compliance Audit
                <ArrowRight className="w-4 h-4 ml-auto" />
              </>
            )}
          </button>
        </form>

        {/* Pipeline steps */}
        <div className="border-t border-[var(--border)] pt-4">
          <p className="label mb-3">Pipeline stages</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-muted)]">
            {[
              ['1', 'Download video via yt-dlp'],
              ['2', 'Upload to Azure Video Indexer'],
              ['3', 'Extract transcript + OCR'],
              ['4', 'RAG audit via GPT-4o'],
            ].map(([n, desc]) => (
              <div key={n} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-600/20 text-brand-400
                                 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {n}
                </span>
                {desc}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
