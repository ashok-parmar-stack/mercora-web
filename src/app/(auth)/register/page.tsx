"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Mail, ShieldCheck, User } from "lucide-react";
import { registerServerAction } from "@/app/actions/auth-actions";
import { Logo } from "@/components/Logo";
import { Button, Card, Input } from "@/components/common";
import { getPasswordStrength, RegisterFieldErrors, registerSchema } from "./register.schema";
import { RegisterSuccessView } from "./components/RegisterSuccessView";
import { PasswordStrengthIndicator } from "./components/PasswordStrengthIndicator";
import { PasswordInputField } from "./components/PasswordInputField";

const INPUT_CLASS =
  "h-10 sm:h-11 rounded-xl border-[#E5D4DA] hover:border-[#D5C0C8] focus:border-[#7F1D3F] focus:ring-4 focus:ring-[#7F1D3F]/10 text-sm text-[#2B1220] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  const strength = getPasswordStrength(password);

  const validateSingleField = (
    field: "name" | "email" | "password" | "confirmPassword",
    value: string
  ) => {
    const res = registerSchema.safeParse({ name, email, password, confirmPassword, [field]: value });
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
      if (!res.success) throw new Error(res.error || "Registration failed.");
      setSuccessEmail(res.data?.email || email);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-3 sm:mb-3.5">
        <Link href="/" className="inline-flex items-center gap-2 transition-transform hover:scale-105 duration-200" title="Mercora Home">
          <Logo height={28} />
        </Link>
      </div>

      <div className="mb-3 sm:mb-3.5">
        <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#2B1220] leading-tight">
          Create an <span className="text-[#7F1D3F]">account</span>
        </h1>
        <p className="text-xs sm:text-[13px] text-[#765C67] mt-0.5 leading-normal font-normal">
          Join Mercora and unlock enterprise-grade trade intelligence.
        </p>
      </div>

      <Card className="bg-white rounded-2xl sm:rounded-[22px] p-5 sm:p-6 md:p-7 shadow-[0_18px_50px_-10px_rgba(43,18,32,0.07),0_2px_8px_rgba(0,0,0,0.02)] border border-[#F0E4E8]">
        {error && (
          <div className="mb-3.5 p-2.5 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {successEmail ? (
          <RegisterSuccessView email={successEmail} />
        ) : (
          <form className="space-y-2.5 sm:space-y-3" onSubmit={handleSubmit} noValidate>
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
                if (fieldErrors.name) validateSingleField("name", e.target.value);
              }}
              onBlur={(e) => validateSingleField("name", e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              leftIcon={<User className="w-4 h-4 text-[#8A727D]" />}
              error={fieldErrors.name}
              inputSize="lg"
              className={INPUT_CLASS}
            />

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
                if (fieldErrors.email) validateSingleField("email", e.target.value);
              }}
              onBlur={(e) => validateSingleField("email", e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4 text-[#8A727D]" />}
              error={fieldErrors.email}
              inputSize="lg"
              className={INPUT_CLASS}
            />

            <div className="space-y-1">
              <PasswordInputField
                id="register-password"
                label="Password"
                value={password}
                placeholder="Min 8 characters"
                disabled={loading}
                showPassword={showPassword}
                error={fieldErrors.password}
                onToggleShow={() => setShowPassword((p) => !p)}
                onChange={(val) => {
                  setPassword(val);
                  if (fieldErrors.password) validateSingleField("password", val);
                }}
                onBlur={(val) => validateSingleField("password", val)}
              />
              {password && (
                <PasswordStrengthIndicator score={strength.score} label={strength.label} color={strength.color} />
              )}
            </div>

            <PasswordInputField
              id="register-confirm-password"
              label="Confirm Password"
              value={confirmPassword}
              placeholder="Re-type your password"
              disabled={loading}
              showPassword={showConfirmPassword}
              error={fieldErrors.confirmPassword}
              onToggleShow={() => setShowConfirmPassword((p) => !p)}
              onChange={(val) => {
                setConfirmPassword(val);
                if (fieldErrors.confirmPassword) validateSingleField("confirmPassword", val);
              }}
              onBlur={(val) => validateSingleField("confirmPassword", val)}
            />

            <p className="text-[11px] leading-relaxed text-[#765C67] pt-0.5 select-none">
              By registering, you agree to Mercora&apos;s{" "}
              <span className="font-semibold text-[#2B1220]">Terms</span> and{" "}
              <span className="font-semibold text-[#2B1220]">Privacy Policy</span>.
            </p>

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

            <div className="text-center text-xs text-[#8A727D] pt-0.5 select-none">or</div>

            <div className="text-center text-xs text-[#765C67]">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#7F1D3F] hover:underline transition-colors ml-0.5 inline-flex items-center gap-1 group">
                <span>Sign in</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </form>
        )}
      </Card>

      <div className="flex items-center justify-center gap-1.5 text-xs text-[#765C67] pt-3 select-none">
        <ShieldCheck className="w-3.5 h-3.5 text-[#765C67]" />
        <span>Secure &amp; Trusted</span>
        <span className="text-[#E5D4DA]">|</span>
        <span>Enterprise Grade Security</span>
      </div>
    </div>
  );
}
