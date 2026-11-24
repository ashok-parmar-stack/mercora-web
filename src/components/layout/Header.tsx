"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Heart, User, LogOut, Plus } from "lucide-react";
import { Logo } from "@/components/Logo";
import { MainNavigation } from "./MainNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { APP_HEADERS } from "@/config/headers.config";
import { ThemeToggle } from "../theme/ThemeToggle";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/Button";

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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur-md transition-colors">
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
            className="relative p-2 text-text-secondary hover:text-primary hover:bg-surface-hover rounded-lg transition-colors"
          >
            <Heart className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {savedCount > 9 ? "9+" : savedCount}
              </span>
            )}
          </Link>

          <ThemeToggle />

          {/* Add Business direct action */}
          <Link
            href="/businesses?action=add"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 border border-primary/20 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Business</span>
          </Link>

          {/* Auth buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {isAuth ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-primary hover:bg-surface-hover transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="max-w-[120px] truncate">{user?.name || "Dashboard"}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="p-1.5 text-text-muted hover:text-destructive hover:bg-surface-hover rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    {APP_HEADERS.navigation.auth.login}
                  </Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/register">
                    {APP_HEADERS.navigation.auth.register}
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="md:hidden p-2 text-text-secondary hover:bg-surface-hover rounded-lg"
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
