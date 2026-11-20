"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Heart, User, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { MainNavigation } from "./MainNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { APP_HEADERS } from "@/config/headers.config";
import { ThemeToggle } from "../theme/ThemeToggle";
import { useAuthStore } from "@/lib/store/auth-store";

export interface HeaderProps {
  savedCount?: number;
}

export function Header({ savedCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuth = mounted && isAuthenticated;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="inline-flex items-center shrink-0" aria-label="Mercora Home">
            <Logo height={32} />
          </Link>

          {/* Desktop Nav */}
          <MainNavigation />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Saved Businesses Heart shortcut */}
          <Link
            href="/saved-businesses"
            aria-label="Saved businesses"
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Heart className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {savedCount > 9 ? "9+" : savedCount}
              </span>
            )}
          </Link>

          <ThemeToggle />

          {/* Auth buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {isAuth ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-red-600" />
                  <span className="max-w-[120px] truncate">{user?.name || "Dashboard"}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {APP_HEADERS.navigation.auth.login}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-sm hover:shadow"
                >
                  {APP_HEADERS.navigation.auth.register}
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        savedCount={savedCount}
      />
    </header>
  );
}
