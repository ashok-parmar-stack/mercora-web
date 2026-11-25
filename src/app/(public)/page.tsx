"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { MetricsStrip } from "@/components/landing/MetricsStrip";
import { WhyMercoraSection } from "@/components/landing/WhyMercoraSection";
import { SimplerPathSection } from "@/components/landing/SimplerPathSection";
import { DirectoryPreviewSection } from "@/components/landing/DirectoryPreviewSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/layout/Footer";
import { DemoRequestModal } from "@/components/landing/DemoRequestModal";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";

export default function HomePage() {
  const { savedCount } = useSavedBusinesses();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans transition-colors">
      <Header
        savedCount={savedCount}
        onRequestDemo={() => setIsDemoModalOpen(true)}
      />
      <main className="flex-1">
        <HeroSection onRequestDemo={() => setIsDemoModalOpen(true)} />
        <MetricsStrip />
        <WhyMercoraSection />
        <SimplerPathSection />
        <DirectoryPreviewSection
          onRequestDemo={() => setIsDemoModalOpen(true)}
        />
        <CtaSection onRequestDemo={() => setIsDemoModalOpen(true)} />
      </main>
      <Footer />
      <DemoRequestModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
}
