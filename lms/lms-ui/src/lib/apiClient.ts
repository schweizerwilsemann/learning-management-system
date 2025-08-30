import axios from 'axios';

// Prefer an explicit API URL. In server-side rendering NEXT_PUBLIC_API_URL should be set
// fallback to NEXT_PUBLIC_APP_URL for legacy reasons. If neither is set, leave base empty
// which makes axios calls use relative paths (useful in many dev setups).
const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_APP_URL || '';

const api = axios.create({
  baseURL: API_BASE || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let bearerToken: string | null = null;

export function setBearerToken(token: string | null) {
  bearerToken = token;
}

// Expose current in-memory bearer token for debugging (do not use in production code)
export function getBearerToken() {
  return bearerToken;
}

// Load token from localStorage on client side only
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {
      bearerToken = storedToken;
    }
  } catch (e) {
    // ignore localStorage errors (e.g., private mode)
  }
}

// Request interceptor to add Authorization header when token is set
api.interceptors.request.use((config) => {
  if (bearerToken) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${bearerToken}`;
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const err = error as any;
    let message = 'Unknown error';

    // Handle 401 Unauthorized - token might be expired
    if (err?.response?.status === 401) {
      // Clear token from localStorage and memory on client only
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.removeItem('jwt_token');
        } catch (e) {
          // ignore
        }
      }
      bearerToken = null;

      // Do not perform a global redirect here. Let the caller decide how to
      // handle 401 (for example, show a banner or redirect after user action).
    }

    if (err?.response?.data) {
      if (typeof err.response.data === 'string') {
        message = err.response.data;
      } else if (err.response.data.message) {
        message = err.response.data.message;
      } else if (err.response.data.error) {
        message = err.response.data.error;
      } else {
        try {
          message = JSON.stringify(err.response.data);
        } catch (e) {
          message = String(err.response.data);
        }
      }
    } else if (err.message) {
      message = err.message;
    }

    // Build a richer log to distinguish network vs HTTP errors
    const logObj: Record<string, unknown> = {
      code: err?.code, // e.g., ECONNREFUSED
      requestPresent: !!err?.request,
      hasResponse: !!err?.response,
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      url: err?.config?.url,
      message,
    };

    // eslint-disable-next-line no-console
    console.error('API Error:', logObj, err?.response?.data ?? err?.toString());

    return Promise.reject(new Error(message));
  }
);

export default api;
