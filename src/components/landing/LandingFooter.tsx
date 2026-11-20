"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function LandingFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--theme-glass-border)",
        background: "var(--theme-card-bg)",
      }}
    >
      <div className="container py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          {/* Brand & Copyright */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <Link href="/" className="inline-flex items-center" aria-label="Mercora Home">
              <Logo height={24} />
            </Link>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span>&copy; {new Date().getFullYear()} Mercora Technologies. All rights reserved.</span>
          </div>

          {/* Essential Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-5 font-medium" style={{ color: "var(--theme-gray-600)" }}>
            <a href="#geography" className="hover:text-red-600 transition-colors">
              Geography
            </a>
            <a href="#taxonomy" className="hover:text-red-600 transition-colors">
              Customs &amp; HSN
            </a>
            <a href="#security" className="hover:text-red-600 transition-colors">
              Security
            </a>
            <Link href="/login" className="hover:text-red-600 transition-colors">
              Sign In
            </Link>
            <Link href="/admin" className="hover:text-red-600 transition-colors font-bold" style={{ color: "var(--theme-red)" }}>
              Console &rarr;
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
