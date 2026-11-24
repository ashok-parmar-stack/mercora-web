"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { SimpleFeaturesSection } from "@/components/landing/SimpleFeaturesSection";
import CtaSection from "@/components/landing/CtaSection";
import { Footer } from "@/components/layout/Footer";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";

export default function HomePage() {
  const { savedCount } = useSavedBusinesses();

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans transition-colors">
      <Header savedCount={savedCount} />
      <main className="flex-1">
        <HeroSection />
        <SimpleFeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
