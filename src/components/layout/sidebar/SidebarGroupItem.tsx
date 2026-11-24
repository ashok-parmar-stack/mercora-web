"use client";

import React from "react";
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
          className={`w-full flex items-center justify-center p-2 rounded-lg transition-all cursor-pointer ${
            isAnyChildActive || isMenuOpen
              ? "bg-primary text-white shadow-xs"
              : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
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
            } pl-2 w-64 z-50 pointer-events-auto`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <div className="absolute -left-3 top-0 bottom-0 w-4 pointer-events-auto" />
            <div className="w-60 bg-surface-raised rounded-xl shadow-2xl border border-border py-2.5 px-2 animate-in fade-in slide-in-from-left-2 duration-150">
              <div className="px-2.5 py-1 text-[11px] font-semibold text-text-primary uppercase tracking-wider border-b border-border mb-1.5 flex items-center justify-between">
                <span>{entry.label}</span>
                <div className="flex items-center gap-1.5">
                  {isPinned && (
                    <span className="text-[9px] px-1 py-0.2 bg-primary/10 text-primary rounded font-semibold border border-primary/20">
                      Pinned
                    </span>
                  )}
                  <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-bold border border-primary/20">
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
                          ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20 dark:text-brand-burgundy-light"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                      }`}
                    >
                      <ChildIcon
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isChildActive ? "text-primary" : "text-text-muted"
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
        className={`group relative w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-all duration-150 cursor-pointer ${
          isAnyChildActive
            ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-brand-burgundy-light font-semibold border border-primary/20"
            : "text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent font-medium"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-md transition-all duration-150 ${
              isAnyChildActive
                ? "bg-primary text-white shadow-xs"
                : "bg-surface-hover text-text-secondary group-hover:text-primary group-hover:bg-surface"
            }`}
          >
            <Icon className="w-3.5 h-3.5 transition-transform duration-150 group-hover:scale-105" />
          </div>
          <span className="truncate text-xs transition-transform duration-150 group-hover:translate-x-0.5">
            {entry.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
          <span
            className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold transition-colors ${
              isAnyChildActive
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-surface-hover text-text-muted"
            }`}
          >
            {entry.children.length}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-text-muted transition-transform duration-150 ${
              isOpen ? "rotate-180 text-primary" : "group-hover:text-text-secondary"
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="ml-3.5 pl-3 border-l-2 border-primary/20 flex flex-col gap-0.5 mt-1 pt-0.5 pb-1 animate-in fade-in duration-150">
          {entry.children.map((child) => {
            const ChildIcon = child.icon;
            const isChildActive =
              pathname === child.href ||
              (child.href !== "/admin" && pathname?.startsWith(child.href));

            return (
              <Link
                key={child.href}
                href={child.href}
                className={`group/child flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all duration-150 relative ${
                  isChildActive
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-brand-burgundy-light font-semibold border border-primary/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent font-medium"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-md flex-shrink-0 transition-all duration-150 ${
                    isChildActive
                      ? "bg-primary text-white"
                      : "bg-surface-hover text-text-muted group-hover/child:text-primary"
                  }`}
                >
                  <ChildIcon className="w-3 h-3 transition-transform duration-150 group-hover/child:scale-105" />
                </div>
                <span className="truncate group-hover/child:translate-x-0.5 transition-transform duration-150 text-[11.5px]">
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
