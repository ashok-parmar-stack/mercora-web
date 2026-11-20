'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { registerServerAction } from '@/app/actions/auth-actions';
import { LoadingSpinner } from '@/components/ui/Loading';

/* ── Zod Validation Schema ────────────────────────────────────────────── */
const registerSchema = z
  .object({
    name: z.string().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

/* ── Password strength helper ─────────────────────────────────────────── */
function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: '', color: 'var(--theme-gray-200)' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'var(--theme-error)' };
  if (score <= 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
  if (score <= 3) return { score: 3, label: 'Good', color: '#3b82f6' };
  return { score: 4, label: 'Strong', color: 'var(--theme-success)' };
}

/* ── Shared input style helper ────────────────────────────────────────── */
function inputClass(hasError?: string, disabled?: boolean) {
  return `block w-full px-3.5 py-2 rounded-xl text-sm transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed`;
}

function inputStyle(hasError?: string, disabled?: boolean): React.CSSProperties {
  return {
    background: disabled ? 'var(--theme-gray-100)' : hasError ? 'var(--theme-error-bg)' : 'var(--theme-gray-50)',
    border: `1.5px solid ${hasError ? 'var(--theme-error)' : 'var(--theme-warm-line)'}`,
    color: 'var(--theme-ink-darkest)',
    boxShadow: hasError ? '0 0 0 3px rgba(238,49,53,0.08)' : undefined,
    cursor: disabled ? 'not-allowed' : undefined,
  };
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  const strength = getPasswordStrength(password);

  const validateSingleField = (
    field: 'name' | 'email' | 'password' | 'confirmPassword',
    value: string,
  ) => {
    const draft = { name, email, password, confirmPassword, [field]: value };
    const res = registerSchema.safeParse(draft);
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

    const validation = registerSchema.safeParse({ name, email, password, confirmPassword });
    if (!validation.success) {
      const issues = validation.error.flatten().fieldErrors;
      setFieldErrors({
        name: issues.name?.[0],
        email: issues.email?.[0],
        password: issues.password?.[0],
        confirmPassword: issues.confirmPassword?.[0],
      });
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const res = await registerServerAction({
        name: validation.data.name,
        email: validation.data.email,
        password: validation.data.password,
      });

      if (!res.success) throw new Error(res.error || 'Registration failed.');
      setSuccessEmail(res.data?.email || email);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success State ─────────────────────────────────────────────────── */
  if (successEmail) {
    return (
      <>
        <div className="mb-7">
          <h1 className="text-[2rem] font-extrabold tracking-[-0.03em] mb-2 font-jakarta" style={{ color: 'var(--theme-ink-darkest)', lineHeight: 1.1 }}>
            Check your email
          </h1>
        </div>
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
              <strong className="font-bold block mb-1">Activation link sent!</strong>
              We sent a verification link to{' '}
              <strong style={{ color: 'var(--theme-ink-darkest)' }}>{successEmail}</strong>.
              Please check your inbox to activate your account.
            </div>
          </div>
          <Link
            href="/login"
            className="btn-red w-full justify-center py-3.5 rounded-xl text-xs tracking-widest font-rethink"
          >
            Return to Sign In
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Heading */}
      <div className="mb-3 text-center">
        <h1
          className="text-xl sm:text-2xl font-extrabold tracking-[-0.03em] mb-1 font-jakarta"
          style={{ color: 'var(--theme-ink-darkest)', lineHeight: 1.2 }}
        >
          Create an account
        </h1>
        <p className="text-xs font-work" style={{ color: 'var(--theme-gray-600)', lineHeight: 1.5 }}>
          Join Mercora and unlock enterprise-grade trade intelligence.
        </p>
      </div>

      {/* Server Error */}
      {error && (
        <div
          className="mb-3 p-2.5 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed animate-in fade-in duration-200"
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

      <form className="space-y-2.5 sm:space-y-3" onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--theme-ink-darkest)' }}>
            Full Name
          </label>
          <input
            id="register-name"
            type="text"
            disabled={loading}
            value={name}
            onChange={(e) => { setName(e.target.value); if (fieldErrors.name) validateSingleField('name', e.target.value); }}
            onBlur={(e) => validateSingleField('name', e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            className={inputClass(fieldErrors.name, loading)}
            style={inputStyle(fieldErrors.name, loading)}
          />
          {fieldErrors.name && (
            <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: 'var(--theme-error)' }}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.name}</span>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--theme-ink-darkest)' }}>
            Email Address
          </label>
          <input
            id="register-email"
            type="email"
            disabled={loading}
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) validateSingleField('email', e.target.value); }}
            onBlur={(e) => validateSingleField('email', e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            className={inputClass(fieldErrors.email, loading)}
            style={inputStyle(fieldErrors.email, loading)}
          />
          {fieldErrors.email && (
            <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: 'var(--theme-error)' }}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.email}</span>
            </div>
          )}
        </div>

        {/* Password + Strength */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--theme-ink-darkest)' }}>
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              disabled={loading}
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) validateSingleField('password', e.target.value); }}
              onBlur={(e) => validateSingleField('password', e.target.value)}
              placeholder="Min 8 characters"
              autoComplete="new-password"
              className={`${inputClass(fieldErrors.password, loading)} pr-11`}
              style={inputStyle(fieldErrors.password, loading)}
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPassword((p) => !p)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: 'var(--theme-gray-400)' }}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password Strength Bar */}
          {password && (
            <div className="mt-1.5 space-y-0.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      background: i <= strength.score ? strength.color : 'var(--theme-gray-200)',
                    }}
                  />
                ))}
              </div>
              <p className="text-[10px] font-medium" style={{ color: strength.color }}>
                {strength.label} password
              </p>
            </div>
          )}

          {fieldErrors.password && (
            <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: 'var(--theme-error)' }}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.password}</span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--theme-ink-darkest)' }}>
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); if (fieldErrors.confirmPassword) validateSingleField('confirmPassword', e.target.value); }}
              onBlur={(e) => validateSingleField('confirmPassword', e.target.value)}
              placeholder="Re-type your password"
              autoComplete="new-password"
              className={`${inputClass(fieldErrors.confirmPassword, loading)} pr-11`}
              style={inputStyle(fieldErrors.confirmPassword, loading)}
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: 'var(--theme-gray-400)' }}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: 'var(--theme-error)' }}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.confirmPassword}</span>
            </div>
          )}
        </div>

        {/* Terms */}
        <p className="text-[11px] leading-relaxed pt-0.5" style={{ color: 'var(--theme-gray-500)' }}>
          By registering, you agree to Mercora&apos;s{' '}
          <span className="font-semibold" style={{ color: 'var(--theme-ink-darkest)' }}>Terms</span> and{' '}
          <span className="font-semibold" style={{ color: 'var(--theme-ink-darkest)' }}>Privacy Policy</span>.
        </p>

        {/* Submit */}
        <div className="pt-1">
          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="btn-red w-full justify-center py-2.5 sm:py-3 rounded-xl text-xs tracking-widest disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" variant="white" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>CREATE ACCOUNT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Sign In Link */}
      <div className="mt-4 sm:mt-5 pt-3 text-center" style={{ borderTop: '1px solid var(--theme-warm-line)' }}>
        <p className="text-xs" style={{ color: 'var(--theme-gray-500)' }}>
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold transition-colors"
            style={{ color: 'var(--theme-red)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--theme-red-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-red)'; }}
          >
            Sign in →
          </Link>
        </p>
      </div>
    </>
  );
}
