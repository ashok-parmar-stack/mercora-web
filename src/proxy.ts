import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/admin'];
const AUTH_ROUTES = ['/login', '/register'];

export function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get('mercora_access_token')?.value;
    const refreshToken = request.cookies.get('mercora_refresh_token')?.value;
    const userCookie = request.cookies.get('mercora_user')?.value;
    const isAuthenticated = Boolean(accessToken || refreshToken || userCookie);

    // 1. Guard Protected Routes (only redirect if completely unauthenticated)
    const isProtected = PROTECTED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

    // If already on or navigating with redirect query, do not loop
    const hasRedirectParam = request.nextUrl.searchParams.has('redirect');

    if (isProtected && !isAuthenticated && !hasRedirectParam) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware proxy error:', error);
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
    '/register',
  ],
};

export const middleware = proxy;
export default proxy;
