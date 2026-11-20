"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { NavSingleItem } from "./sidebar-navigation.data";

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
          ? `justify-center p-2 ${
              isActive
                ? "bg-brand-600 text-white shadow-xs dark:bg-white dark:text-black"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/90 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.08]"
            }`
          : `gap-3 px-3 py-2 text-xs transition-all duration-200 ${
              isActive
                ? "bg-brand-50/90 text-brand-950 font-bold border border-brand-200/90 shadow-2xs dark:bg-white/[0.12] dark:text-white dark:border-white/20"
                : "text-gray-600 hover:text-gray-950 hover:bg-gray-100/80 hover:border-gray-200/70 border border-transparent font-medium dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.06] dark:hover:border-white/10"
            }`
      }`}
    >
      {!isCollapsed && (
        <span
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-200 ${
            isActive
              ? "h-4 bg-brand-600 shadow-[0_0_8px_rgba(238,49,53,0.5)] dark:bg-white dark:shadow-none"
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
                  ? "bg-brand-600 text-white shadow-xs dark:bg-white dark:text-black"
                  : "bg-gray-100/80 text-gray-500 border border-transparent group-hover:bg-white group-hover:border-gray-200/80 group-hover:text-brand-600 group-hover:shadow-xs dark:bg-white/[0.05] dark:text-gray-400 dark:group-hover:bg-neutral-800 dark:group-hover:text-white dark:group-hover:border-neutral-700"
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

      {!isCollapsed && !isActive && (
        <ChevronRight className="w-3.5 h-3.5 text-gray-400/0 group-hover:text-gray-400 -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-auto flex-shrink-0" />
      )}

      {isCollapsed && (
        <div className="opacity-0 pointer-events-none group-hover:opacity-100 absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-gray-900 text-white dark:bg-gray-800 dark:border dark:border-gray-700/60 text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 transition-opacity duration-150">
          {entry.label}
        </div>
      )}
    </Link>
  );
}
