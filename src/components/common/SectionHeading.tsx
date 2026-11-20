import React from "react";

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  action,
  badge,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 ${className}`}>
      <div>
        {badge && (
          <span className="inline-block px-2.5 py-0.5 mb-1.5 text-xs font-semibold tracking-wide text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 rounded-full">
            {badge}
          </span>
        )}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
