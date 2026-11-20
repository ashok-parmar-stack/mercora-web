"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuth = mounted && isAuthenticated;
  return (
    <section className="relative overflow-hidden pt-14 pb-20 md:pt-20 md:pb-28">
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[480px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, var(--theme-red) 0%, rgba(238, 49, 53, 0) 70%)",
        }}
      />

      <div className="container relative z-10">
        <div className="max-w-3xl flex flex-col items-start text-left">
          {/* Announcement Pill */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-bold tracking-wide"
            style={{
              background: "var(--theme-blush)",
              border: "1px solid rgba(238, 49, 53, 0.25)",
              color: "var(--theme-red)",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--theme-red)",
                boxShadow: "0 0 8px rgba(238, 49, 53, 0.9)",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
            <span>OFFICIAL LGD &amp; INDIA POST SYNCED · ZERO DRIFT</span>
          </div>

          <h1
            className="font-extrabold tracking-tight"
            style={{
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              lineHeight: "1.08",
              color: "var(--theme-ink-darkest)",
              marginBottom: "20px",
              fontFamily: "var(--theme-font-sans)",
            }}
          >
            Deterministic Master Data &amp;{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--theme-red) 0%, #b91c1c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Deal OS
            </span>{" "}
            for Modern B2B Commerce.
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
              lineHeight: "1.6",
              color: "var(--theme-gray-600)",
              marginBottom: "32px",
              maxWidth: "680px",
            }}
          >
            Eliminates catalog drift, address failures, and credential sharing with an official{" "}
            <strong style={{ color: "var(--theme-ink-darkest)", fontWeight: 700 }}>
              8-tier Indian government geography directory
            </strong>
            , Flipkart-grade product taxonomy, GST HSN customs tariff classification, and dual-layer RBAC/UBAC governance.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
            <Link
              href="/admin"
              className="btn-red flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
              style={{ textDecoration: "none" }}
            >
              <span>Launch Admin Console</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            {isAuth ? (
              <Link
                href="/dashboard"
                className="btn-outline flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all"
                style={{
                  textDecoration: "none",
                  border: "1px solid var(--theme-glass-border)",
                  background: "var(--theme-card-bg)",
                  color: "var(--theme-ink-darkest)",
                }}
              >
                <LayoutDashboard className="w-4 h-4 text-red-600" />
                <span>Go to Customer Hub</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="btn-outline flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all"
                style={{
                  textDecoration: "none",
                  border: "1px solid var(--theme-glass-border)",
                  background: "var(--theme-card-bg)",
                  color: "var(--theme-ink-darkest)",
                }}
              >
                <span>Sign In to Organization</span>
              </Link>
            )}
          </div>

          {/* Micro Proof Stats */}
          <div
            className="grid grid-cols-3 gap-6 pt-6 border-t w-full max-w-xl"
            style={{ borderColor: "var(--theme-glass-border)" }}
          >
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: "var(--theme-ink-darkest)" }}>
                8 Tiers
              </div>
              <div className="text-2xs sm:text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                National to Post Office
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: "var(--theme-red)" }}>
                19,000+
              </div>
              <div className="text-2xs sm:text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                PIN Codes Synced
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: "var(--theme-ink-darkest)" }}>
                1 User = 1
              </div>
              <div className="text-2xs sm:text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                Single Session Policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
