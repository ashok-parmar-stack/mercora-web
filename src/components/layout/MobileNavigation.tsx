"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Heart, LogIn, UserPlus, User, LogOut } from "lucide-react";
import { APP_HEADERS } from "@/config/headers.config";
import { useAuthStore } from "@/lib/store/auth-store";

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

  const isAuth = mounted && isAuthenticated;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-surface-raised border-l border-border shadow-2xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="font-semibold text-text-primary">Menu</span>
            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-text-primary rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 mt-4">
            {APP_HEADERS.navigation.links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10 dark:bg-primary/20 font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/saved-businesses"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover mt-2 border-t border-border pt-3"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                <span>Saved Businesses</span>
              </span>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {savedCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-border">
          {isAuth ? (
            <>
              <div className="px-1 text-xs text-slate-500 truncate">
                Signed in as <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name || user?.email}</span>
              </div>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>My Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <LogIn className="w-4 h-4" />
                <span>{APP_HEADERS.navigation.auth.login}</span>
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>{APP_HEADERS.navigation.auth.register}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
