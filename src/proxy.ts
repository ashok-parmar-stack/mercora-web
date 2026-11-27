import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getInternalBackendUrl } from '@/app/actions/action-helpers';
import { isAdminRole } from '@/lib/auth-helpers';

const PROTECTED_PREFIXES = ['/dashboard', '/admin', '/profile', '/enquiries', '/saved-businesses', '/subscription'];
const ADMIN_PREFIXES = ['/admin'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

const COOKIE_ACCESS_TOKEN = 'mercora_access_token';
const COOKIE_REFRESH_TOKEN = 'mercora_refresh_token';
const COOKIE_USER = 'mercora_user';

interface VerifiedSession {
  authenticated: boolean;
  user: any | null;
  transientError?: boolean;
  refreshedTokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

// Deduplicate concurrent refresh-token rotations across parallel Next.js page/RSC requests
const inFlightProxyRefreshes = new Map<string, Promise<VerifiedSession>>();

async function performBackendRefresh(
  backendUrl: string,
  refreshToken: string,
): Promise<VerifiedSession> {
  try {
    const refreshRes = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (refreshRes.ok) {
      const refreshed = await refreshRes.json();
      if (refreshed?.accessToken) {
        const meRes = await fetch(`${backendUrl}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${refreshed.accessToken}` },
          cache: 'no-store',
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData?.user) {
            return {
              authenticated: true,
              user: meData.user,
              refreshedTokens: {
                accessToken: refreshed.accessToken,
                refreshToken: refreshed.refreshToken,
              },
            };
          }
        }
      }
    }

    if (refreshRes.status >= 500) {
      return { authenticated: false, user: null, transientError: true };
    }
    return { authenticated: false, user: null };
  } catch (err) {
    console.error('[Proxy Auth] Refresh verification failed:', err);
    return { authenticated: false, user: null, transientError: true };
  }
}

async function verifySessionWithBackend(
  accessToken?: string,
  refreshToken?: string,
): Promise<VerifiedSession> {
  if (!accessToken && !refreshToken) {
    return { authenticated: false, user: null };
  }

  const backendUrl = getInternalBackendUrl();

  try {
    if (accessToken) {
      const meRes = await fetch(`${backendUrl}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      });
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData?.user) {
          return { authenticated: true, user: meData.user };
        }
      }
      if (meRes.status >= 500 && !refreshToken) {
        return { authenticated: false, user: null, transientError: true };
      }
    }

    if (refreshToken) {
      let pending = inFlightProxyRefreshes.get(refreshToken);
      if (!pending) {
        pending = performBackendRefresh(backendUrl, refreshToken).finally(() => {
          inFlightProxyRefreshes.delete(refreshToken);
        });
        inFlightProxyRefreshes.set(refreshToken, pending);
      }
      return await pending;
    }
  } catch (err) {
    const reason =
      err instanceof Error
        ? (err as Error & { cause?: { code?: string } }).cause?.code || err.message
        : String(err);
    console.warn(`[Proxy Auth] Backend session check unreachable (${backendUrl}): ${reason}`);
    return { authenticated: false, user: null, transientError: true };
  }

  return { authenticated: false, user: null };
}

function isRequestHttps(request: NextRequest): boolean {
  return (
    request.nextUrl.protocol === 'https:' ||
    request.headers.get('x-forwarded-proto') === 'https'
  );
}

function applyRefreshedCookies(
  res: NextResponse,
  session: VerifiedSession,
  isSecure: boolean,
): NextResponse {
  if (!session.refreshedTokens) return res;

  res.cookies.set(COOKIE_ACCESS_TOKEN, session.refreshedTokens.accessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  });
  res.cookies.set(COOKIE_REFRESH_TOKEN, session.refreshedTokens.refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
  if (session.user) {
    res.cookies.set(COOKIE_USER, JSON.stringify(session.user), {
      httpOnly: false,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });
  }
  return res;
}

function clearCookiesOnResponse(res: NextResponse): NextResponse {
  res.cookies.delete(COOKIE_ACCESS_TOKEN);
  res.cookies.delete(COOKIE_REFRESH_TOKEN);
  res.cookies.delete(COOKIE_USER);
  return res;
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
    const refreshToken = request.cookies.get(COOKIE_REFRESH_TOKEN)?.value;

    const isAuthRoute = AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
    const isProtected = PROTECTED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
    const isAdminRoute = ADMIN_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

    const isSecure = isRequestHttps(request);
    // Always verify live httpOnly tokens against backend (never trust client mercora_user alone)
    const session = await verifySessionWithBackend(accessToken, refreshToken);

    if (isAuthRoute) {
      if (session.authenticated) {
        const defaultTarget = isAdminRole(session.user) ? '/admin' : '/dashboard';
        const rawRedirect = request.nextUrl.searchParams.get('redirect');
        const safeRedirect =
          rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') && !rawRedirect.includes('\\')
            ? rawRedirect
            : defaultTarget;
        return applyRefreshedCookies(
          NextResponse.redirect(new URL(safeRedirect, request.url)),
          session,
          isSecure,
        );
      }
      return NextResponse.next();
    }

    if (isProtected && !session.authenticated) {
      if (session.transientError && (accessToken || refreshToken)) {
        // Do not wipe valid session cookies on transient backend/network errors
        return NextResponse.next();
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return clearCookiesOnResponse(NextResponse.redirect(loginUrl));
    }

    if (isAdminRoute && !isAdminRole(session.user)) {
      return applyRefreshedCookies(
        NextResponse.redirect(new URL('/dashboard', request.url)),
        session,
        isSecure,
      );
    }

    return applyRefreshedCookies(NextResponse.next(), session, isSecure);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/profile',
    '/profile/:path*',
    '/enquiries',
    '/enquiries/:path*',
    '/saved-businesses',
    '/saved-businesses/:path*',
    '/subscription',
    '/subscription/:path*',
    '/admin',
    '/admin/:path*',
    '/login',
    '/login/:path*',
    '/register',
    '/register/:path*',
    '/forgot-password',
    '/forgot-password/:path*',
    '/reset-password',
    '/reset-password/:path*',
  ],
};

export const middleware = proxy;
export default proxy;
