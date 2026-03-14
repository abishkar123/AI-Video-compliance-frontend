import React, { useState, useEffect, useRef } from 'react';
import { Play, Shield, History } from 'lucide-react';
import type { AuditJob } from './types';
import { showError, showSuccess } from './utils/toast';
import axiosInstance from './utils/api';
import { AuditForm } from './components/AuditForm';
import { AuditProgress } from './components/AuditProgress';
import { AuditHistory } from './components/AuditHistory';

export default function App() {
  const [activeTab, setActiveTab] = useState<'audit' | 'history'>('audit');
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentJob, setCurrentJob] = useState<AuditJob | null>(null);
  const [history, setHistory] = useState<AuditJob[]>([]);
  const [feedbackStatus, setFeedbackStatus] = useState<
    Record<string, 'up' | 'down' | null>
  >({});

  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get('/api/audit/history');
      setHistory(res.data.jobs || []);
    } catch (error: any) {
      // Error already shown by interceptor
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    setCurrentJob(null);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const res = await axiosInstance.post('/api/audit/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.sessionId) {
        showSuccess('Video uploaded successfully. Starting audit...');
        pollJobStatus(res.data.sessionId);
      } else {
        showError('Upload completed but no session ID received');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      // Error already shown by interceptor
      setIsSubmitting(false);
    }
  };

  const startAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      showError('Please enter a video URL');
      return;
    }

    setIsSubmitting(true);
    setCurrentJob(null);
    try {
      const res = await axiosInstance.post('/api/audit', { videoUrl });

      setVideoUrl('');
      showSuccess('Audit started successfully');
      pollJobStatus(res.data.sessionId);
    } catch (error: any) {
      // Error already shown by interceptor
      setIsSubmitting(false);
    }
  };

  const pollJobStatus = (sessionId: string) => {
    if (pollInterval.current) clearInterval(pollInterval.current);

    pollInterval.current = setInterval(async () => {
      try {
        const res = await axiosInstance.get(`/api/audit/${sessionId}`);
        const data: AuditJob = res.data;
        setCurrentJob(data);

        if (data.status === 'completed' || data.status === 'failed') {
          if (pollInterval.current) clearInterval(pollInterval.current);
          setIsSubmitting(false);
          fetchHistory();

          if (data.status === 'completed') {
            showSuccess(`Audit completed: ${data.finalStatus}`);
          } else {
            showError('Audit failed. Please try again.');
          }
        }
      } catch (error: any) {
        if (pollInterval.current) clearInterval(pollInterval.current);
        // Error shown by interceptor, but we silently stop polling
      }
    }, 2000);
  };

  const submitFeedback = async (sessionId: string, score: number) => {
    try {
      setFeedbackStatus((prev) => ({
        ...prev,
        [sessionId]: score === 1 ? 'up' : 'down',
      }));

      await axiosInstance.post(`/api/audit/${sessionId}/feedback`, {
        score,
        comment: 'Submitted via UI',
      });

      showSuccess('Feedback submitted successfully');
    } catch (error: any) {
      // Error already shown by interceptor
      setFeedbackStatus((prev) => ({ ...prev, [sessionId]: null }));
    }
  };

  useEffect(() => {
    fetchHistory();
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-500/30">
      {/* Background Blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-400/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              ComplianceQA
            </h1>
          </div>

          <nav className="flex items-center gap-2">
            {[
              { id: 'audit', label: 'New Audit', icon: Play },
              { id: 'history', label: 'History', icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'audit' | 'history')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 relative">
        {activeTab === 'audit' && (
          <>
            <AuditForm
              videoUrl={videoUrl}
              isSubmitting={isSubmitting}
              onVideoUrlChange={setVideoUrl}
              onFileSelect={handleFileSelect}
              onSubmit={startAudit}
            />
            <AuditProgress
              currentJob={currentJob}
              isSubmitting={isSubmitting}
              feedbackStatus={feedbackStatus}
              onFeedback={submitFeedback}
            />
          </>
        )}

        {activeTab === 'history' && (
          <AuditHistory
            history={history}
            onRefresh={fetchHistory}
            onSelectJob={(job) => {
              setCurrentJob(job);
              setActiveTab('audit');
            }}
          />
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-8 border-t border-slate-200 flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-[2px]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 opacity-40" />
          ComplianceQA Engine v1.0
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Live
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-sky-500 rounded-full" /> Monitored
          </span>
        </div>
      </footer>
    </div>
  );
}
