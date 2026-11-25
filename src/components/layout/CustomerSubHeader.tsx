"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface CustomerSubHeaderProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function CustomerSubHeader({
  icon,
  title,
  backHref = "/dashboard",
  backLabel = "Dashboard",
}: CustomerSubHeaderProps) {
  return (
    <div className="bg-surface border-b border-border shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon}
          <h1 className="text-sm sm:text-base font-bold text-text-primary truncate">
            {title}
          </h1>
        </div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors shrink-0 px-2 py-1 rounded-lg hover:bg-surface-hover"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{backLabel}</span>
        </Link>
      </div>
    </div>
  );
}
