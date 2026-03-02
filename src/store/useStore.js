import { create } from 'zustand';
import { auditApi } from '../services/api';

const useStore = create((set, get) => ({
  // ── Active job ────────────────────────────────────────────────────────────
  activeJob:     null,
  pollingTimer:  null,

  // ── History ───────────────────────────────────────────────────────────────
  history: [],

  // ── UI state ──────────────────────────────────────────────────────────────
  sidebarOpen: true,

  // ── Actions ───────────────────────────────────────────────────────────────

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  /**
   * Start an audit job and begin polling.
   */
  startAudit: async (videoUrl) => {
    const { data } = await auditApi.start(videoUrl);
    const job = { sessionId: data.sessionId, videoId: data.videoId, status: 'queued', progress: 0 };
    set({ activeJob: job });

    // Start polling
    const timer = setInterval(async () => {
      try {
        const { data: status } = await auditApi.status(job.sessionId);
        set({ activeJob: status });

        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(get().pollingTimer);
          set({ pollingTimer: null });
          get().fetchHistory();
        }
      } catch {
        clearInterval(get().pollingTimer);
      }
    }, 3000);

    set({ pollingTimer: timer });
    return data.sessionId;
  },

  clearActiveJob: () => {
    const { pollingTimer } = get();
    if (pollingTimer) clearInterval(pollingTimer);
    set({ activeJob: null, pollingTimer: null });
  },

  fetchHistory: async () => {
    try {
      const { data } = await auditApi.history();
      set({ history: data.jobs || [] });
    } catch {
      // silently fail
    }
  },

  loadJob: async (sessionId) => {
    const { data } = await auditApi.status(sessionId);
    set({ activeJob: data });
  },
}));

export default useStore;
