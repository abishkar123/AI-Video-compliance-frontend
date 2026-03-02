import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 15_000 });

export const graphApi = {
  definition: ()        => api.get('/graph/definition'),
  runs:       (limit)   => api.get(`/graph/runs?limit=${limit || 50}`),
  run:        (runId)   => api.get(`/graph/runs/${runId}`),
  stats:      ()        => api.get('/graph/stats'),
};

export default graphApi;
