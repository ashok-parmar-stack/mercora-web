'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { loginServerAction } from '@/app/actions/auth-actions';
import { useAuthStore } from '@/lib/store/auth-store';
import { Logo } from '@/components/Logo';
import { Input, Button, Checkbox, Card } from '@/components/common';
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
    .min(6, 'Password must be at least 6 characters long'),
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
  const [rememberMe, setRememberMe] = useState(true);
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
      const redirectPath = searchParams.get('redirect') || '/admin';
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* ── LOGO (Exact 1:1 clean placement matching Canva mockup) ── */}
      <div className="mb-3 sm:mb-3.5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 transition-transform hover:scale-105 duration-200"
          title="Mercora Home"
        >
          <Logo height={30} />
        </Link>
      </div>

      {/* ── HEADINGS (Welcome in Charcoal Plum, "back" in Brand Wine #7F1D3F) ── */}
      <div className="mb-3 sm:mb-3.5">
          <h1 className="text-2xl sm:text-[28px] md:text-[30px] font-extrabold tracking-tight text-[#2B1220] leading-tight">
            Welcome <span className="text-[#7F1D3F]">back</span>
          </h1>
          <p className="text-xs sm:text-[13px] text-[#765C67] mt-0.5 leading-normal font-normal">
            Your listings, contacts &amp; market intelligence — just where you left them.
          </p>
      </div>

      {/* ── ELEVATED WHITE CARD CONTAINER (Using Common Card component) ── */}
        <Card className="bg-white rounded-2xl sm:rounded-[22px] p-5 sm:p-6 md:p-7 shadow-[0_18px_50px_-10px_rgba(43,18,32,0.07),0_2px_8px_rgba(0,0,0,0.02)] border border-[#F0E4E8]">
          {/* Alerts for displaced session / errors */}
          <LoginFormAlerts
            isDisplaced={isDisplaced}
            evictionNotice={evictionNotice}
            verifiedNotice={verifiedNotice}
            error={error}
          />

            <form className="space-y-3 sm:space-y-3.5 md:space-y-4" onSubmit={handleSubmit} noValidate>
              {/* Email Address Field using Common Input */}
              <Input
                id="login-email"
                label={
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2B1220] select-none">
                    <Mail className="w-3.5 h-3.5 text-[#765C67]" />
                    <span>Email Address</span>
                  </span>
                }
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) validateField('email', e.target.value);
                }}
                onBlur={(e) => validateField('email', e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                leftIcon={<Mail className="w-4 h-4 text-[#8A727D]" />}
                error={fieldErrors.email}
                inputSize="lg"
                className="h-11 sm:h-[46px] rounded-xl border-[#E5D4DA] hover:border-[#D5C0C8] focus:border-[#7F1D3F] focus:ring-4 focus:ring-[#7F1D3F]/10 text-sm text-[#2B1220] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              />

              {/* Password Field using Common Input */}
              <Input
                id="login-password"
                label={
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2B1220] select-none">
                    <Lock className="w-3.5 h-3.5 text-[#765C67]" />
                    <span>Password</span>
                  </span>
                }
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) validateField('password', e.target.value);
                }}
                onBlur={(e) => validateField('password', e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                leftIcon={<Lock className="w-4 h-4 text-[#8A727D]" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="p-1 rounded text-[#8A727D] hover:text-[#2B1220] transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={fieldErrors.password}
                inputSize="lg"
                className="h-11 sm:h-[46px] rounded-xl border-[#E5D4DA] hover:border-[#D5C0C8] focus:border-[#7F1D3F] focus:ring-4 focus:ring-[#7F1D3F]/10 text-sm text-[#2B1220] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              />

              {/* Remember me & Forgot password row using Common Checkbox */}
              <div className="flex items-center justify-between pt-0.5">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  label={<span className="text-xs font-medium text-[#2B1220]">Remember me</span>}
                />

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#7F1D3F] hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button using Common Button */}
              <div className="pt-1">
                <Button
                  id="login-submit"
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  loadingText="Signing in..."
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full h-11 sm:h-[46px] text-sm font-bold rounded-xl"
                >
                  Sign In
                </Button>
              </div>

              {/* Divider: or */}
              <div className="text-center text-xs text-[#8A727D] pt-0.5 select-none">or</div>

              {/* Create Free Account Link */}
              <div className="text-center text-xs text-[#765C67]">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="font-bold text-[#7F1D3F] hover:underline transition-colors ml-0.5 inline-flex items-center gap-1 group"
                >
                  <span>Create a free account</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </form>
        </Card>

        {/* ── BOTTOM SECURITY BADGE (Exact 1:1 matching Canva mockup) ── */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#765C67] pt-3.5 select-none">
          <ShieldCheck className="w-3.5 h-3.5 text-[#765C67]" />
          <span>Secure &amp; Trusted</span>
          <span className="text-[#E5D4DA]">|</span>
          <span>Enterprise Grade Security</span>
        </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[300px] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#7F1D3F] animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
