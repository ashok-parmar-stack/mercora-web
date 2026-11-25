"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  FileText,
  CheckSquare,
} from "lucide-react";
import { DemoRequestModal } from "./DemoRequestModal";

interface HeroSectionProps {
  onRequestDemo?: () => void;
}

export function HeroSection({ onRequestDemo }: HeroSectionProps) {
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
      id="platform"
      className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 text-white select-none transition-colors"
      style={{
        background:
          "radial-gradient(ellipse at 85% 20%, #3D1526 0%, #240C1A 45%, #150610 100%)",
      }}
    >
      {/* Subtle top ambient rose glow */}
      <div
        className="pointer-events-none absolute -top-32 right-1/4 w-[600px] h-[400px] rounded-full opacity-25 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #E5A8BA 0%, #7F1D3F 60%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Kicker */}
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold tracking-widest text-[#E5A8BA] uppercase">
              <span className="w-4 h-[1.5px] bg-[#E5A8BA]" />
              <span>THE CONNECTED TRADE WORKSPACE</span>
            </div>

            {/* Display Headline with soft rose highlight */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.12] mb-6">
              From business discovery to{" "}
              <span className="text-[#E5A8BA]">deal momentum.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-xl font-normal">
              Mercora brings partner information, requests, and deal workflows
              into one clearer place—so teams can find the right businesses and
              move forward with confidence.
            </p>

            {/* Action Buttons: Exact same unified button pair */}
            <div className="flex flex-wrap items-center gap-3.5 mb-6 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleOpenDemo}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#7F1D3F] hover:bg-[#99224B] text-white shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Request a demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/businesses"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white hover:bg-white/90 text-[#2B1220] shadow-sm transition-all active:scale-[0.99]"
              >
                Explore businesses
              </Link>
            </div>

            {/* Explanatory footnote */}
            <a
              href="#operating-view"
              className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Explore an illustrative view of the platform below</span>
            </a>
          </div>

          {/* Right Column: Floating Browser Card Mockup */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl border border-white/20 p-5 sm:p-6 text-slate-800 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
              {/* Browser Window Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  MERCORA
                </span>
              </div>

              {/* Card Sub-kicker & Greeting */}
              <div className="mb-4 text-left">
                <div className="text-[10px] font-bold text-[#8B2648] tracking-wider uppercase mb-1">
                  CONNECTED OVERVIEW
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Good morning, team
                </h2>
              </div>

              {/* 3 Metric Mini Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                <div className="bg-[#FAF4F6] border border-[#F2E4E9] rounded-xl p-2.5 text-left">
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                    06
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                    categorized partner profiles
                  </div>
                </div>

                <div className="bg-[#FAF4F6] border border-[#F2E4E9] rounded-xl p-2.5 text-left">
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                    04
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                    business categories
                  </div>
                </div>

                <div className="bg-[#FAF4F6] border border-[#F2E4E9] rounded-xl p-2.5 text-left">
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                    03
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                    structured execution steps
                  </div>
                </div>
              </div>

              {/* 3 Action / Workflow List Items */}
              <div className="space-y-2.5">
                {/* Row 1: Discover partners */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#F2E4E9] hover:bg-[#FAF4F6]/50 transition-colors">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-[#FDF0F3] text-[#7F1D3F] flex items-center justify-center shrink-0">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Discover partners
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Explore verified capabilities
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/businesses"
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    Explore
                  </Link>
                </div>

                {/* Row 2: Start a request */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#F2E4E9] hover:bg-[#FAF4F6]/50 transition-colors">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-[#FDF0F3] text-[#7F1D3F] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Start a request
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Gather your requirements
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenDemo}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    Contact
                  </button>
                </div>

                {/* Row 3: Keep work moving */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#F2E4E9] hover:bg-[#FAF4F6]/50 transition-colors">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-[#FDF0F3] text-[#7F1D3F] flex items-center justify-center shrink-0">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Keep work moving
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Follow the next steps
                      </div>
                    </div>
                  </div>
                  <a
                    href="#how-it-works"
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    Preview
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Demo Request Modal fallback if no prop provided */}
      {!onRequestDemo && (
        <DemoRequestModal
          isOpen={internalDemoOpen}
          onClose={() => setInternalDemoOpen(false)}
        />
      )}
    </section>
  );
}

export default HeroSection;