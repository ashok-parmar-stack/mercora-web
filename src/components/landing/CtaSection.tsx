"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";

interface CtaSectionProps {}

export default function CtaSection({}: CtaSectionProps) {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuth = mounted && isAuthenticated;
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: "var(--theme-canvas)" }}>
      <div className="container relative z-10">
        <div
          className="rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden border transition-all"
          style={{
            background: "var(--landing-banner-bg)",
            borderColor: "var(--landing-banner-border)",
            boxShadow: "var(--landing-banner-shadow)",
          }}
        >
          {/* Configurable Dynamic Radial Glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: "var(--landing-banner-radial)",
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Pill Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6 uppercase tracking-wider"
              style={{
                background: "var(--theme-blush)",
                color: "var(--theme-red)",
                border: "1px solid var(--landing-banner-border)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--theme-red)" }} />
              <span>Scale With Deterministic Precision</span>
            </div>

            <h2
              className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight"
              style={{ color: "#ffffff" }}
            >
              Ready to Upgrade Your Enterprise Master Data?
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed mb-8"
              style={{ color: "var(--theme-gray-300)" }}
            >
              Eliminate address ambiguity, catalog chaos, and credential leakage. Experience Mercora Deal OS in action right now.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Link
                href="/admin"
                className="btn-red flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all"
                style={{ textDecoration: "none" }}
              >
                <span>Launch Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {isAuth ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                  style={{
                    textDecoration: "none",
                    background: "rgba(255, 255, 255, 0.08)",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <LayoutDashboard className="w-4 h-4 text-red-400" />
                  <span>Customer Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                  style={{
                    textDecoration: "none",
                    background: "rgba(255, 255, 255, 0.08)",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <span>Sign In to Organization</span>
                </Link>
              )}
            </div>

            {/* Proof Points */}
            <div
              className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium pt-6 border-t"
              style={{
                borderColor: "rgba(255, 255, 255, 0.12)",
                color: "var(--theme-gray-400)",
              }}
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--theme-success, #10b981)" }} />
                <span>Zero Drift Across 8 Geographic Tiers</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--theme-success, #10b981)" }} />
                <span>Dynamic Cascading Postal Resolution</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--theme-success, #10b981)" }} />
                <span>1 User = 1 Device Session Security</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
