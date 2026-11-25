import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

let refreshPromise: Promise<boolean> | null = null;

async function refreshHttpOnlySession(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!refreshPromise) {
    refreshPromise = fetch('/api/auth/session', {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Attaches a transparent 401 retry using `/api/auth/session` (httpOnly refresh cookie)
 * to client-side Axios instances so 15-minute access token expirations rotate silently.
 */
export function attachSessionRefreshInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
      if (
        error.response?.status === 401 &&
        original &&
        !original._retried &&
        typeof window !== 'undefined' &&
        !original.url?.includes('/auth/')
      ) {
        original._retried = true;
        const refreshed = await refreshHttpOnlySession();
        if (refreshed) {
          return instance(original);
        }
      }
      return Promise.reject(error);
    },
  );
}
