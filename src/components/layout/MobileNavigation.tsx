"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Heart, ChevronRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuthStore } from "@/lib/store/auth-store";
import { PRIMARY_NAV_ITEMS } from "./mobile-nav/mobile-nav.data";
import { MobileNavAuthSection } from "./mobile-nav/MobileNavAuthSection";

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  savedCount?: number;
}

export function MobileNavigation({
  isOpen,
  onClose,
  savedCount = 0,
}: MobileNavigationProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key listener to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const isAuth = isAuthenticated;
  const avatarInitials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AP";

  const roleLabel =
    typeof user?.role === "object" && user.role !== null
      ? user.role.name || user.role.code
      : user?.role || "SUPER_ADMIN";

  const menuContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-[9999] lg:hidden flex flex-col bg-[#FFF7F5] dark:bg-[#1A0B14] text-text-primary h-[100dvh] w-full max-w-full overflow-hidden select-none"
      style={{
        backgroundColor: "var(--background, #FFF7F5)",
        zIndex: 99999,
        opacity: 1,
      }}
    >
      {/* ── Top Bar ── */}
      <div className="h-16 border-b border-border bg-surface shrink-0 shadow-2xs">
        <div className="max-w-3xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" onClick={onClose} className="inline-flex items-center">
            <Logo height={28} />
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-hover/80 text-text-primary hover:bg-surface-hover border border-border transition-colors cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable Menu Content ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 flex flex-col justify-between gap-6 max-w-3xl mx-auto w-full">
        {/* Navigation Links Group */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Navigation
            </span>
            <span className="text-[11px] font-semibold text-primary">
              Deal OS v2.4
            </span>
          </div>

          <nav className="flex flex-col gap-2">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isActive
                      ? "bg-surface text-primary border-primary/40 shadow-xs ring-1 ring-primary/20 font-bold"
                      : "bg-surface/90 text-text-primary border-border hover:bg-surface hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isActive
                          ? "bg-primary text-white shadow-2xs"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-sm font-bold truncate">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-text-muted font-normal truncate mt-0.5">
                        {item.description}
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                      isActive ? "text-primary" : "text-text-muted"
                    }`}
                  />
                </Link>
              );
            })}

            {/* Saved Businesses Card */}
            <Link
              href="/saved-businesses"
              onClick={onClose}
              className={`group flex items-center justify-between p-3 rounded-2xl border transition-all mt-1 ${
                pathname === "/saved-businesses"
                  ? "bg-surface text-primary border-primary/40 shadow-xs ring-1 ring-primary/20 font-bold"
                  : "bg-surface/90 text-text-primary border-border hover:bg-surface hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-sm font-bold truncate">
                    Saved Businesses
                  </span>
                  <span className="text-[11px] text-text-muted font-normal truncate mt-0.5">
                    Your bookmarked suppliers &amp; partners
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {savedCount > 0 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white shadow-2xs">
                    {savedCount}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-0.5 transition-transform" />
                )}
              </div>
            </Link>
          </nav>
        </div>

        {/* User Identity & Actions Section */}
        <MobileNavAuthSection
          isAuth={isAuth}
          user={user}
          avatarInitials={avatarInitials}
          roleLabel={roleLabel}
          onClose={onClose}
          onLogout={() => {
            logout();
            onClose();
          }}
        />
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
}

export default MobileNavigation;
