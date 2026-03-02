import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Audit endpoints ───────────────────────────────────────────────────────────

export const auditApi = {
  /** Start a new compliance audit */
  start: (videoUrl) => api.post('/audit', { videoUrl }),

  /** Poll job status */
  status: (sessionId) => api.get(`/audit/${sessionId}`),

  /** Get last 50 jobs */
  history: () => api.get('/audit/history'),
};

// ── Document endpoints ────────────────────────────────────────────────────────

export const documentApi = {
  list:  () => api.post('/documents'),
  index: () => api.post('/documents/index'),
};

// ── Health endpoint ───────────────────────────────────────────────────────────

export const healthApi = {
  check: () => axios.get('/health'),
};

export default api;
