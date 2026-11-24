import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/admin'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get('mercora_access_token')?.value;
    const refreshToken = request.cookies.get('mercora_refresh_token')?.value;
    const userCookie = request.cookies.get('mercora_user')?.value;
    const isAuthenticated = Boolean(accessToken || refreshToken || userCookie);

    // 1. Guard Auth Routes (Authenticated users must NOT access login, register, forgot-password, reset-password)
    const isAuthRoute = AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (isAuthenticated && isAuthRoute) {
      const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/admin';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // 2. Guard Protected Routes (Only redirect if completely unauthenticated)
    const isProtected = PROTECTED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

    const hasRedirectParam = request.nextUrl.searchParams.has('redirect');

    if (isProtected && !isAuthenticated && !hasRedirectParam) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
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
