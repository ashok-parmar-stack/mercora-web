"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { DemoRequestModal } from "./DemoRequestModal";
import { Button } from "@/components/common";

export default function CtaSection() {
  const [mounted, setMounted] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuth = mounted && isAuthenticated;

  return (
    <section className="py-20 relative overflow-hidden bg-[var(--background)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Linear Deep Plum Banner Container */}
        <div className="rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden border border-[#3D1B2E] bg-[var(--nav-dark,#2B1220)] text-white shadow-xl">
          {/* Subtle Wine & Berry Ambient Radial Mesh Glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-35"
            style={{
              background:
                "radial-gradient(ellipse at 50% 15%, #7F1D3F 0%, #A63D5A 30%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Linear Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold mb-6 uppercase tracking-wider bg-white/10 text-[#F2D9DF] border border-white/15 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C08497]" />
              <span>Scale With Deterministic Precision</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight text-white">
              Ready to Upgrade Your Enterprise Master Data?
            </h2>

            <p className="text-base sm:text-lg leading-relaxed mb-8 text-[#E5D4DA]/80 font-normal">
              Eliminate address ambiguity, catalog chaos, and credential leakage. Experience Mercora Deal OS in action right now.
            </p>

            {/* CTAs - Matching Exact START FREE & BOOK A DEMO design */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <Button
                variant="primary"
                size="lg"
                className="px-8 py-3.5 font-bold tracking-wide uppercase text-xs shadow-md transition-all hover:scale-[1.01]"
                asChild
              >
                <Link href={isAuth ? "/admin" : "/register"}>
                  <span>{isAuth ? "ENTER CONSOLE" : "START FREE"}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsDemoModalOpen(true)}
                className="px-8 py-3.5 font-bold tracking-wide uppercase text-xs bg-white/10 hover:bg-white/20 text-white border border-white/25 shadow-sm transition-all hover:scale-[1.01]"
              >
                <span className="text-white font-bold">BOOK A DEMO</span>
              </Button>
            </div>

            {/* Proof Points with Emerald Status Indicators in Clean 3-Column Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs font-medium text-white/80">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Drift in 8 Tiers</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dynamic Postal Resolution</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1 User = 1 Device Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DemoRequestModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </section>
  );
}
