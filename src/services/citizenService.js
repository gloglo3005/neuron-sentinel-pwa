import { apiFetch } from '../api/client';

export const citizenService = {
  register: (name, phone, password) =>
    apiFetch('/citizen/auth/register', { method: 'POST', body: JSON.stringify({ name, phone, password }) }),
  login: (phone, password) =>
    apiFetch('/citizen/auth/login', { method: 'POST', body: JSON.stringify({ phone, password }) }),
  me: () => apiFetch('/citizen/auth/me'),

  updateLocation: (latitude, longitude) =>
    apiFetch('/citizen/location', { method: 'POST', body: JSON.stringify({ latitude, longitude }) }),
  getCurrentZone: () => apiFetch('/citizen/zone/current'),
  getAlerts: () => apiFetch('/citizen/alerts'),
  acknowledgeAlert: (alertId) =>
    apiFetch(`/citizen/alerts/${encodeURIComponent(alertId)}/acknowledge`, { method: 'POST' }),

  createReport: (report) =>
    apiFetch('/citizen/reports', { method: 'POST', body: JSON.stringify(report) }),
  getMyReports: () => apiFetch('/citizen/reports/mine'),
};