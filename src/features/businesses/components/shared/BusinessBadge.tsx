import React from "react";
import { CheckCircle2, ShieldCheck, Award } from "lucide-react";
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
        className={`inline-flex items-center gap-1.5 font-bold text-slate-500 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm ${
          size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
        } ${className}`}
      >
        <span>Unverified</span>
      </span>
    );
  }

  const isPremium = tier === "Premium";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full shadow-sm backdrop-blur-md ${
        isPremium
          ? "bg-white/95 dark:bg-slate-900/95 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60"
          : "bg-white/95 dark:bg-slate-900/95 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/60"
      } ${size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"} ${className}`}
    >
      {isPremium ? (
        <Award className={`${iconSize} text-amber-500 dark:text-amber-400 flex-shrink-0`} />
      ) : (
        <ShieldCheck className={`${iconSize} text-emerald-500 dark:text-emerald-400 flex-shrink-0`} />
      )}
      <span>{isPremium ? "Premium Verified" : "Verified Business"}</span>
    </span>
  );
}
