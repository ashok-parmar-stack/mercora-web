"use client";

import React from "react";
import { BackButton } from "@/components/common/Button";

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
        <BackButton href={backHref} label={backLabel} className="shrink-0" />
      </div>
    </div>
  );
}
