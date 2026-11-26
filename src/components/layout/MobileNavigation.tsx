"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Bookmark, ChevronRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuthStore } from "@/lib/store/auth-store";
import { logoutServerAction } from "@/app/actions/auth-actions";
import { getUserDisplayRole, getUserInitials } from "@/lib/auth-helpers";
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
  const avatarInitials = getUserInitials(user?.name, "U");
  const roleLabel = getUserDisplayRole(user);

  const menuContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-[9999] lg:hidden flex flex-col bg-[#FFF7F5] dark:bg-[#1A0B14] text-text-primary h-[100dvh] w-full overflow-hidden select-none"
      style={{ zIndex: 99999, opacity: 1 }}
    >
      {/* ── Top Bar: always full-width, never max-capped ── */}
      <div className="h-16 border-b border-border bg-surface shrink-0 shadow-2xs px-4 sm:px-6 flex items-center justify-between gap-3">
        <Link href="/" onClick={onClose} className="inline-flex items-center min-w-0 shrink">
          <Logo height={28} />
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle className="!w-9 !h-9" />
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-hover/80 text-text-primary hover:bg-surface-hover border border-border transition-colors cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Scrollable Menu Content ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-lg mx-auto w-full px-4 py-5 flex flex-col gap-5 pb-10">

          {/* Navigation Links Group */}
          <div className="flex flex-col gap-2">
            <span className="px-1 text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Navigation
            </span>

            <nav className="rounded-2xl border border-border bg-surface divide-y divide-border overflow-hidden shadow-2xs">
              {PRIMARY_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : !item.href.startsWith("/#") && pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between px-4 py-3.5 transition-colors ${
                      isActive
                        ? "bg-primary/8 text-primary font-semibold"
                        : "text-text-primary hover:bg-surface-hover/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 ${
                          isActive ? "text-primary" : "text-text-muted group-hover:text-primary"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight">
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="text-[11px] text-text-muted truncate mt-0.5 leading-tight">
                            {item.description}
                          </p>
                        )}
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

              {/* Saved Businesses */}
              <Link
                href="/saved-businesses"
                onClick={onClose}
                className={`group flex items-center justify-between px-4 py-3.5 transition-colors ${
                  pathname === "/saved-businesses"
                    ? "bg-primary/8 text-primary font-semibold"
                    : "text-text-primary hover:bg-surface-hover/60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Bookmark
                    className={`w-[18px] h-[18px] shrink-0 ${
                      pathname === "/saved-businesses"
                        ? "text-primary"
                        : "text-text-muted group-hover:text-primary"
                    }`}
                  />
                  <p className="text-sm font-medium leading-tight">
                    Saved Businesses
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {savedCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
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
            onLogout={async () => {
              try {
                await logoutServerAction();
              } catch {
                // ignore
              }
              logout();
              onClose();
              window.location.replace("/login");
            }}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
}

export default MobileNavigation;
