'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { z } from 'zod';
import { forgotPasswordServerAction } from '@/app/actions/auth-actions';
import { LoadingSpinner } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      setFieldError(validation.error.flatten().fieldErrors.email?.[0]);
      return;
    }

    setFieldError(undefined);
    setLoading(true);

    try {
      const res = await forgotPasswordServerAction(email);
      if (!res.success) throw new Error(res.error || 'Failed to dispatch reset link.');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Heading */}
      <div className="mb-4 sm:mb-5 text-center">
        <h1
          className="text-2xl sm:text-[1.75rem] font-extrabold tracking-[-0.03em] mb-1 font-jakarta"
          style={{ color: 'var(--theme-ink-darkest)', lineHeight: 1.2 }}
        >
          {success ? 'Reset link sent' : 'Forgot password?'}
        </h1>
        <p className="text-xs sm:text-[13px] font-work" style={{ color: 'var(--theme-gray-600)', lineHeight: 1.5 }}>
          {success
            ? 'Check your email inbox for recovery instructions.'
            : 'Enter your account email and we\'ll send you a secure reset link.'}
        </p>
      </div>

      {success ? (
        <div className="space-y-4">
          <div
            className="p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed"
            style={{
              background: 'var(--theme-success-bg)',
              border: '1px solid var(--theme-success-border)',
              color: 'var(--theme-success)',
            }}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block mb-1">Reset Link Dispatched</strong>
              If an account exists for{' '}
              <strong style={{ color: 'var(--theme-ink-darkest)' }}>{email}</strong>, you will
              receive recovery instructions in your inbox shortly.
            </div>
          </div>
          <Link
            href="/login"
            className="btn-red w-full justify-center py-2.5 sm:py-3 rounded-xl text-xs tracking-widest"
          >
            Return to Sign In
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div
              className="mb-3.5 p-2.5 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed animate-in fade-in duration-200"
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

          <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: 'var(--theme-ink-darkest)' }}
              >
                Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                disabled={loading}
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (fieldError) setFieldError(undefined); }}
                placeholder="you@company.com"
                autoComplete="email"
                className="block w-full px-3.5 py-2.5 rounded-xl text-sm transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: loading ? 'var(--theme-gray-100)' : fieldError ? 'var(--theme-error-bg)' : 'var(--theme-gray-50)',
                  border: `1.5px solid ${fieldError ? 'var(--theme-error)' : 'var(--theme-warm-line)'}`,
                  color: 'var(--theme-ink-darkest)',
                  boxShadow: fieldError ? '0 0 0 3px rgba(238,49,53,0.08)' : undefined,
                  cursor: loading ? 'not-allowed' : undefined,
                }}
                onFocus={(e) => {
                  if (!loading && !fieldError) {
                    e.target.style.borderColor = 'var(--theme-red)';
                    e.target.style.boxShadow = '0 0 0 3px var(--theme-red-glow)';
                    e.target.style.background = 'var(--theme-canvas)';
                  }
                }}
                onBlurCapture={(e) => {
                  if (!fieldError) {
                    e.target.style.borderColor = 'var(--theme-warm-line)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'var(--theme-gray-50)';
                  }
                }}
              />
              {fieldError && (
                <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: 'var(--theme-error)' }}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldError}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <Button
                variant="secondary"
                size="lg"
                asChild
                className="flex-1 font-bold uppercase tracking-widest text-xs py-2.5 sm:py-3 rounded-xl"
              >
                <Link href="/login">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </Link>
            </Button>
            <Button
              id="forgot-submit"
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="flex-1 font-bold uppercase tracking-widest text-xs py-2.5 sm:py-3 rounded-xl"
              rightIcon={!loading ? <Send className="w-3.5 h-3.5" /> : undefined}
            >
            SEND LINK
          </Button>
        </div>
    </form >
        </>
      )
}

<div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 text-center" style={{ borderTop: '1px solid var(--theme-warm-line)' }}>
  <Link
    href="/login"
    className="text-xs font-bold transition-colors inline-flex items-center gap-1.5"
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
