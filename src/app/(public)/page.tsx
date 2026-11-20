"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { SimpleFeaturesSection } from "@/components/landing/SimpleFeaturesSection";
import CtaSection from "@/components/landing/CtaSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--theme-canvas)",
        color: "var(--theme-ink-darkest)",
      }}
    >
      <LandingNavbar />
      <main style={{ flex: 1 }}>
        <HeroSection />
        <SimpleFeaturesSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
