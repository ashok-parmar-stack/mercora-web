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
      className={`group relative flex items-center rounded-lg transition-all duration-150 ${
        isCollapsed
          ? `justify-center p-2 ${
              isActive
                ? "bg-primary text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
            }`
          : `gap-2.5 px-2.5 py-1.5 text-xs transition-all duration-150 ${
              isActive
                ? "bg-primary/10 text-primary font-semibold border border-primary/20 dark:bg-primary/20 dark:text-brand-burgundy-light dark:border-primary/30"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent font-medium"
            }`
      }`}
    >
      {!isCollapsed && (
        <span
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r-full transition-all duration-150 ${
            isActive
              ? "h-4 bg-primary"
              : "h-0 bg-primary/40 group-hover:h-2.5 opacity-0 group-hover:opacity-100"
          }`}
        />
      )}

      <div
        className={`flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
          isCollapsed
            ? "w-6 h-6"
            : `w-6 h-6 rounded-md ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-surface-hover text-text-secondary group-hover:text-primary group-hover:bg-surface"
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
        <ChevronRight className="w-3 h-3 text-text-muted/0 group-hover:text-text-muted -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-150 ml-auto flex-shrink-0" />
      )}

      {isCollapsed && (
        <div className="opacity-0 pointer-events-none group-hover:opacity-100 absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-surface-raised border border-border text-text-primary text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 transition-opacity duration-150">
          {entry.label}
        </div>
      )}
    </Link>
  );
}
