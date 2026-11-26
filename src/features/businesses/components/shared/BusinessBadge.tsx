import React from "react";
import { ShieldCheck, Award } from "lucide-react";
import { VerificationTier } from "../../types/business.types";

export interface BusinessBadgeProps {
  tier?: VerificationTier;
  isVerified?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function BusinessBadge({
  tier = "Verified",
  isVerified = true,
  className = "",
  size = "md",
}: BusinessBadgeProps) {
  if (!isVerified) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full select-none ${
          size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
        } ${className}`}
      >
        <span>Registered</span>
      </span>
    );
  }

  const isPremium = tier === "Premium";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full border select-none ${
        isPremium
          ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
          : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
      } ${size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"} ${className}`}
    >
      {isPremium ? (
        <Award className={`${iconSize} text-amber-600 dark:text-amber-400 flex-shrink-0`} />
      ) : (
        <ShieldCheck className={`${iconSize} text-emerald-600 dark:text-emerald-400 flex-shrink-0`} />
      )}
      <span>{isPremium ? "Premium Verified" : "Verified Business"}</span>
    </span>
  );
}
