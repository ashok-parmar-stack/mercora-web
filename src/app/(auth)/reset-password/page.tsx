'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2, AlertTriangle, ShieldCheck, ArrowLeft, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { resetPasswordServerAction } from '@/app/actions/auth-actions';
import { Logo } from '@/components/Logo';
import { Input, Button, Card } from '@/components/common';

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

  return (
    <div className="w-full">
      {/* ── LOGO ── */}
      <div className="mb-3 sm:mb-3.5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 transition-transform hover:scale-105 duration-200"
          title="Mercora Home"
        >
          <Logo height={28} />
        </Link>
      </div>

      {/* ── HEADINGS ── */}
      <div className="mb-3 sm:mb-3.5">
        <h1 className="text-[26px] sm:text-[28px] font-extrabold tracking-tight text-[#2B1220] leading-tight">
          {success ? (
            <>Password <span className="text-[#7F1D3F]">updated</span></>
          ) : (
            <>Set new <span className="text-[#7F1D3F]">password</span></>
          )}
        </h1>
        <p className="text-xs sm:text-[13px] text-[#765C67] mt-0.5 leading-normal font-normal">
          {success
            ? 'All active sessions have been revoked. Redirecting to login...'
            : 'Create a strong new password for your Mercora account.'}
        </p>
      </div>

      {/* ── ELEVATED WHITE CARD CONTAINER ── */}
      <Card className="bg-white rounded-2xl sm:rounded-[22px] p-5 sm:p-6 md:p-7 shadow-[0_18px_50px_-10px_rgba(43,18,32,0.07),0_2px_8px_rgba(0,0,0,0.02)] border border-[#F0E4E8]">
        {success ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-1">Password Updated!</strong>
                All active device sessions have been revoked for security. Redirecting to sign in...
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              asChild
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              <Link href="/login">Sign In Now</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Missing token warning */}
            {!token && (
              <div className="mb-3.5 p-3 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  Invalid or expired reset link. Please{' '}
                  <Link href="/forgot-password" className="font-bold underline text-[#7F1D3F]">
                    request a new one
                  </Link>.
                </div>
              </div>
            )}

            {error && (
              <div className="mb-3.5 p-2.5 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
              {/* New Password */}
              <Input
                id="reset-password"
                label={
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2B1220] select-none">
                    <Lock className="w-3.5 h-3.5 text-[#765C67]" />
                    <span>New Password</span>
                  </span>
                }
                type={showPassword ? 'text' : 'password'}
                disabled={loading}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) validateField('password', e.target.value);
                }}
                onBlur={(e) => validateField('password', e.target.value)}
                placeholder="Min 8 characters"
                autoComplete="new-password"
                leftIcon={<Lock className="w-4 h-4 text-[#8A727D]" />}
                rightIcon={
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="p-1 rounded text-[#8A727D] hover:text-[#2B1220] transition-colors cursor-pointer disabled:opacity-50"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={fieldErrors.password}
                inputSize="lg"
                className="h-11 rounded-xl border-[#E5D4DA] hover:border-[#D5C0C8] focus:border-[#7F1D3F] focus:ring-4 focus:ring-[#7F1D3F]/10 text-sm text-[#2B1220] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              />

              {/* Confirm Password */}
              <Input
                id="reset-confirm-password"
                label={
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2B1220] select-none">
                    <Lock className="w-3.5 h-3.5 text-[#765C67]" />
                    <span>Confirm New Password</span>
                  </span>
                }
                type={showConfirmPassword ? 'text' : 'password'}
                disabled={loading}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) validateField('confirmPassword', e.target.value);
                }}
                onBlur={(e) => validateField('confirmPassword', e.target.value)}
                placeholder="Re-type new password"
                autoComplete="new-password"
                leftIcon={<Lock className="w-4 h-4 text-[#8A727D]" />}
                rightIcon={
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="p-1 rounded text-[#8A727D] hover:text-[#2B1220] transition-colors cursor-pointer disabled:opacity-50"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={fieldErrors.confirmPassword}
                inputSize="lg"
                className="h-11 rounded-xl border-[#E5D4DA] hover:border-[#D5C0C8] focus:border-[#7F1D3F] focus:ring-4 focus:ring-[#7F1D3F]/10 text-sm text-[#2B1220] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              />

              {/* Security note */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl text-xs leading-relaxed bg-[#FAF3F5] border border-[#E5D4DA] text-[#765C67]">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#7F1D3F]" />
                <span>All active device sessions will be revoked after your password is changed.</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <Button
                  variant="secondary"
                  size="lg"
                  asChild
                  className="flex-1"
                >
                  <Link href="/login">
                    <ArrowLeft className="w-4 h-4" />
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
                  loadingText="Updating..."
                  className="flex-1"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Reset Password
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>

      {/* ── BOTTOM SECURITY BADGE ── */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-[#765C67] pt-3 select-none">
        <ShieldCheck className="w-3.5 h-3.5 text-[#765C67]" />
        <span>Secure &amp; Trusted</span>
        <span className="text-[#E5D4DA]">|</span>
        <span>Enterprise Grade Security</span>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[300px] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#7F1D3F] animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}