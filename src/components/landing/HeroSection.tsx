"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Database, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { DemoRequestModal } from "./DemoRequestModal";
import { Button, Badge } from "@/components/common";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuth = mounted && isAuthenticated;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-18 md:pb-28 bg-[var(--background)] transition-colors">
      {/* Linear-Style Radial Mesh Ambient Glow (Deep Plum & Wine) */}
      <div
        className="pointer-events-none absolute -top-44 left-1/2 -translate-x-1/2 w-[760px] h-[520px] rounded-full opacity-20 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, #7F1D3F 0%, #2B1220 50%, rgba(43, 18, 32, 0) 80%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl flex flex-col items-start text-left">
          {/* Announcement Pill with Pulsing Status Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-wide bg-brand-blush text-brand-wine border border-brand-rose/30 shadow-2xs">
            <span
              className="w-2 h-2 rounded-full bg-brand-wine shrink-0 shadow-[0_0_8px_rgba(127,29,63,0.8)] animate-pulse"
              aria-hidden="true"
            />
            <span>OFFICIAL LGD &amp; INDIA POST SYNCED · ZERO DRIFT</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.08] mb-6">
            Deterministic Master Data &amp;{" "}
            <span className="bg-gradient-to-r from-brand-wine via-brand-berry to-brand-darkWine bg-clip-text text-transparent">
              Deal OS
            </span>{" "}
            for Modern B2B Commerce.
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-8 max-w-2xl font-normal">
            Eliminates catalog drift, address failures, and credential sharing with an official{" "}
            <strong className="text-text-primary font-semibold">
              8-tier Indian government geography directory
            </strong>
            , Flipkart-grade product taxonomy, GST HSN customs tariff classification, and dual-layer RBAC/UBAC governance.
          </p>

          {/* Action CTAs - Linear High-Craft Common Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mb-12 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="px-8 py-3.5 font-bold tracking-wide uppercase text-xs shadow-md bg-brand-wine hover:bg-brand-darkWine text-white transition-all hover:scale-[1.01]"
              asChild
            >
              <Link href={isAuth ? "/admin" : "/register"}>
                <span>{isAuth ? "ENTER CONSOLE" : "START FREE"}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsDemoModalOpen(true)}
              className="px-8 py-3.5 font-bold tracking-wide uppercase text-xs shadow-2xs border-brand-plum text-brand-plum bg-surface hover:bg-brand-blush/40 dark:border-white/30 dark:text-white dark:hover:bg-white/10 transition-all hover:scale-[1.01]"
            >
              <span className="font-bold">BOOK A DEMO</span>
            </Button>
          </div>

          {/* Linear-Inspired Micro Proof Stats (Deal OS Palette) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border w-full max-w-2xl">
            <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs flex flex-col justify-center">
              <div className="text-2xl font-extrabold tracking-tight text-text-primary">
                8 Tiers
              </div>
              <div className="text-[11px] text-text-muted font-medium uppercase tracking-wider mt-0.5">
                National to Post Office
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs flex flex-col justify-center">
              <div className="text-2xl font-extrabold tracking-tight text-brand-wine">
                19,000+
              </div>
              <div className="text-[11px] text-text-muted font-medium uppercase tracking-wider mt-0.5">
                PIN Codes Synced
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs flex flex-col justify-center">
              <div className="text-2xl font-extrabold tracking-tight text-text-primary">
                1 User = 1
              </div>
              <div className="text-[11px] text-text-muted font-medium uppercase tracking-wider mt-0.5">
                Single Session Policy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book a Demo Interactive Modal */}
      <DemoRequestModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </section>
  );
}

export default HeroSection;
