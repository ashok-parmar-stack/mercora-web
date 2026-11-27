"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { NavSingleItem } from "./sidebar-navigation.data";
import { Badge } from "@/components/common";

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
      className={`group relative flex items-center rounded-lg border transition-all duration-150 ${
        isCollapsed
          ? `justify-center p-2 ${
              isActive
                ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border-white/25 shadow-xs"
                : "border-transparent text-[var(--sidebar-text)] hover:text-white hover:bg-white/10 hover:border-white/15"
            }`
          : `gap-2.5 px-2.5 py-1.5 text-xs ${
              isActive
                ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border-white/25 font-semibold shadow-xs"
                : "border-transparent text-[var(--sidebar-text)] hover:text-white hover:bg-white/10 hover:border-white/15 font-medium"
            }`
      }`}
    >
      {!isCollapsed && (
        <span
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r-full transition-all duration-150 ${
            isActive
              ? "h-4 bg-white"
              : "h-0 bg-white/40 group-hover:h-2.5 opacity-0 group-hover:opacity-100"
          }`}
        />
      )}

      <div
        className={`flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
          isCollapsed
            ? "w-6 h-6"
            : `w-6 h-6 rounded-md ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-[var(--sidebar-text)] group-hover:text-white group-hover:bg-white/10"
              }`
        }`}
      >
        <Icon className="w-3.5 h-3.5 transition-transform duration-150 group-hover:scale-105" />
      </div>

      {!isCollapsed && (
        <span className="truncate transition-transform duration-150 group-hover:translate-x-0.5">
          {entry.label}
        </span>
      )}

      {!isCollapsed && entry.badge && (
        <Badge variant="brand" size="sm" className="ml-auto text-[10px]">
          {entry.badge}
        </Badge>
      )}

      {!isCollapsed && !isActive && !entry.badge && (
        <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white/60 -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-150 ml-auto flex-shrink-0" />
      )}

      {isCollapsed && (
        <div className="opacity-0 pointer-events-none group-hover:opacity-100 absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-surface-raised border border-border text-text-primary text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 transition-opacity duration-150">
          {entry.label}
        </div>
      )}
    </Link>
  );
}
