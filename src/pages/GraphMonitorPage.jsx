import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Activity, GitBranch } from 'lucide-react';
import graphApi from '../services/graph.api';
import DAGCanvas     from '../components/graph/DAGCanvas';
import NodeTracePanel from '../components/graph/NodeTracePanel';
import RunList        from '../components/graph/RunList';
import StatsBar       from '../components/graph/StatsBar';

const POLL_MS = 5000;

export default function GraphMonitorPage() {
  const [definition,     setDefinition]     = useState(null);
  const [runs,           setRuns]           = useState([]);
  const [stats,          setStats]          = useState(null);
  const [selectedRunId,  setSelectedRunId]  = useState(null);
  const [selectedRun,    setSelectedRun]    = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [lastRefresh,    setLastRefresh]    = useState(null);

  // ── Initial load ─────────────────────────────────────────────────────────
  const loadAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [defRes, runsRes, statsRes] = await Promise.all([
        graphApi.definition(),
        graphApi.runs(50),
        graphApi.stats(),
      ]);
      setDefinition(defRes.data);
      setRuns(runsRes.data.runs || []);
      setStats(statsRes.data);
      setLastRefresh(new Date());

      // Auto-select most recent run
      if (!selectedRunId && runsRes.data.runs?.length > 0) {
        setSelectedRunId(runsRes.data.runs[0].runId);
      }
    } catch (err) {
      // silently handle — api not connected
    } finally {
      setLoading(false);
    }
  }, [selectedRunId]);

  // ── Load selected run trace ───────────────────────────────────────────────
  useEffect(() => {
    if (!selectedRunId) return;
    graphApi.run(selectedRunId)
      .then((res) => setSelectedRun(res.data))
      .catch(() => {});
  }, [selectedRunId]);

  // ── Auto-refresh active runs ──────────────────────────────────────────────
  useEffect(() => {
    loadAll();
    const timer = setInterval(() => loadAll(true), POLL_MS);
    return () => clearInterval(timer);
  }, []);

  // Refresh selected run if it's still running
  useEffect(() => {
    if (!selectedRun) return;
    if (selectedRun.status !== 'running') return;
    const t = setInterval(() => {
      graphApi.run(selectedRunId).then((r) => setSelectedRun(r.data)).catch(() => {});
    }, 2000);
    return () => clearInterval(t);
  }, [selectedRun, selectedRunId]);

  // ── Build activeNodes map for DAGCanvas ───────────────────────────────────
  const activeNodes = new Map();
  if (selectedRun?.nodes) {
    for (const n of selectedRun.nodes) {
      activeNodes.set(n.nodeId, n);
    }
  }

  // ── Run header info ───────────────────────────────────────────────────────
  const runStatusColor = {
    completed: 'text-emerald-400',
    failed:    'text-red-400',
    running:   'text-brand-400',
  }[selectedRun?.status] || 'text-[var(--text-muted)]';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600/20 border border-brand-600/30
                          flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-700 text-[var(--text-primary)]">
              Graph Monitor
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              LangGraph-style AI workflow activity
              {lastRefresh && ` · refreshed ${lastRefresh.toLocaleTimeString()}`}
            </p>
          </div>
        </div>
        <button onClick={() => loadAll()} className="btn-ghost text-xs">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Main panel: run list + DAG + traces */}
      <div className="grid grid-cols-[220px_1fr] gap-4 min-h-[520px]">

        {/* ── Run list sidebar ─────────────────────────────────────────── */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p className="label text-[10px]">Run History</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="w-4 h-4 animate-spin text-[var(--text-muted)]" />
            </div>
          ) : (
            <RunList
              runs={runs}
              selectedRunId={selectedRunId}
              onSelect={setSelectedRunId}
            />
          )}
        </div>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* DAG visualisation */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="label">
                Workflow DAG — {definition?.name || 'compliance-audit'}
              </p>
              {selectedRun && (
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${runStatusColor}`}>
                    {selectedRun.status?.toUpperCase()}
                  </span>
                  {selectedRun.durationMs && (
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {selectedRun.durationMs}ms total
                    </span>
                  )}
                </div>
              )}
            </div>
            <DAGCanvas definition={definition} activeNodes={activeNodes} />
          </div>

          {/* Selected run info */}
          {selectedRun && (
            <div className="card p-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="label text-[10px] mb-1">Run ID</p>
                  <p className="font-mono text-[var(--text-primary)]">
                    {selectedRun.runId?.slice(0, 12)}…
                  </p>
                </div>
                <div>
                  <p className="label text-[10px] mb-1">Video</p>
                  <p className="font-mono text-[var(--text-muted)] truncate">
                    {selectedRun.videoId || '—'}
                  </p>
                </div>
                <div>
                  <p className="label text-[10px] mb-1">Started</p>
                  <p className="font-mono text-[var(--text-muted)]">
                    {selectedRun.startedAt
                      ? new Date(selectedRun.startedAt).toLocaleTimeString()
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="label text-[10px] mb-1">Compliance</p>
                  <p className={`font-semibold ${
                    selectedRun.finalStatus === 'PASS' ? 'text-emerald-400'
                    : selectedRun.finalStatus === 'FAIL' ? 'text-red-400'
                    : 'text-[var(--text-muted)]'
                  }`}>
                    {selectedRun.finalStatus || '—'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Node traces */}
          <div>
            <p className="label mb-3">Node Execution Traces</p>
            <NodeTracePanel nodes={selectedRun?.nodes || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
