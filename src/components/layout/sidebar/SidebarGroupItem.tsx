"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { NavGroupItem } from "./sidebar-navigation.data";

interface SidebarGroupItemProps {
  entry: NavGroupItem;
  pathname: string | null;
  isCollapsed: boolean;
  isOpen: boolean;
  isHovered: boolean;
  isPinned: boolean;
  onToggleOpen: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onPinClick: () => void;
  onChildClick: () => void;
}

export function SidebarGroupItem({
  entry,
  pathname,
  isCollapsed,
  isOpen,
  isHovered,
  isPinned,
  onToggleOpen,
  onMouseEnter,
  onMouseLeave,
  onPinClick,
  onChildClick,
}: SidebarGroupItemProps) {
  const Icon = entry.icon;
  const isAnyChildActive = entry.children.some(
    (c) => pathname === c.href || (c.href !== "/admin" && pathname?.startsWith(c.href))
  );

  if (isCollapsed) {
    const isMenuOpen = isHovered || isPinned;

    return (
      <div
        className="relative group"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <button
          type="button"
          onClick={onPinClick}
          className={`w-full flex items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
            isAnyChildActive || isMenuOpen
              ? "bg-brand-500 text-white shadow-xs dark:bg-white dark:text-black"
              : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
          }`}
          aria-label={entry.label}
          title={isPinned ? `${entry.label} (Pinned - click to close)` : `${entry.label} (Click to keep open)`}
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        </button>

        {isMenuOpen && (
          <div
            className={`absolute left-full ${
              entry.id === "geographic-master" ? "bottom-[-10px]" : "top-0"
            } pl-2.5 w-64 z-50 pointer-events-auto`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <div className="absolute -left-3 top-0 bottom-0 w-4 pointer-events-auto" />
            <div className="w-60 bg-[var(--surface)] rounded-xl shadow-2xl border border-[var(--border)] py-2.5 px-2 animate-in fade-in slide-in-from-left-2 duration-150">
              <div className="px-2.5 py-1 text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border)] mb-1.5 flex items-center justify-between">
                <span>{entry.label}</span>
                <div className="flex items-center gap-1.5">
                  {isPinned && (
                    <span className="text-[9px] px-1 py-0.2 bg-white/10 text-white rounded font-semibold border border-white/20">
                      Pinned
                    </span>
                  )}
                  <span className="text-[10px] px-1.5 py-0.5 bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-white rounded-full font-extrabold border border-brand-200 dark:border-white/20">
                    {entry.children.length}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 max-h-[calc(100vh-140px)] overflow-y-auto">
                {entry.children.map((child) => {
                  const ChildIcon = child.icon;
                  const isChildActive =
                    pathname === child.href ||
                    (child.href !== "/admin" && pathname?.startsWith(child.href));

                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onChildClick}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isChildActive
                          ? "bg-brand-50 text-brand-700 dark:bg-white/[0.12] dark:text-white font-bold border border-brand-200/80 dark:border-white/20 shadow-2xs"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] font-medium"
                      }`}
                    >
                      <ChildIcon
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isChildActive ? "text-brand-600 dark:text-white" : "text-[var(--text-muted)]"
                        }`}
                      />
                      <span className="truncate">{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggleOpen}
        className={`group relative w-full flex items-center justify-between rounded-xl px-3 py-2 transition-all duration-200 cursor-pointer ${
          isAnyChildActive
            ? "bg-brand-50/70 text-brand-950 dark:bg-brand-950/40 dark:text-brand-200 font-bold border border-brand-200/80 dark:border-brand-800/40 shadow-2xs"
            : "text-gray-600 hover:text-gray-950 hover:bg-gray-100/80 hover:border-gray-200/70 border border-transparent font-semibold dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.06] dark:hover:border-white/10"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex items-center justify-center flex-shrink-0 w-7 h-7 rounded-lg transition-all duration-200 ${
              isAnyChildActive
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-gray-100/80 text-gray-500 border border-transparent group-hover:bg-white group-hover:border-gray-200/80 group-hover:text-brand-600 group-hover:shadow-xs dark:bg-white/[0.05] dark:text-gray-400 dark:group-hover:bg-gray-800 dark:group-hover:text-brand-400 dark:group-hover:border-gray-700"
            }`}
          >
            <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
          </div>
          <span className="truncate text-xs transition-transform duration-200 group-hover:translate-x-0.5">
            {entry.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
          <span
            className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold transition-colors ${
              isAnyChildActive
                ? "bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 dark:border dark:border-brand-800/40"
                : "bg-gray-100 text-gray-500 group-hover:bg-gray-200/80 group-hover:text-gray-700 dark:bg-white/[0.08] dark:text-gray-400"
            }`}
          >
            {entry.children.length}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-brand-600 dark:text-brand-400" : "group-hover:text-gray-600"
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="ml-4 pl-3.5 border-l-2 border-brand-100/80 dark:border-brand-800/40 flex flex-col gap-0.5 mt-1 pt-0.5 pb-1 animate-in fade-in duration-200">
          {entry.children.map((child) => {
            const ChildIcon = child.icon;
            const isChildActive =
              pathname === child.href ||
              (child.href !== "/admin" && pathname?.startsWith(child.href));

            return (
              <Link
                key={child.href}
                href={child.href}
                className={`group/child flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 relative ${
                  isChildActive
                    ? "bg-brand-50/90 text-brand-900 dark:bg-brand-950/50 dark:text-brand-200 font-bold border border-brand-200/90 dark:border-brand-800/50 shadow-2xs"
                    : "text-gray-600 hover:text-gray-950 hover:bg-gray-100/80 hover:border-gray-200/50 border border-transparent font-medium dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.06]"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-md flex-shrink-0 transition-all duration-200 ${
                    isChildActive
                      ? "bg-brand-600 text-white shadow-2xs"
                      : "bg-gray-100/70 text-gray-400 group-hover/child:bg-white group-hover/child:text-brand-600 group-hover/child:shadow-2xs border border-transparent group-hover/child:border-gray-200/60 dark:bg-white/[0.05] dark:group-hover/child:bg-gray-800 dark:group-hover/child:text-brand-400"
                  }`}
                >
                  <ChildIcon className="w-3 h-3 transition-transform duration-200 group-hover/child:scale-105" />
                </div>
                <span className="truncate group-hover/child:translate-x-0.5 transition-transform duration-200 text-[11.5px]">
                  {child.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
