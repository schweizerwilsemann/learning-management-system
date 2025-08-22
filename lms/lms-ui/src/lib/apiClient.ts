import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_APP_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let bearerToken: string | null = null;

export function setBearerToken(token: string | null) {
  bearerToken = token;
}

// Request interceptor to add Authorization header when token is set
api.interceptors.request.use((config) => {
  if (bearerToken) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${bearerToken}`;
  }
  return config;
});

// Response interceptor to unify error messages
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const err = error;
    const message = err?.response?.data ?? err.message ?? 'Unknown error';
    return Promise.reject(message);
  }
);

export default api;
