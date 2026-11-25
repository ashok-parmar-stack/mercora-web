"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bookmark,
  User,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { MainNavigation } from "./MainNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { APP_HEADERS } from "@/config/headers.config";
import { ThemeToggle } from "../theme/ThemeToggle";
import { useAuthStore } from "@/lib/store/auth-store";
import { logoutServerAction } from "@/app/actions/auth-actions";
import { getUserDisplayRole, getUserInitials, isAdminRole } from "@/lib/auth-helpers";
import {
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/common";

export interface HeaderProps {
  savedCount?: number;
}

export function Header({ savedCount = 0 }: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuth = mounted && isAuthenticated;
  const avatarInitials = getUserInitials(user?.name, "U");
  const roleName = getUserDisplayRole(user);
  const canAccessAdmin = isAdminRole(user);

  const handleSignOut = async () => {
    try {
      await logoutServerAction();
    } catch {
      // Ignore network errors during logout cleanup
    } finally {
      logout();
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[var(--header-bg)] backdrop-blur-md transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6 min-w-0">
          <Link href="/" className="inline-flex items-center shrink-0" aria-label="Mercora Home">
            <Logo height={30} />
          </Link>

          {/* Desktop Nav */}
          <MainNavigation />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Saved Businesses Instagram-style Bookmark shortcut */}
          <Link
            href="/saved-businesses"
            aria-label="Saved businesses"
            title="Saved Businesses"
            className="relative p-2 text-text-secondary hover:text-primary hover:bg-surface-hover rounded-xl transition-colors shrink-0"
          >
            <Bookmark className={`w-5 h-5 ${savedCount > 0 ? "text-primary fill-primary/20" : ""}`} />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {savedCount > 9 ? "9+" : savedCount}
              </span>
            )}
          </Link>

          <div className="shrink-0">
            <ThemeToggle />
          </div>

          {/* Auth Zone: Clean profile dropdown or login/register buttons */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {isAuth ? (
              <div className="flex items-center gap-2">
                {canAccessAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden xl:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold border-border bg-surface text-text-secondary hover:text-primary hover:bg-surface-hover hover:border-primary/40 transition-colors shadow-2xs select-none"
                    asChild
                  >
                    <Link href="/admin" title="Open Admin Console">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                      <span>Admin Console</span>
                    </Link>
                  </Button>
                )}

                {/* Proper User Profile Dropdown Menu */}
                <DropdownMenu
                  align="right"
                  trigger={
                    <div className="flex items-center gap-2 h-9 px-2.5 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-primary/30 transition-colors select-none shadow-2xs cursor-pointer">
                      <div className="w-6 h-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-xs">
                        {avatarInitials}
                      </div>
                      <span className="text-xs font-semibold text-text-primary max-w-[110px] truncate hidden xl:inline-block">
                        {user?.name || "Account"}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                    </div>
                  }
                  className="w-56 p-1.5"
                >
                  <div className="px-2.5 py-2 mb-1">
                    <p className="text-xs font-bold text-text-primary truncate">
                      {user?.name || "Authenticated User"}
                    </p>
                    <p className="text-[11px] text-text-muted truncate">
                      {user?.email || ""}
                    </p>
                    <div className="mt-1.5">
                      <Badge variant="brand" size="sm">
                        {roleName}
                      </Badge>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {canAccessAdmin ? (
                    <DropdownMenuItem
                      onClick={() => router.push("/admin")}
                      icon={<ShieldCheck className="w-3.5 h-3.5 text-primary" />}
                    >
                      Admin Console
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard")}
                      icon={<User className="w-3.5 h-3.5 text-primary" />}
                    >
                      Buyer Dashboard
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => router.push(canAccessAdmin ? "/admin/profile" : "/profile")}
                    icon={<Settings className="w-3.5 h-3.5 text-text-muted" />}
                  >
                    Profile Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    destructive
                    onClick={handleSignOut}
                    icon={<LogOut className="w-3.5 h-3.5" />}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    {APP_HEADERS.navigation.auth.login}
                  </Link>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="shadow-xs font-semibold"
                  asChild
                >
                  <Link href="/register">
                    {APP_HEADERS.navigation.auth.register}
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile & Tablet hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-xl cursor-pointer shrink-0 transition-colors"
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

export default Header;
