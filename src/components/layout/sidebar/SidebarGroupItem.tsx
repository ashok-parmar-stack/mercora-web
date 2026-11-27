"use client";

import React, { useRef, useState, useEffect } from "react";
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

function isChildRouteActive(
  childHref: string,
  pathname: string | null,
  siblings: Array<{ href: string }>,
): boolean {
  if (!pathname) return false;
  if (pathname === childHref) return true;
  if (childHref === "/admin") return false;
  if (!pathname.startsWith(`${childHref}/`)) return false;
  // Do not mark a parent overview route (e.g. /admin/payments) active when a deeper sibling route matches
  return !siblings.some(
    (other) =>
      other.href !== childHref &&
      other.href.startsWith(`${childHref}/`) &&
      (pathname === other.href || pathname.startsWith(`${other.href}/`))
  );
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
  const triggerRef = useRef<HTMLDivElement>(null);
  const [flyoutPos, setFlyoutPos] = useState<{
    left: number;
    top?: number;
    bottom?: number;
  } | null>(null);

  const isAnyChildActive = entry.children.some((c) =>
    isChildRouteActive(c.href, pathname, entry.children)
  );

  const isMenuOpen = isCollapsed && (isHovered || isPinned);

  useEffect(() => {
    if (!isMenuOpen || !triggerRef.current) {
      setFlyoutPos(null);
      return;
    }

    const updatePosition = () => {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const estimatedMenuHeight = 56 + entry.children.length * 36;
      const spaceBelow = window.innerHeight - rect.top;

      if (spaceBelow < estimatedMenuHeight + 16) {
        setFlyoutPos({
          left: rect.right,
          bottom: Math.max(12, window.innerHeight - rect.bottom),
        });
      } else {
        setFlyoutPos({
          left: rect.right,
          top: Math.max(12, rect.top),
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isMenuOpen, entry.children.length]);

  if (isCollapsed) {
    return (
      <div
        ref={triggerRef}
        className="relative group"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <button
          type="button"
          onClick={onPinClick}
          className={`w-full flex items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
            isAnyChildActive || isMenuOpen
              ? "bg-[var(--sidebar-active-bg)] text-white border-white/25 shadow-xs"
              : "border-transparent text-[var(--sidebar-text)] hover:bg-white/10 hover:text-white hover:border-white/15"
          }`}
          aria-label={entry.label}
          title={isPinned ? `${entry.label} (Pinned - click to close)` : `${entry.label} (Click to keep open)`}
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        </button>

        {isMenuOpen && flyoutPos && (
          <div
            style={{
              left: `${flyoutPos.left}px`,
              ...(flyoutPos.top !== undefined ? { top: `${flyoutPos.top}px` } : {}),
              ...(flyoutPos.bottom !== undefined ? { bottom: `${flyoutPos.bottom}px` } : {}),
            }}
            className="fixed pl-3 w-64 z-50 pointer-events-auto"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <div className="absolute -left-2 top-0 bottom-0 w-5 pointer-events-auto" />
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
                  const isChildActive = isChildRouteActive(
                    child.href,
                    pathname,
                    entry.children
                  );

                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onChildClick}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isChildActive
                          ? "bg-primary/10 text-primary font-semibold"
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
        className={`group relative w-full flex items-center justify-between rounded-lg border px-2.5 py-1.5 transition-all duration-150 cursor-pointer ${
          isAnyChildActive
            ? "bg-white/10 text-white border-white/20 font-semibold"
            : "border-transparent text-[var(--sidebar-text)] hover:text-white hover:bg-white/10 hover:border-white/15 font-medium"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-md transition-all duration-150 ${
              isAnyChildActive
                ? "bg-[var(--sidebar-active-bg)] text-white shadow-xs"
                : "bg-white/5 text-[var(--sidebar-text)] group-hover:text-white group-hover:bg-white/10"
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
                ? "bg-white/20 text-white"
                : "bg-white/10 text-white/60"
            }`}
          >
            {entry.children.length}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-white/50 transition-transform duration-150 ${
              isOpen ? "rotate-180 text-white" : "group-hover:text-white"
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="ml-3.5 pl-3 border-l border-white/15 flex flex-col gap-0.5 mt-1 pt-0.5 pb-1 animate-in fade-in duration-150">
          {entry.children.map((child) => {
            const ChildIcon = child.icon;
            const isChildActive = isChildRouteActive(
              child.href,
              pathname,
              entry.children
            );

            return (
              <Link
                key={child.href}
                href={child.href}
                className={`group/child flex items-center gap-2 px-2 py-1.5 rounded-lg border text-xs transition-all duration-150 relative ${
                  isChildActive
                    ? "bg-[var(--sidebar-active-bg)] text-white border-white/25 font-semibold shadow-xs"
                    : "border-transparent text-[var(--sidebar-text)] hover:text-white hover:bg-white/10 hover:border-white/15 font-medium"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-md flex-shrink-0 transition-all duration-150 ${
                    isChildActive
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/60 group-hover/child:text-white"
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
