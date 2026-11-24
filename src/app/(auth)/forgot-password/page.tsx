'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, ArrowLeft, Send, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { forgotPasswordServerAction } from '@/app/actions/auth-actions';
import { Logo } from '@/components/Logo';
import { Input, Button, Card } from '@/components/common';

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
            <>Reset link <span className="text-[#7F1D3F]">sent</span></>
          ) : (
            <>Forgot <span className="text-[#7F1D3F]">password?</span></>
          )}
        </h1>
        <p className="text-xs sm:text-[13px] text-[#765C67] mt-0.5 leading-normal font-normal">
          {success
            ? 'Check your email inbox for recovery instructions.'
            : "Enter your account email and we'll send you a secure reset link."}
        </p>
      </div>

      {/* ── ELEVATED WHITE CARD CONTAINER ── */}
      <Card className="bg-white rounded-2xl sm:rounded-[22px] p-5 sm:p-6 md:p-7 shadow-[0_18px_50px_-10px_rgba(43,18,32,0.07),0_2px_8px_rgba(0,0,0,0.02)] border border-[#F0E4E8]">
        {success ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-1">Reset Link Dispatched</strong>
                If an account exists for{' '}
                <strong className="text-[#2B1220]">{email}</strong>, you will
                receive recovery instructions in your inbox shortly.
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              asChild
              className="w-full h-[46px] text-sm font-bold rounded-xl"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              <Link href="/login">Return to Sign In</Link>
            </Button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-3.5 p-2.5 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
              <Input
                id="forgot-email"
                label={
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2B1220] select-none">
                    <Mail className="w-3.5 h-3.5 text-[#765C67]" />
                    <span>Email Address</span>
                  </span>
                }
                type="email"
                disabled={loading}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldError) setFieldError(undefined);
                }}
                placeholder="you@company.com"
                autoComplete="email"
                leftIcon={<Mail className="w-4 h-4 text-[#8A727D]" />}
                error={fieldError}
                inputSize="lg"
                className="h-[46px] rounded-xl border-[#E5D4DA] hover:border-[#D5C0C8] focus:border-[#7F1D3F] focus:ring-4 focus:ring-[#7F1D3F]/10 text-sm text-[#2B1220] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              />

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <Button
                  variant="secondary"
                  size="lg"
                  asChild
                  className="flex-1 h-[46px] text-sm font-bold rounded-xl"
                >
                  <Link href="/login">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Cancel</span>
                  </Link>
                </Button>
                <Button
                  id="forgot-submit"
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  loadingText="Sending..."
                  className="flex-1 h-[46px] text-sm font-bold rounded-xl"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Link
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