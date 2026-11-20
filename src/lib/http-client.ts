import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Centralized API Base URL resolver.
 * Defaults to "http://localhost:6000/api".
 * Update via NEXT_PUBLIC_API_URL when deploying to another environment.
 */
export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  if (process.env.INTERNAL_BACKEND_URL) {
    const raw = process.env.INTERNAL_BACKEND_URL.replace(/\/+$/, '');
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }
  if (typeof window === 'undefined' && process.env.VERCEL) {
    return 'https://mercora-v7cx.vercel.app/api';
  }
  return typeof window !== 'undefined' ? '/api' : 'http://localhost:6000/api';
}

/**
 * Returns the backend root origin (without /api suffix).
 * e.g. "http://localhost:6000" or "https://mercora-v7cx.vercel.app"
 */
export function getBackendOrigin(): string {
  const base = getApiBaseUrl();
  return base.replace(/\/api\/?$/, '');
}

/**
 * Standardized Axios client for all server-side and client-side requests.
 * Uses centralized baseURL so individual files never need URL configuration.
 */
export const serverApi: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

/**
 * Formats Axios errors into a user-friendly error string.
 */
export function formatApiError(err: any): string {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<{ message?: string | string[]; error?: string }>;
    if (axiosErr.response?.data?.message) {
      const msg = axiosErr.response.data.message;
      return Array.isArray(msg) ? msg.join(', ') : msg;
    }
    if (axiosErr.response?.data?.error) {
      return axiosErr.response.data.error;
    }
    if (axiosErr.code === 'ECONNREFUSED' || axiosErr.message?.includes('ECONNREFUSED')) {
      return process.env.VERCEL
        ? 'Backend service is unreachable. Please verify NEXT_PUBLIC_API_URL.'
        : 'Backend server is not running on port 6000. Please start the backend.';
    }
  }
  return err?.message || 'An unexpected API error occurred.';
}
