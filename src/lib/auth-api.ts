import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from './store/auth-store';

const API_BASE = '/api/v1/auth';

/**
 * Global Axios instance configured for Mercora Auth APIs
 */
export const authApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach current JWT access token
authApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Silent Token Refresh on 401 & Single-Session Eviction Handling
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

authApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only intercept 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      const store = useAuthStore.getState();
      const refreshToken = store.refreshToken;

      // If no refresh token or already retried, do not loop
      if (!refreshToken || originalRequest.url?.includes('/refresh') || originalRequest.url?.includes('/login')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return authApiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(`${API_BASE}/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
        store.updateTokens(accessToken, newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        processQueue(null, accessToken);

        return authApiClient(originalRequest);
      } catch (refreshErr: any) {
        processQueue(refreshErr, null);

        const errMsg =
          refreshErr.response?.data?.message ||
          'Your session has ended because your account was logged in from another device.';

        store.setEvictionNotice(errMsg);
        store.logout();

        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?reason=displaced';
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ── API Methods using Axios ──────────────────────────────────────────────────

export async function loginUser(email: string, password: string, deviceId?: string) {
  const res = await authApiClient.post('/login', { email, password, deviceId });
  useAuthStore.getState().setAuth(res.data);
  return res.data;
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await authApiClient.post('/register', { name, email, password });
  return res.data;
}

export async function verifyEmail(token: string) {
  const res = await authApiClient.post('/verify-email', { token });
  return res.data;
}

export async function resendVerification(email: string) {
  const res = await authApiClient.post('/resend-verification', { email });
  return res.data;
}

export async function requestPasswordReset(email: string) {
  const res = await authApiClient.post('/forgot-password', { email });
  return res.data;
}

export async function completePasswordReset(token: string, password: string) {
  const res = await authApiClient.post('/reset-password', { token, password });
  return res.data;
}

export async function getMe() {
  const res = await authApiClient.get('/me');
  return res.data;
}

export async function logoutUser() {
  try {
    await authApiClient.post('/logout');
  } finally {
    useAuthStore.getState().logout();
  }
}
