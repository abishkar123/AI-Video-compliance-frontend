import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Play, Shield, History, Activity, AlertCircle, CheckCircle2,
    Search, Database, ArrowRight, Loader2, Gauge,
    ChevronRight, RefreshCcw, Download, Cpu, Monitor, Zap,
    AlertTriangle, Check, X, Menu, FileText, ThumbsUp, ThumbsDown,
    ExternalLink, Upload
} from 'lucide-react';
import type {
    AuditJob, ComplianceResult
} from './types.ts';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Components ──────────────────────────────────────────────────────────────

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "danger" | "info" }) => {
    const styles = {
        default: "bg-slate-100 text-slate-700",
        success: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        danger: "bg-rose-50 text-rose-600 border border-rose-200",
        warning: "bg-amber-50 text-amber-600 border border-amber-200",
        info: "bg-sky-50 text-sky-600 border border-sky-200",
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${styles[variant]}`}>
            {children}
        </span>
    );
};

// ── Main App ────────────────────────────────────────────────────────────────

export default function App() {
    const [activeTab, setActiveTab] = useState<'audit' | 'history'>('audit');
    const [videoUrl, setVideoUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentJob, setCurrentJob] = useState<AuditJob | null>(null);
    const [history, setHistory] = useState<AuditJob[]>([]);
    const [feedbackStatus, setFeedbackStatus] = useState<Record<string, 'up' | 'down' | null>>({});

    const pollInterval = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── API Helpers ────────────────────────────────────────────────────────────

    const fetchHistory = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/audit/history`);
            const data = await res.json();
            setHistory(data.jobs || []);
        } catch (e) { console.error('History fetch failed'); }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsSubmitting(true);
        setCurrentJob(null);

        const formData = new FormData();
        formData.append('video', file);

        try {
            const res = await fetch(`${API_BASE}/api/audit/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.sessionId) {
                pollJobStatus(data.sessionId);
            } else {
                setIsSubmitting(false);
                alert(data.error || 'Upload failed');
            }
        } catch (e) {
            console.error('Upload failed', e);
            setIsSubmitting(false);
        }
    };

    const startAudit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoUrl) return;

        setIsSubmitting(true);
        setCurrentJob(null);
        try {
            const res = await fetch(`${API_BASE}/api/audit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoUrl })
            });
            const data = await res.json();
            setVideoUrl('');
            pollJobStatus(data.sessionId);
        } catch (e) {
            console.error('Audit failed');
            setIsSubmitting(false);
        }
    };

    const pollJobStatus = (sessionId: string) => {
        if (pollInterval.current) clearInterval(pollInterval.current);

        pollInterval.current = setInterval(async () => {
            try {
                const res = await fetch(`${API_BASE}/api/audit/${sessionId}`);
                const data: AuditJob = await res.json();
                setCurrentJob(data);

                if (data.status === 'completed' || data.status === 'failed') {
                    if (pollInterval.current) clearInterval(pollInterval.current);
                    setIsSubmitting(false);
                    fetchHistory();
                }
            } catch (e) {
                if (pollInterval.current) clearInterval(pollInterval.current);
            }
        }, 2000);
    };

    const submitFeedback = async (sessionId: string, score: number) => {
        try {
            setFeedbackStatus(prev => ({ ...prev, [sessionId]: score === 1 ? 'up' : 'down' }));
            await fetch(`${API_BASE}/api/audit/${sessionId}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score, comment: 'Submitted via UI' })
            });
        } catch (e) {
            console.error('Feedback failed');
        }
    };

    useEffect(() => {
        fetchHistory();
        return () => { if (pollInterval.current) clearInterval(pollInterval.current); };
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
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
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
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Upload Style Hero Section */}
                        <Card className="max-w-2xl mx-auto p-8 border-slate-200">
                            <div className="text-center space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Upload video for audit</h2>
                                    <p className="text-slate-500 text-sm mt-1">Select a video or paste a link from YouTube/TikTok</p>
                                </div>

                                <div
                                    className="border-2 border-dashed border-slate-300 hover:border-sky-500/50 hover:bg-sky-50/50 transition-all rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer group relative"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="video/*"
                                        onChange={handleFileSelect}
                                    />
                                    <div className="w-16 h-16 bg-slate-100 group-hover:bg-slate-200 rounded-full flex items-center justify-center mb-4 transition-colors">
                                        <Upload className="w-8 h-8 text-slate-500 group-hover:text-sky-500 transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Select video to upload</h3>
                                    <p className="text-slate-500 text-sm mb-6">Or drag and drop a file</p>
                                    <p className="text-xs text-slate-400 mb-6">MP4 or WebM • Up to 10 minutes</p>

                                    <button
                                        type="button"
                                        className="bg-sky-50 hover:bg-sky-100 text-sky-600 font-bold py-2.5 px-6 rounded-lg transition-colors border border-transparent hover:border-sky-200 focus:outline-none"
                                    >
                                        Select file
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold tracking-widest my-6 uppercase">
                                    <div className="flex-1 h-px bg-slate-200"></div>
                                    <span>Or paste link</span>
                                    <div className="flex-1 h-px bg-slate-200"></div>
                                </div>

                                <form onSubmit={startAudit} className="relative group">
                                    <div className="absolute inset-y-0 left-4 top-0 bottom-0 flex items-center justify-center pointer-events-none text-slate-400">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="url-input"
                                        type="url"
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        placeholder="e.g., https://youtube.com/watch?v=..."
                                        className="w-full pl-12 pr-40 py-4 bg-white border border-slate-300 hover:border-slate-400 rounded-xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all text-slate-900 text-sm shadow-sm"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-sm"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                        Analyze
                                    </button>
                                </form>
                            </div>
                        </Card>

                        {/* Active Job Progress */}
                        {(currentJob || isSubmitting) && (
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
                                                <p className="text-5xl font-black text-sky-500">{currentJob?.progress || 0}%</p>
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
                                                        {currentJob.finalStatus === 'PASS'
                                                            ? <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                                            : <AlertCircle className="w-10 h-10 text-rose-500" />
                                                        }
                                                        <div>
                                                            <h4 className="text-xl font-bold text-slate-900">Verdict: {currentJob.finalStatus}</h4>
                                                            <p className="text-sm text-slate-500">Session ID: {currentJob.sessionId.slice(0, 8)}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-4 py-2 italic bg-slate-50/80 rounded-r-lg">
                                                        "{currentJob.finalReport}"
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Violations</p>
                                                        <p className={`text-2xl font-black ${currentJob.complianceResults?.length ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                            {currentJob.complianceResults?.length || 0}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Feedback</p>
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => submitFeedback(currentJob.sessionId, 1)}
                                                                className={`p-2 rounded-lg transition-all ${feedbackStatus[currentJob.sessionId] === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400 hover:text-emerald-500 border border-slate-200'}`}
                                                            >
                                                                <ThumbsUp className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => submitFeedback(currentJob.sessionId, 0)}
                                                                className={`p-2 rounded-lg transition-all ${feedbackStatus[currentJob.sessionId] === 'down' ? 'bg-rose-100 text-rose-600' : 'bg-white text-slate-400 hover:text-rose-500 border border-slate-200'}`}
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
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="animate-in fade-in duration-500 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <h2 className="text-2xl font-bold text-slate-900">Recent Audits</h2>
                            <button
                                onClick={fetchHistory}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all border border-transparent hover:border-slate-200"
                            >
                                <RefreshCcw className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {history.map((job) => (
                                <div key={job.sessionId} className="group p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${job.finalStatus === 'PASS' ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
                                            {job.finalStatus === 'PASS' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 group-hover:text-sky-600 transition-colors truncate max-w-sm">
                                                {job.videoUrl}
                                            </p>
                                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                                                {new Date(job.createdAt).toLocaleDateString()} • {job.sessionId.slice(0, 8)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={job.status === 'completed' ? (job.finalStatus === 'PASS' ? 'success' : 'danger') : 'warning'}>
                                            {job.finalStatus || job.status}
                                        </Badge>
                                        <button
                                            onClick={() => {
                                                setCurrentJob(job as any);
                                                setActiveTab('audit');
                                            }}
                                            className="p-2 bg-slate-50 text-slate-400 border border-slate-200 rounded-lg hover:text-sky-500 hover:bg-white hover:border-sky-500/30 transition-all"
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
                )}
            </main>

            <footer className="max-w-5xl mx-auto px-6 py-8 border-t border-slate-200 flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-[2px]">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 opacity-40" />
                    ComplianceQA Engine v1.0
                </div>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Live</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-sky-500 rounded-full" /> Monitored</span>
                </div>
            </footer>
        </div>
    );
}
