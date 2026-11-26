"use client";

import React from "react";
import { Award, CheckCircle2, Clock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BusinessStatusBadgeProps {
  tier?: string;
  isVerified?: boolean;
  className?: string;
}

export function BusinessStatusBadge({
  tier,
  isVerified,
  className,
}: BusinessStatusBadgeProps) {
  const resolved = tier || (isVerified ? "Verified" : "Unverified");

  if (resolved === "Premium") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
          className
        )}
      >
        <Award className="w-3 h-3" />
        <span>Premium</span>
      </span>
    );
  }

  if (resolved === "Verified") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50",
          className
        )}
      >
        <CheckCircle2 className="w-3 h-3" />
        <span>Verified</span>
      </span>
    );
  }

  if (resolved === "Standard") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
          className
        )}
      >
        <Shield className="w-3 h-3" />
        <span>Standard</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50",
        className
      )}
    >
      <Clock className="w-3 h-3" />
      <span>Unverified</span>
    </span>
  );
}
