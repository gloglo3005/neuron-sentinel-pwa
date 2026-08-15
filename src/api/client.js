// Thin fetch wrapper around the Neuron Sentinel backend's citizen API
// (/api/citizen/*). Same backend as the authority dashboard (see
// backend/src/routes/citizenRoutes.js) — this app never talks to
// OpenWeather/OSM/etc. directly, only ever to this one API.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'ns_citizen_token';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getToken() {
  return typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
}

export function setToken(token) {
  if (typeof localStorage === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...(options.headers || {}),
      },
    });
  } catch (err) {
    throw new ApiError(`Backend injoignable (${err.message})`, 0);
  }

  if (!res.ok) {
    let message = `Erreur API (${res.status})`;
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      // not JSON — keep generic message
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return null;
  return res.json();
}
