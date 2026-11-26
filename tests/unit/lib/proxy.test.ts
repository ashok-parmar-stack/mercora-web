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
});
