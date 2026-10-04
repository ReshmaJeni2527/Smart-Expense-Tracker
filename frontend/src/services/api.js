import axios from 'axios';

export const TOKEN_KEY = 'spendwise_token';
export const NETWORK_MESSAGE = 'Unable to load your financial data. Please try again.';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((r) => r, (err) => {
  const isAuthCall = err.config?.url?.startsWith('/auth/login') || err.config?.url?.startsWith('/auth/register');
  if (err.response?.status === 401 && !isAuthCall) {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event('spendwise:logout'));
  }
  return Promise.reject(err);
});

// Server-provided message when available, otherwise a clear "can't reach API" message. Never pretends an action worked.
export const errorMessage = (err) => err.response?.data?.message || NETWORK_MESSAGE;
export const fieldErrors = (err) => err.response?.data?.errors || {};

export const authApi = {
  login: (d) => api.post('/auth/login', d).then((r) => r.data),
  register: (d) => api.post('/auth/register', d).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data.user),
  update: (d) => api.put('/auth/me', d).then((r) => r.data.user),
};
export const transactionApi = {
  list: (params) => api.get('/transactions', { params }).then((r) => r.data),
  create: (d) => api.post('/transactions', d).then((r) => r.data),
  update: (id, d) => api.put(`/transactions/${id}`, d).then((r) => r.data),
  remove: (id) => api.delete(`/transactions/${id}`).then((r) => r.data),
};
export const categoryApi = {
  list: () => api.get('/categories').then((r) => r.data),
  create: (d) => api.post('/categories', d).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};
export const dashboardApi = {
  summary: () => api.get('/dashboard/summary').then((r) => r.data),
};
export const settingsApi = {
  reset: () => api.delete('/settings/data').then((r) => r.data),
};
export default api;
