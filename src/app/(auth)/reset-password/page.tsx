'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2, AlertTriangle, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { resetPasswordServerAction } from '@/app/actions/auth-actions';
import { LoadingSpinner, LogoLoader } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetFieldErrors = {
  password?: string;
  confirmPassword?: string;
};

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ResetFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateField = (field: 'password' | 'confirmPassword', value: string) => {
    const testData = { password, confirmPassword, [field]: value };
    const res = resetPasswordSchema.safeParse(testData);
    if (!res.success) {
      const issues = res.error.flatten().fieldErrors;
      setFieldErrors((prev) => ({ ...prev, [field]: issues[field]?.[0] }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Missing or invalid reset token. Please request a new reset link.');
      return;
    }

    const validation = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!validation.success) {
      const issues = validation.error.flatten().fieldErrors;
      setFieldErrors({
        password: issues.password?.[0],
        confirmPassword: issues.confirmPassword?.[0],
      });
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const res = await resetPasswordServerAction(token, validation.data.password);
      if (!res.success) throw new Error(res.error || 'Password reset failed. Link may have expired.');
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError?: string, disabled?: boolean): React.CSSProperties => ({
    background: disabled ? 'var(--theme-gray-100)' : hasError ? 'var(--theme-error-bg)' : 'var(--theme-gray-50)',
    border: `1.5px solid ${hasError ? 'var(--theme-error)' : 'var(--theme-warm-line)'}`,
    color: 'var(--theme-ink-darkest)',
    boxShadow: hasError ? '0 0 0 3px rgba(238,49,53,0.08)' : undefined,
    cursor: disabled ? 'not-allowed' : undefined,
  });

  return (
    <>
      {/* Heading */}
      <div className="mb-7">
        <h1
          className="text-[2rem] font-extrabold tracking-[-0.03em] mb-2 font-jakarta"
          style={{ color: 'var(--theme-ink-darkest)', lineHeight: 1.1 }}
        >
          {success ? 'Password updated' : 'Set new password'}
        </h1>
        <p className="text-sm font-work" style={{ color: 'var(--theme-gray-600)', lineHeight: 1.65 }}>
          {success
            ? 'All active sessions have been revoked. Redirecting...'
            : 'Create a strong new password for your Mercora account.'}
        </p>
      </div>

      {success ? (
        <div className="space-y-5">
          <div
            className="p-5 rounded-2xl flex items-start gap-4 text-sm leading-relaxed"
            style={{
              background: 'var(--theme-success-bg)',
              border: '1px solid var(--theme-success-border)',
              color: 'var(--theme-success)',
            }}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block mb-1">Password Updated!</strong>
              All active device sessions have been revoked for security. Redirecting to sign in...
            </div>
          </div>
          <Link
            href="/login"
            className="btn-red w-full justify-center py-3.5 rounded-xl text-xs tracking-widest"
          >
            Sign In Now
          </Link>
        </div>
      ) : (
        <>
          {/* Missing token warning */}
          {!token && (
            <div
              className="mb-5 p-3.5 rounded-xl flex items-start gap-3 text-xs leading-relaxed"
              style={{
                background: 'var(--theme-warning-bg)',
                border: '1px solid var(--theme-warning-border)',
                color: 'var(--theme-warning)',
              }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>Invalid or expired reset link. Please{' '}
                <Link href="/forgot-password" className="font-bold underline">request a new one</Link>.
              </div>
            </div>
          )}

          {error && (
            <div
              className="mb-5 p-3.5 rounded-xl flex items-start gap-3 text-xs leading-relaxed animate-in fade-in duration-200"
              style={{
                background: 'var(--theme-error-bg)',
                border: '1px solid var(--theme-error-border)',
                color: 'var(--theme-error)',
              }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--theme-ink-darkest)' }}>
                New Password
              </label>
              <div className="relative">
                <input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={loading}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) validateField('password', e.target.value); }}
                  onBlur={(e) => validateField('password', e.target.value)}
                  placeholder="Min 8 characters"
                  autoComplete="new-password"
                  className="block w-full pl-4 pr-12 py-3 rounded-xl text-sm transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  style={inputStyle(fieldErrors.password, loading)}
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: 'var(--theme-gray-400)' }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: 'var(--theme-error)' }}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--theme-ink-darkest)' }}>
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="reset-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (fieldErrors.confirmPassword) validateField('confirmPassword', e.target.value); }}
                  onBlur={(e) => validateField('confirmPassword', e.target.value)}
                  placeholder="Re-type new password"
                  autoComplete="new-password"
                  className="block w-full pl-4 pr-12 py-3 rounded-xl text-sm transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  style={inputStyle(fieldErrors.confirmPassword, loading)}
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: 'var(--theme-gray-400)' }}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: 'var(--theme-error)' }}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Security note */}
            <div
              className="flex items-start gap-2.5 p-3 rounded-xl text-[11px] leading-relaxed"
              style={{
                background: 'var(--theme-gray-50)',
                border: '1px solid var(--theme-warm-line)',
                color: 'var(--theme-gray-600)',
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--theme-gray-400)' }} />
              <span>All active device sessions will be revoked after your password is changed.</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <Button
                variant="secondary"
                size="lg"
                asChild
                className="flex-1 font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl"
              >
                <Link href="/login">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </Link>
              </Button>
              <Button
                id="reset-submit"
                type="submit"
                variant="primary"
                size="lg"
                disabled={!token}
                isLoading={loading}
                className="flex-1 font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl"
              >
                RESET PASSWORD
              </Button>
            </div>
          </form>
        </>
      )}

      <div className="mt-7 pt-6" style={{ borderTop: '1px solid var(--theme-warm-line)' }}>
        <Link
          href="/login"
          className="text-xs font-bold transition-colors flex items-center gap-1.5"
          style={{ color: 'var(--theme-red)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--theme-red-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-red)'; }}
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Sign In
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[300px] flex items-center justify-center">
          <LogoLoader size="md" text="Mercora Deal OS" subtext="Preparing security handshake..." dark={false} />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
