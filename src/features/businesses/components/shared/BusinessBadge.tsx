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
        className={`inline-flex items-center gap-1.5 font-bold text-text-muted bg-surface/95 backdrop-blur-md border border-border rounded-full shadow-2xs select-none ${
          size === "sm" ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
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
      className={`inline-flex items-center gap-1.5 font-bold rounded-full shadow-2xs backdrop-blur-md select-none ${
        isPremium
          ? "bg-surface/95 text-status-warning border border-status-warning-border"
          : "bg-surface/95 text-status-success border border-status-success-border"
      } ${size === "sm" ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-xs"} ${className}`}
    >
      {isPremium ? (
        <Award className={`${iconSize} text-status-warning flex-shrink-0`} />
      ) : (
        <ShieldCheck className={`${iconSize} text-status-success flex-shrink-0`} />
      )}
      <span>{isPremium ? "Premium Verified" : "Verified Business"}</span>
    </span>
  );
}
