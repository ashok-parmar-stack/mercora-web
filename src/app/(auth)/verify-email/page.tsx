'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, AlertTriangle, Mail, ShieldCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import {
  verifyEmailServerAction,
  resendVerificationServerAction,
} from '@/app/actions/auth-actions';
import { Logo } from '@/components/Logo';
import { Input, Button, Card } from '@/components/common';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);

  useEffect(() => {
    if (tokenFromUrl) {
      handleAutoVerify(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleAutoVerify = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await verifyEmailServerAction(token);
      if (!res.success) {
        throw new Error(res.error || 'Verification link is invalid or has expired.');
      }
      setSuccess(true);
      setTimeout(() => {
        router.push('/login?verified=true');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Verification link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;
    setResendLoading(true);
    setResendMsg(null);
    try {
      const res = await resendVerificationServerAction(resendEmail);
      if (!res.success) {
        throw new Error(res.error || 'Failed to resend verification link.');
      }
      setResendMsg(res.data?.message || 'A fresh verification link has been dispatched to your inbox.');
    } catch (err: any) {
      setResendMsg(err.message || 'Failed to resend verification link.');
    } finally {
      setResendLoading(false);
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
          Email <span className="text-[#7F1D3F]">Verification</span>
        </h1>
        <p className="text-xs sm:text-[13px] text-[#765C67] mt-0.5 leading-normal font-normal">
          Confirming your credentials for Mercora Enterprise Platform.
        </p>
      </div>

      {/* ── ELEVATED WHITE CARD CONTAINER ── */}
      <Card className="bg-white rounded-2xl sm:rounded-[22px] p-5 sm:p-6 md:p-7 shadow-[0_18px_50px_-10px_rgba(43,18,32,0.07),0_2px_8px_rgba(0,0,0,0.02)] border border-[#F0E4E8]">
        {/* Loading verification state */}
        {loading && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#7F1D3F] animate-spin" />
            <p className="text-sm font-semibold text-[#2B1220]">Verifying security token...</p>
            <p className="text-xs text-[#765C67]">Please wait while we activate your account.</p>
          </div>
        )}

        {/* Success state */}
        {success && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-xs leading-relaxed flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5 text-sm">Account Verified!</strong>
                Your email has been confirmed. Redirecting you to login...
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              asChild
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              <Link href="/login?verified=true">Continue to Sign In</Link>
            </Button>
          </div>
        )}

        {/* Error / Resend State */}
        {!loading && !success && error && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] flex items-start gap-2.5 text-xs leading-relaxed">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Verification Failed</strong>
                {error}
              </div>
            </div>

            {/* Resend Form */}
            <div className="pt-1">
              <h4 className="text-xs font-semibold text-[#2B1220] mb-2">
                Request New Activation Link
              </h4>
              {resendMsg ? (
                <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-xs leading-relaxed">
                  {resendMsg}
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-3">
                  <Input
                    type="email"
                    required
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    leftIcon={<Mail className="w-4 h-4 text-[#8A727D]" />}
                    inputSize="lg"
                    className="h-11 rounded-xl border-[#E5D4DA] hover:border-[#D5C0C8] focus:border-[#7F1D3F] focus:ring-4 focus:ring-[#7F1D3F]/10 text-sm text-[#2B1220] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={resendLoading}
                    loadingText="Sending..."
                    className="w-full"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Send Verification Email
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Idle state without token in URL */}
        {!loading && !success && !error && !tokenFromUrl && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs leading-relaxed flex items-start gap-2.5">
              <Mail className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5 text-sm">Check Your Inbox</strong>
                Please click the verification link sent to your registered email address to activate your account.
              </div>
            </div>
            <Button
              variant="secondary"
              size="lg"
              asChild
              className="w-full"
            >
              <Link href="/login">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Login</span>
              </Link>
            </Button>
          </div>
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}