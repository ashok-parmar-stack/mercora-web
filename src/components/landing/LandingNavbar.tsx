"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowRight, Menu, X, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuth = mounted && isAuthenticated;
  const navLinks = [
    { label: "B2B Directory", href: "/businesses" },
    { label: "Geography", href: "#geography" },
    { label: "Customs & HSN", href: "#taxonomy" },
    { label: "Security & RBAC", href: "#security" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md ${
        scrolled ? "shadow-xs" : ""
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="inline-flex items-center shrink-0" aria-label="Mercora Home">
            <Logo height={32} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {isAuth ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-red-600" />
                  <span className="max-w-[120px] truncate">{user?.name || "Dashboard"}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="p-1.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <Link
                  href="/admin"
                  className="btn-red inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap"
                >
                  <span>Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-red-600 transition-colors px-2.5 py-1.5 uppercase tracking-wider"
                >
                  Sign In
                </Link>
                <Link
                  href="/admin"
                  className="btn-red inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm hover:shadow"
                >
                  <span>Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 dark:text-slate-200 py-1.5"
            >
              {item.label}
            </a>
          ))}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {isAuth ? (
              <>
                <div className="text-xs text-slate-500 truncate">
                  Signed in as <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name || user?.email}</span>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn-red py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-center border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                >
                  <span>Admin Console</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-600 border border-slate-200 dark:border-slate-800 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn-red py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2"
                >
                  <span>Launch Admin Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-center border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                >
                  Sign In to Organization
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default LandingNavbar;
