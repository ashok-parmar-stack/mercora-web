'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, CheckCircle2, AlertTriangle, ArrowRight, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { z } from 'zod';
import { registerServerAction } from '@/app/actions/auth-actions';
import { Logo } from '@/components/Logo';
import { Input, Button, Card } from '@/components/common';

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
  if (!pwd) return { score: 0, label: '', color: '#E5D4DA' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: '#E11D48' };
  if (score <= 2) return { score: 2, label: 'Fair', color: '#F59E0B' };
  if (score <= 3) return { score: 3, label: 'Good', color: '#3B82F6' };
  return { score: 4, label: 'Strong', color: '#10B981' };
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

  return (
    <div className="w-full">
      {/* ── LOGO (Clean placement matching login & Canva mockup) ── */}
      <div className="mb-3 sm:mb-3.5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 transition-transform hover:scale-105 duration-200"
          title="Mercora Home"
        >
          <Logo height={28} />
        </Link>
      </div>

      {/* ── HEADINGS (Create your in Charcoal Plum, "account" in Brand Wine #7F1D3F) ── */}
      <div className="mb-3 sm:mb-3.5">
        <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#2B1220] leading-tight">
          Create an <span className="text-[#7F1D3F]">account</span>
        </h1>
        <p className="text-xs sm:text-[13px] text-[#765C67] mt-0.5 leading-normal font-normal">
          Join Mercora and unlock enterprise-grade trade intelligence.
        </p>
      </div>

      {/* ── ELEVATED WHITE CARD CONTAINER (Using Common Card component) ── */}
      <Card className="bg-white rounded-2xl sm:rounded-[22px] p-5 sm:p-6 md:p-7 shadow-[0_18px_50px_-10px_rgba(43,18,32,0.07),0_2px_8px_rgba(0,0,0,0.02)] border border-[#F0E4E8]">
        {/* Server Error */}
        {error && (
          <div className="mb-3.5 p-2.5 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Success State */}
        {successEmail ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-1">Activation link sent!</strong>
                We sent a verification link to{' '}
                <strong className="text-[#2B1220]">{successEmail}</strong>.
                Please check your inbox to activate your account.
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              asChild
              className="w-full h-11 sm:h-[46px] text-sm font-bold rounded-xl"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              <Link href="/login">Return to Sign In</Link>
            </Button>
          </div>
        ) : (
          <form className="space-y-2.5 sm:space-y-3" onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <Input
              id="register-name"
              label={
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2B1220] select-none">
                  <User className="w-3.5 h-3.5 text-[#765C67]" />
                  <span>Full Name</span>
                </span>
              }
              type="text"
              disabled={loading}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) validateSingleField('name', e.target.value);
              }}
              onBlur={(e) => validateSingleField('name', e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              leftIcon={<User className="w-4 h-4 text-[#8A727D]" />}
              error={fieldErrors.name}
              inputSize="lg"
              className="h-10 sm:h-11 rounded-xl border-[#E5D4DA] hover:border-[#D5C0C8] focus:border-[#7F1D3F] focus:ring-4 focus:ring-[#7F1D3F]/10 text-sm text-[#2B1220] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
            />

            {/* Email Address */}
            <Input
              id="register-email"
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
                if (fieldErrors.email) validateSingleField('email', e.target.value);
              }}
              onBlur={(e) => validateSingleField('email', e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4 text-[#8A727D]" />}
              error={fieldErrors.email}
              inputSize="lg"
              className="h-10 sm:h-11 rounded-xl border-[#E5D4DA] hover:border-[#D5C0C8] focus:border-[#7F1D3F] focus:ring-4 focus:ring-[#7F1D3F]/10 text-sm text-[#2B1220] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
            />

            {/* Password */}
            <div className="space-y-1">
              <Input
                id="register-password"
                label={
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2B1220] select-none">
                    <Lock className="w-3.5 h-3.5 text-[#765C67]" />
                    <span>Password</span>
                  </span>
                }
                type={showPassword ? 'text' : 'password'}
                disabled={loading}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) validateSingleField('password', e.target.value);
                }}
                onBlur={(e) => validateSingleField('password', e.target.value)}
                placeholder="Min 8 characters"
                autoComplete="new-password"
                leftIcon={<Lock className="w-4 h-4 text-[#8A727D]" />}
                rightIcon={
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowPassword((p) => !p)}
                    className="p-1 rounded text-[#8A727D] hover:text-[#2B1220] transition-colors cursor-pointer disabled:opacity-50"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={fieldErrors.password}
                inputSize="lg"
                className="h-10 sm:h-11 rounded-xl border-[#E5D4DA] hover:border-[#D5C0C8] focus:border-[#7F1D3F] focus:ring-4 focus:ring-[#7F1D3F]/10 text-sm text-[#2B1220] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              />

              {/* Password Strength Indicator */}
              {password && (
                <div className="pt-0.5 space-y-0.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background: i <= strength.score ? strength.color : '#E5D4DA',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-semibold" style={{ color: strength.color }}>
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <Input
              id="register-confirm-password"
              label={
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2B1220] select-none">
                  <Lock className="w-3.5 h-3.5 text-[#765C67]" />
                  <span>Confirm Password</span>
                </span>
              }
              type={showConfirmPassword ? 'text' : 'password'}
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) validateSingleField('confirmPassword', e.target.value);
              }}
              onBlur={(e) => validateSingleField('confirmPassword', e.target.value)}
              placeholder="Re-type your password"
              autoComplete="new-password"
              leftIcon={<Lock className="w-4 h-4 text-[#8A727D]" />}
              rightIcon={
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="p-1 rounded text-[#8A727D] hover:text-[#2B1220] transition-colors cursor-pointer disabled:opacity-50"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={fieldErrors.confirmPassword}
              inputSize="lg"
              className="h-10 sm:h-11 rounded-xl border-[#E5D4DA] hover:border-[#D5C0C8] focus:border-[#7F1D3F] focus:ring-4 focus:ring-[#7F1D3F]/10 text-sm text-[#2B1220] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
            />

            {/* Terms note */}
            <p className="text-[11px] leading-relaxed text-[#765C67] pt-0.5 select-none">
              By registering, you agree to Mercora&apos;s{' '}
              <span className="font-semibold text-[#2B1220]">Terms</span> and{' '}
              <span className="font-semibold text-[#2B1220]">Privacy Policy</span>.
            </p>

            {/* Create Account Submit Button using Common Button */}
            <div className="pt-1">
              <Button
                id="register-submit"
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                loadingText="Creating account..."
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full h-11 sm:h-[46px] text-sm font-bold rounded-xl"
              >
                Create Account
              </Button>
            </div>

            {/* Divider: or */}
            <div className="text-center text-xs text-[#8A727D] pt-0.5 select-none">or</div>

            {/* Sign In Link */}
            <div className="text-center text-xs text-[#765C67]">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-[#7F1D3F] hover:underline transition-colors ml-0.5 inline-flex items-center gap-1 group"
              >
                <span>Sign in</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </form>
        )}
      </Card>

      {/* ── BOTTOM SECURITY BADGE (Exact match to Canva mockup & Login) ── */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-[#765C67] pt-3 select-none">
        <ShieldCheck className="w-3.5 h-3.5 text-[#765C67]" />
        <span>Secure &amp; Trusted</span>
        <span className="text-[#E5D4DA]">|</span>
        <span>Enterprise Grade Security</span>
      </div>
    </div>
  );
}