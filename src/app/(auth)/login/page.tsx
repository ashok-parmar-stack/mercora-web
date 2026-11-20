'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { loginServerAction } from '@/app/actions/auth-actions';
import { useAuthStore } from '@/lib/store/auth-store';
import { LoadingSpinner, LogoLoader } from '@/components/ui/Loading';
import { LoginFormAlerts } from './components/LoginFormAlerts';

/* ── Zod Validation Schema ─────────────────────────────────────────────── */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

type LoginFieldErrors = {
  email?: string;
  password?: string;
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { evictionNotice, setEvictionNotice, initialize, setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const isDisplaced = searchParams.get('reason') === 'displaced' || !!evictionNotice;
  const verifiedNotice = searchParams.get('verified') === 'true';

  const validateField = (field: 'email' | 'password', value: string) => {
    const testData = { email, password, [field]: value };
    const result = loginSchema.safeParse(testData);
    if (!result.success) {
      const issues = result.error.flatten().fieldErrors;
      setFieldErrors((prev) => ({ ...prev, [field]: issues[field]?.[0] }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const flattened = validationResult.error.flatten().fieldErrors;
      setFieldErrors({ email: flattened.email?.[0], password: flattened.password?.[0] });
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const res = await loginServerAction({
        email: validationResult.data.email,
        password: validationResult.data.password,
        deviceId: `web-${typeof navigator !== 'undefined' ? navigator.platform : 'browser'}`,
      });

      if (!res.success) throw new Error(res.error || 'Invalid credentials or login failed.');

      setAuth(res.data);
      setEvictionNotice(null);
      const redirectPath = searchParams.get('redirect') || '/dashboard';
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-3.5 sm:mb-4 text-center">
        <h1
          className="text-xl sm:text-2xl font-extrabold tracking-[-0.03em] mb-1 font-jakarta"
          style={{ color: 'var(--theme-ink-darkest)', lineHeight: 1.2 }}
        >
          Welcome back
        </h1>
        <p className="text-xs font-work" style={{ color: 'var(--theme-gray-600)', lineHeight: 1.5 }}>
          Your listings, contacts & market intel — just where you left them.
        </p>
      </div>

      <LoginFormAlerts
        isDisplaced={isDisplaced}
        evictionNotice={evictionNotice}
        verifiedNotice={verifiedNotice}
        error={error}
      />

      <form className="space-y-3 sm:space-y-3.5 font-rethink" onSubmit={handleSubmit} noValidate>
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold mb-1 font-rethink"
            style={{ color: 'var(--theme-ink-darkest)' }}
          >
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) validateField('email', e.target.value); }}
            onBlur={(e) => validateField('email', e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            className="block w-full px-3.5 py-2.5 rounded-xl text-sm font-rethink transition-all focus:outline-none"
            style={{
              background: fieldErrors.email ? 'var(--theme-error-bg)' : 'var(--theme-gray-50)',
              border: `1.5px solid ${fieldErrors.email ? 'var(--theme-error)' : 'var(--theme-warm-line)'}`,
              color: 'var(--theme-ink-darkest)',
              boxShadow: fieldErrors.email ? '0 0 0 3px rgba(238,49,53,0.08)' : undefined,
            }}
          />
          {fieldErrors.email && (
            <div className="flex items-center gap-1.5 mt-1 text-xs font-rethink" style={{ color: 'var(--theme-error)' }}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.email}</span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-xs font-semibold mb-1 font-rethink"
            style={{ color: 'var(--theme-ink-darkest)' }}
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) validateField('password', e.target.value); }}
              onBlur={(e) => validateField('password', e.target.value)}
              placeholder="Min 8 characters"
              autoComplete="current-password"
              className="block w-full pl-3.5 pr-11 py-2.5 rounded-xl text-sm font-rethink transition-all focus:outline-none"
              style={{
                background: fieldErrors.password ? 'var(--theme-error-bg)' : 'var(--theme-gray-50)',
                border: `1.5px solid ${fieldErrors.password ? 'var(--theme-error)' : 'var(--theme-warm-line)'}`,
                color: 'var(--theme-ink-darkest)',
                boxShadow: fieldErrors.password ? '0 0 0 3px rgba(238,49,53,0.08)' : undefined,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors cursor-pointer"
              style={{ color: 'var(--theme-gray-400)' }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <div className="flex items-center gap-1.5 mt-1 text-xs font-rethink" style={{ color: 'var(--theme-error)' }}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.password}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none font-rethink">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded cursor-pointer"
              style={{ accentColor: 'var(--theme-red)' }}
            />
            <span className="text-xs font-medium font-rethink" style={{ color: 'var(--theme-gray-700)' }}>
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-bold font-rethink transition-colors"
            style={{ color: 'var(--theme-red)' }}
          >
            Forgot password?
          </Link>
        </div>

        <div className="pt-1">
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn-red font-rethink w-full justify-center py-2.5 sm:py-3 rounded-xl text-xs tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" variant="white" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>SIGN IN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-3.5 pt-3 text-center" style={{ borderTop: '1px solid var(--theme-warm-line)' }}>
        <p className="text-xs font-work" style={{ color: 'var(--theme-gray-500)' }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-bold font-rethink transition-colors ml-1"
            style={{ color: 'var(--theme-red)' }}
          >
            Create a free account →
          </Link>
        </p>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[300px] flex items-center justify-center">
          <LogoLoader size="md" dark={false} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
