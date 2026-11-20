import { cookies } from 'next/headers';

export function getInternalBackendUrl(): string {
  const sanitize = (val?: string) => val?.replace(/^["']|["']$/g, '').trim();

  const internal = sanitize(process.env.INTERNAL_BACKEND_URL);
  if (internal && /^https?:\/\//i.test(internal)) {
    return internal.replace(/\/+$/, '');
  }

  const publicApi = sanitize(process.env.NEXT_PUBLIC_API_URL);
  if (publicApi && /^https?:\/\//i.test(publicApi)) {
    return publicApi.replace(/\/api\/?$/i, '').replace(/\/+$/, '');
  }

  return 'http://127.0.0.1:5001';
}

export const COOKIE_ACCESS_TOKEN = 'mercora_access_token';
export const COOKIE_REFRESH_TOKEN = 'mercora_refresh_token';
export const COOKIE_USER = 'mercora_user';

export interface ServerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: { id: string; name: string; code: string } | string;
  companyId?: string;
  isEmailVerified: boolean;
}

export interface ServerAuthData {
  user: ServerUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

/**
 * Retrieve current authentication status on the server side using httpOnly cookies
 */
export async function getServerAuth(): Promise<ServerAuthData> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value || null;
  const refreshToken = cookieStore.get(COOKIE_REFRESH_TOKEN)?.value || null;
  const userCookie = cookieStore.get(COOKIE_USER)?.value || null;

  let user: ServerUser | null = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch {
      user = null;
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: Boolean(accessToken || refreshToken),
  };
}

/**
 * Persist tokens & user in secure httpOnly cookies
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  user: ServerUser,
): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';

  // Access Token (15 min)
  cookieStore.set(COOKIE_ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60, // 15 minutes
  });

  // Refresh Token (30 days)
  cookieStore.set(COOKIE_REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  // Non-sensitive user summary
  cookieStore.set(COOKIE_USER, JSON.stringify(user), {
    httpOnly: false, // Accessible to client components for instant greeting
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
}

/**
 * Clear all auth cookies on logout or session displacement
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_ACCESS_TOKEN);
  cookieStore.delete(COOKIE_REFRESH_TOKEN);
  cookieStore.delete(COOKIE_USER);
}

import axios from 'axios';

/**
 * Server-to-Server Axios utility forwarding authentication cookies to NestJS backend
 */
export async function serverApiFetch<T = any>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?: any;
    params?: any;
    headers?: Record<string, string>;
  } = {},
): Promise<{ data: T | null; error: string | null; status: number }> {
  const { accessToken, refreshToken } = await getServerAuth();

  const backendUrl = getInternalBackendUrl();
  const url = `${backendUrl}/api${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const res = await axios({
      url,
      method: options.method || 'GET',
      data: options.data,
      params: options.params,
      headers,
      validateStatus: () => true, // Handle status code manually
    });

    // Attempt server-side refresh if access token expired
    if (res.status === 401 && refreshToken) {
      const refreshRes = await axios.post(
        `${backendUrl}/api/v1/auth/refresh`,
        { refreshToken },
        { validateStatus: () => true },
      );

      if (refreshRes.status === 200) {
        const refreshed = refreshRes.data;
        const current = await getServerAuth();
        if (current.user) {
          await setAuthCookies(refreshed.accessToken, refreshed.refreshToken, current.user);
        }

        // Retry original request with new token
        headers['Authorization'] = `Bearer ${refreshed.accessToken}`;
        const retryRes = await axios({
          url,
          method: options.method || 'GET',
          data: options.data,
          params: options.params,
          headers,
          validateStatus: () => true,
        });

        if (retryRes.status >= 400) {
          return {
            data: null,
            error: retryRes.data?.message || `Request failed with status ${retryRes.status}`,
            status: retryRes.status,
          };
        }

        return {
          data: retryRes.data,
          error: null,
          status: retryRes.status,
        };
      } else {
        // Session revoked or displaced: clear cookies
        await clearAuthCookies();
        return {
          data: null,
          error: refreshRes.data?.message || 'Session expired or invalidated by new login.',
          status: 401,
        };
      }
    }

    if (res.status >= 400) {
      return {
        data: null,
        error: res.data?.message || `Request failed with status ${res.status}`,
        status: res.status,
      };
    }

    return {
      data: res.data,
      error: null,
      status: res.status,
    };
  } catch (err: any) {
    const errorMsg =
      err.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')
        ? (process.env.VERCEL
            ? 'Backend API is unreachable. Please set INTERNAL_BACKEND_URL in Vercel project environment variables to point to your live backend server.'
            : 'Backend server is not running on port 5001. Please start the NestJS backend.')
        : err.message || 'Server-to-server connection error';
    return {
      data: null,
      error: errorMsg,
      status: 500,
    };
  }
}

/**
 * Fetch authenticated profile from server side
 */
export async function getServerMe() {
  return serverApiFetch('/v1/auth/me');
}
