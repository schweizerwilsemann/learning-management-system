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

// Load token from localStorage on client side
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('jwt_token');
  if (storedToken) {
    bearerToken = storedToken;
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
    const err = error;
    let message = 'Unknown error';
    
    // Handle 401 Unauthorized - token might be expired
    if (err?.response?.status === 401) {
      // Clear token from localStorage and memory
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt_token');
      }
      bearerToken = null;
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    
    if (err?.response?.data) {
      if (typeof err.response.data === 'string') {
        message = err.response.data;
      } else if (err.response.data.message) {
        message = err.response.data.message;
      } else if (err.response.data.error) {
        message = err.response.data.error;
      } else {
        message = JSON.stringify(err.response.data);
      }
    } else if (err.message) {
      message = err.message;
    }
    
    console.error('API Error:', {
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      url: err?.config?.url,
      message: message
    });
    
    return Promise.reject(new Error(message));
  }
);

export default api;
