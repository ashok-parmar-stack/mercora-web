"use client";

import React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/common";

interface PasswordInputFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  showPassword: boolean;
  error?: string;
  onToggleShow: () => void;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
}

export function PasswordInputField({
  id,
  label,
  value,
  placeholder,
  disabled,
  showPassword,
  error,
  onToggleShow,
  onChange,
  onBlur,
}: PasswordInputFieldProps) {
  return (
    <Input
      id={id}
      label={
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2B1220] select-none">
          <Lock className="w-3.5 h-3.5 text-[#765C67]" />
          <span>{label}</span>
        </span>
      }
      type={showPassword ? "text" : "password"}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onBlur(e.target.value)}
      placeholder={placeholder}
      autoComplete="new-password"
      leftIcon={<Lock className="w-4 h-4 text-[#8A727D]" />}
      rightIcon={
        <button
          type="button"
          disabled={disabled}
          onClick={onToggleShow}
          className="p-1 rounded text-[#8A727D] hover:text-[#2B1220] transition-colors cursor-pointer disabled:opacity-50"
          title={showPassword ? "Hide password" : "Show password"}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
      error={error}
      inputSize="lg"
      className="h-10 sm:h-11 rounded-xl border-[#E5D4DA] hover:border-[#D5C0C8] focus:border-[#7F1D3F] focus:ring-4 focus:ring-[#7F1D3F]/10 text-sm text-[#2B1220] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
    />
  );
}
