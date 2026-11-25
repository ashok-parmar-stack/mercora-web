"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DemoRequestModal } from "./DemoRequestModal";

interface DirectoryPreviewSectionProps {
  onRequestDemo?: () => void;
}

export function DirectoryPreviewSection({
  onRequestDemo,
}: DirectoryPreviewSectionProps) {
  const [internalDemoOpen, setInternalDemoOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState("Full Suite");

  const handleEnquire = (bizTitle: string) => {
    setSelectedBusiness(bizTitle);
    if (onRequestDemo) {
      onRequestDemo();
    } else {
      setInternalDemoOpen(true);
    }
  };

  const showcase = [
    {
      id: "apex",
      badge: "MANUFACTURING",
      title: "Apex Precision Works",
      description:
        "Precision component manufacturing for industrial supply chains.",
      origin: "India · Sample profile",
    },
    {
      id: "loom",
      badge: "TEXTILES",
      title: "Loom & Line Textiles",
      description: "Textile sourcing and production for growing brands.",
      origin: "India · Sample profile",
    },
    {
      id: "northstar",
      badge: "LOGISTICS",
      title: "Northstar Logistics",
      description: "Regional freight coordination and route logistics.",
      origin: "UAE · Sample profile",
    },
  ];

  return (
    <section className="py-18 sm:py-24 bg-white text-slate-900 transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title on Left, Link on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4 text-left">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-widest text-[#7F1D3F] uppercase">
              <span className="w-4 h-[1.5px] bg-[#7F1D3F]" />
              <span>BUSINESS DISCOVERY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-900 leading-[1.18] mb-3">
              See the possibilities in the directory.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Explore a selection of illustrative business profiles across
              sourcing, production, and logistics.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/businesses"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7F1D3F] hover:text-[#99224B] transition-colors"
            >
              <span>Browse sample directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3 Showcase Business Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {showcase.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-[#EFE1E6] shadow-xs hover:shadow-md hover:border-[#DDBDC9] transition-all flex flex-col justify-between text-left"
            >
              <div>
                {/* Category Pill Tag */}
                <div className="inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-[#FDF0F3] text-[#7F1D3F] mb-6">
                  {item.badge}
                </div>

                {/* Business Name */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                  {item.title}
                </h3>

                {/* Subtitle / Spec */}
                <p className="text-sm text-slate-600 leading-relaxed mb-8">
                  {item.description}
                </p>
              </div>

              {/* Bottom info row */}
              <div className="pt-4 border-t border-[#F2E5EA] flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{item.origin}</span>
                <button
                  type="button"
                  onClick={() => handleEnquire(item.title)}
                  className="font-bold text-[#7F1D3F] hover:text-[#99224B] inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Enquire</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Internal Demo Request Modal fallback */}
      {!onRequestDemo && (
        <DemoRequestModal
          isOpen={internalDemoOpen}
          initialInterest={`Enquiry: ${selectedBusiness}`}
          onClose={() => setInternalDemoOpen(false)}
        />
      )}
    </section>
  );
}

export default DirectoryPreviewSection;