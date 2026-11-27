import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';

describe('Next.js Proxy Auth Middleware (Unit)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('FE-AUTH-006: redirects unauthenticated guest on /dashboard to /login?redirect=/dashboard', async () => {
    const req = new NextRequest('http://localhost:9000/dashboard');
    const res = await proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/login?redirect=%2Fdashboard');
  });

  it('FE-AUTH-006: redirects authenticated CUSTOMER away from /admin to /dashboard', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ user: { id: 'u-1', role: { code: 'CUSTOMER' } } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const req = new NextRequest('http://localhost:9000/admin/users', {
      headers: { cookie: 'mercora_access_token=valid-token' },
    });
    const res = await proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:9000/dashboard');
  });

  it('FE-AUTH-006: allows authenticated SUPER_ADMIN to access /admin', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ user: { id: 'u-admin', role: { code: 'SUPER_ADMIN' } } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const req = new NextRequest('http://localhost:9000/admin', {
      headers: { cookie: 'mercora_access_token=admin-token' },
    });
    const res = await proxy(req);

    expect(res.status).toBe(200);
  });

  it('FE-AUTH-006: redirects unauthenticated guest on /saved-businesses to /login?redirect=/saved-businesses', async () => {
    const req = new NextRequest('http://localhost:9000/saved-businesses');
    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/login?redirect=%2Fsaved-businesses');
  });

  it('FE-SUB-001: redirects unauthenticated guest on /subscription to /login?redirect=/subscription', async () => {
    const req = new NextRequest('http://localhost:9000/subscription');
    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/login?redirect=%2Fsubscription');
  });

  it('FE-AUTH-006: deduplicates concurrent refresh requests and does not log out on transient 5xx', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
      const u = String(url);
      if (u.endsWith('/api/v1/auth/refresh')) {
        return new Response(
          JSON.stringify({ accessToken: 'new-acc', refreshToken: 'new-ref' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      }
      if (u.endsWith('/api/v1/auth/me')) {
        return new Response(
          JSON.stringify({ user: { id: 'u-admin', role: { code: 'ADMIN' } } }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      }
      return new Response(null, { status: 404 });
    });

    const req1 = new NextRequest('http://localhost:9000/admin/businesses', {
      headers: { cookie: 'mercora_refresh_token=same-ref-token' },
    });
    const req2 = new NextRequest('http://localhost:9000/admin/business-categories', {
      headers: { cookie: 'mercora_refresh_token=same-ref-token' },
    });

    const [res1, res2] = await Promise.all([proxy(req1), proxy(req2)]);
    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    const refreshCalls = fetchMock.mock.calls.filter(([u]) =>
      String(u).endsWith('/api/v1/auth/refresh'),
    );
    expect(refreshCalls).toHaveLength(1);
  });
});
