"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { DemoRequestModal } from "@/components/landing/DemoRequestModal";

export function Footer() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <footer className="w-full bg-[#16050F] text-[#E5D4DA] border-t border-white/10 select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-white/10">
          {/* Brand & Tagline */}
          <div className="space-y-3 max-w-sm text-left">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="Mercora Home"
            >
              <Logo height={26} dark={true} />
            </Link>
            <p className="text-xs text-[#E5D4DA]/70 leading-relaxed font-normal">
              Business information, partner discovery, and deal
              operations—better connected.
            </p>
          </div>

          {/* Quick horizontal links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-medium text-[#E5D4DA]/80">
            <a
              href="#platform"
              className="hover:text-white transition-colors"
            >
              Platform
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How it works
            </a>
            <Link
              href="/businesses"
              className="hover:text-white transition-colors"
            >
              Businesses
            </Link>
            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
            <Link
              href="/admin"
              className="hover:text-white transition-colors opacity-60 hover:opacity-100"
            >
              Admin Console
            </Link>
          </nav>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#E5D4DA]/50 gap-3">
          <p>© {new Date().getFullYear()} Mercora</p>
          <p>Illustrative directory preview and workflow concept.</p>
        </div>
      </div>

      <DemoRequestModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </footer>
  );
}

export default Footer;