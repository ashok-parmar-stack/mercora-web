"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { NavSingleItem } from "./sidebar-navigation.data";
import { Badge } from "@/components/ui/Badge";

interface SidebarSingleItemProps {
  entry: NavSingleItem;
  pathname: string | null;
  isCollapsed: boolean;
}

export function SidebarSingleItem({ entry, pathname, isCollapsed }: SidebarSingleItemProps) {
  const Icon = entry.icon;
  const isActive =
    pathname === entry.href ||
    (entry.href !== "/admin" && pathname?.startsWith(entry.href));

  return (
    <Link
      href={entry.href}
      className={`group relative flex items-center rounded-xl transition-all duration-200 ${
        isCollapsed
          ? `justify-center p-2.5 ${
              isActive
                ? "bg-brand-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/90 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60"
            }`
          : `gap-3 px-3 py-2 text-xs transition-all duration-200 ${
              isActive
                ? "bg-brand-50/90 text-brand-950 font-bold border border-brand-200/80 shadow-2xs dark:bg-brand-950/40 dark:text-brand-200 dark:border-brand-800/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:border-slate-200/70 border border-transparent font-medium dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50 dark:hover:border-slate-700/40"
            }`
      }`}
    >
      {!isCollapsed && (
        <span
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-200 ${
            isActive
              ? "h-5 bg-brand-600 dark:bg-brand-400 shadow-sm"
              : "h-0 bg-brand-400/80 group-hover:h-3 opacity-0 group-hover:opacity-100"
          }`}
        />
      )}

      <div
        className={`flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          isCollapsed
            ? "w-6 h-6"
            : `w-7 h-7 rounded-lg ${
                isActive
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-500 border border-transparent group-hover:bg-white group-hover:border-slate-200/80 group-hover:text-brand-600 group-hover:shadow-xs dark:bg-slate-800/60 dark:text-slate-400 dark:group-hover:bg-slate-800 dark:group-hover:text-brand-300 dark:group-hover:border-slate-700"
              }`
        }`}
      >
        <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
      </div>

      {!isCollapsed && (
        <span className="truncate transition-transform duration-200 group-hover:translate-x-0.5">
          {entry.label}
        </span>
      )}

      {!isCollapsed && entry.badge && (
        <Badge variant="brand" size="sm" className="ml-auto text-[10px]">
          {entry.badge}
        </Badge>
      )}

      {!isCollapsed && !isActive && !entry.badge && (
        <ChevronRight className="w-3.5 h-3.5 text-slate-300/0 group-hover:text-slate-400 -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-auto flex-shrink-0" />
      )}

      {isCollapsed && (
        <div className="opacity-0 pointer-events-none group-hover:opacity-100 absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white dark:bg-slate-800 dark:border dark:border-slate-700/60 text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 transition-opacity duration-150">
          {entry.label}
        </div>
      )}
    </Link>
  );
}
