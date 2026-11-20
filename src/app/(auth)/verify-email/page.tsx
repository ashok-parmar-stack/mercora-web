'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, AlertTriangle, Mail } from 'lucide-react';
import {
  verifyEmailServerAction,
  resendVerificationServerAction,
} from '@/app/actions/auth-actions';
import { LoadingSpinner, LogoLoader } from '@/components/ui/Loading';

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
    <>
      {/* Heading & Subtitle */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-[#14161a] mb-2">
          Email Verification
        </h1>
        <p className="text-xs sm:text-sm text-[#636466] leading-relaxed">
          Confirming your credentials for Mercora Enterprise Deal OS.
        </p>
      </div>

      {/* Loading verification state */}
      {loading && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
          <LoadingSpinner size="lg" variant="red" />
          <p className="text-sm font-semibold text-[#14161a]">Verifying security token...</p>
          <p className="text-xs text-[#73767c]">Please wait while we activate your account.</p>
        </div>
      )}

      {/* Success state */}
      {success && (
        <div className="py-4 space-y-5">
          <div className="p-4 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-[#2e7d32] text-xs leading-relaxed flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#2e7d32]" />
            <div>
              <strong className="font-semibold block mb-0.5 text-sm">Account Verified!</strong>
              Your email has been confirmed. Redirecting you to login...
            </div>
          </div>
          <Link
            href="/login?verified=true"
            className="w-full inline-flex justify-center items-center py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all shadow-xs"
            style={{ backgroundColor: 'var(--theme-red, #ee3135)' }}
          >
            CONTINUE TO SIGN IN
          </Link>
        </div>
      )}

      {/* Error / Resend State */}
      {!loading && !success && error && (
        <div className="space-y-5">
          <div className="p-3.5 rounded-xl bg-[#fff3f4] border border-[#fecaca] text-[#ee3135] flex items-start gap-2.5 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#ee3135]" />
            <div>
              <strong className="font-semibold block mb-0.5">Verification Failed</strong>
              {error}
            </div>
          </div>

          {/* Resend Form */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-[#14161a] uppercase tracking-wider mb-2">
              Request New Activation Link
            </h4>
            {resendMsg ? (
              <div className="p-3 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] text-[#2e7d32] text-xs">
                {resendMsg}
              </div>
            ) : (
              <form onSubmit={handleResend} className="space-y-3">
                <div>
                  <input
                    type="email"
                    required
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="block w-full px-3.5 py-2.5 bg-white border border-[#dcdfe4] rounded-lg text-sm text-[#14161a] placeholder-[#9ca3af] focus:outline-none focus:border-[#ee3135] focus:ring-1 focus:ring-[#ee3135]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resendLoading}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all shadow-xs disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--theme-red, #ee3135)' }}
                >
                  {resendLoading ? (
                    <>
                      <LoadingSpinner size="xs" variant="white" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <span>SEND VERIFICATION EMAIL</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Idle state without token in URL */}
      {!loading && !success && !error && !tokenFromUrl && (
        <div className="py-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#fffbf0] border border-[#fef08a] text-[#b8860b] text-xs leading-relaxed flex items-start gap-2.5">
            <Mail className="w-5 h-5 shrink-0 mt-0.5 text-[#b8860b]" />
            <div>
              <strong className="font-semibold block mb-0.5 text-sm">Check Your Inbox</strong>
              Please click the verification link sent to your registered email address to activate your account.
            </div>
          </div>
          <Link
            href="/login"
            className="w-full inline-flex justify-center items-center py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider text-[#14161a] border-2 border-[#14161a] bg-white hover:bg-gray-50 transition-colors"
          >
            RETURN TO LOGIN
          </Link>
        </div>
      )}

      {/* Bottom link */}
      <div className="mt-6 text-center sm:text-left">
        <Link
          href="/login"
          className="text-xs font-bold text-[#ee3135] hover:text-[#d92c30] transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[300px] flex items-center justify-center">
          <LogoLoader size="md" text="Mercora Deal OS" subtext="Checking verification state..." dark={false} />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
