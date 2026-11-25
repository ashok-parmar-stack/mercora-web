import { NextResponse } from 'next/server';
import axios from 'axios';
import {
  clearAuthCookies,
  getInternalBackendUrl,
  getServerAuth,
  setAuthCookies,
} from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/session
 * Verifies current session via backend `/v1/auth/me` and transparently refreshes
 * httpOnly auth cookies when needed. Never trusts client-readable `mercora_user` alone.
 */
export async function GET() {
  const { accessToken, refreshToken } = await getServerAuth();
  if (!accessToken && !refreshToken) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const backendUrl = getInternalBackendUrl();
  let token = accessToken;

  try {
    if (token) {
      const meRes = await axios.get(`${backendUrl}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });
      if (meRes.status === 200 && meRes.data?.user) {
        return NextResponse.json({ authenticated: true, user: meRes.data.user });
      }
    }

    if (refreshToken) {
      const refreshRes = await axios.post(
        `${backendUrl}/api/v1/auth/refresh`,
        { refreshToken },
        { validateStatus: () => true },
      );

      if (refreshRes.status === 200 && refreshRes.data?.accessToken) {
        token = refreshRes.data.accessToken;
        const meRes = await axios.get(`${backendUrl}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: () => true,
        });

        if (meRes.status === 200 && meRes.data?.user) {
          await setAuthCookies(
            refreshRes.data.accessToken,
            refreshRes.data.refreshToken,
            meRes.data.user,
          );
          return NextResponse.json({ authenticated: true, user: meRes.data.user });
        }
      }
    }
  } catch (error) {
    console.error('[GET /api/auth/session] Verification failed:', error);
  }

  await clearAuthCookies();
  return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
}

/**
 * POST /api/auth/session
 * Refreshes httpOnly session cookies using the stored refresh token.
 */
export async function POST() {
  const { refreshToken } = await getServerAuth();
  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: 'No active refresh token found.' },
      { status: 401 },
    );
  }

  const backendUrl = getInternalBackendUrl();
  try {
    const refreshRes = await axios.post(
      `${backendUrl}/api/v1/auth/refresh`,
      { refreshToken },
      { validateStatus: () => true },
    );

    if (refreshRes.status !== 200 || !refreshRes.data?.accessToken) {
      await clearAuthCookies();
      return NextResponse.json(
        {
          success: false,
          message: refreshRes.data?.message || 'Session expired. Please sign in again.',
        },
        { status: 401 },
      );
    }

    const meRes = await axios.get(`${backendUrl}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${refreshRes.data.accessToken}` },
      validateStatus: () => true,
    });

    if (meRes.status !== 200 || !meRes.data?.user) {
      await clearAuthCookies();
      return NextResponse.json(
        { success: false, message: 'Unable to validate user session.' },
        { status: 401 },
      );
    }

    await setAuthCookies(
      refreshRes.data.accessToken,
      refreshRes.data.refreshToken,
      meRes.data.user,
    );

    return NextResponse.json({ success: true, user: meRes.data.user });
  } catch (error: any) {
    console.error('[POST /api/auth/session] Refresh error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to refresh authentication session.' },
      { status: 500 },
    );
  }
}
