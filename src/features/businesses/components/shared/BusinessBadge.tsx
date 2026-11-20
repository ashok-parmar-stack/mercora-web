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
        className={`inline-flex items-center gap-1.5 font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 rounded-full ${size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
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
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full shadow-xs ${isPremium
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
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
