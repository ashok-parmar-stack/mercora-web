"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DemoRequestModal } from "./DemoRequestModal";

interface CtaSectionProps {
  onRequestDemo?: () => void;
}

export function CtaSection({ onRequestDemo }: CtaSectionProps) {
  const [internalDemoOpen, setInternalDemoOpen] = useState(false);

  const handleOpenDemo = () => {
    if (onRequestDemo) {
      onRequestDemo();
    } else {
      setInternalDemoOpen(true);
    }
  };

  return (
    <section
      className="py-20 sm:py-28 text-white relative overflow-hidden select-none transition-colors"
      style={{
        background:
          "radial-gradient(ellipse at 50% 20%, #351322 0%, #200B17 55%, #13050F 100%)",
      }}
    >
      {/* Subtle background ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #7F1D3F 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Kicker */}
        <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-widest text-[#E5A8BA] uppercase">
          <span className="w-4 h-[1.5px] bg-[#E5A8BA]" />
          <span>LET'S MOVE FORWARD</span>
        </div>

        {/* Display Headline */}
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">
          Make every business connection count.
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          See how a more connected approach to business information and deal
          operations could work for your team.
        </p>

        {/* Action Buttons: Unified with Hero and Header button styling */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={handleOpenDemo}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#7F1D3F] hover:bg-[#99224B] text-white shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Request a demo</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          <Link
            href="/businesses"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white hover:bg-white/90 text-[#2B1220] shadow-sm transition-all active:scale-[0.99]"
          >
            Explore businesses
          </Link>
        </div>
      </div>

      {/* Internal Modal fallback */}
      {!onRequestDemo && (
        <DemoRequestModal
          isOpen={internalDemoOpen}
          onClose={() => setInternalDemoOpen(false)}
        />
      )}
    </section>
  );
}

export default CtaSection;