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

  // Fallback to local NestJS backend port 5001
  return 'http://127.0.0.1:5001';
}

export function formatActionError(err: any): string {
  if (err.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')) {
    if (process.env.VERCEL) {
      return 'Backend service is unreachable from Vercel. Please set INTERNAL_BACKEND_URL in your Vercel Project Environment Variables to your live backend URL.';
    }
    return 'Backend server is not running on port 5001. Please start the NestJS backend.';
  }
  return err.message || 'Unable to connect to authentication server.';
}

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
