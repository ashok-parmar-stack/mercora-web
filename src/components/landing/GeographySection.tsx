"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  MapPin,
  Building2,
  Building,
  Navigation,
  Milestone,
  Mail,
  Home,
  ArrowRight,
  CheckCircle2,
  Database,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function GeographySection() {
  const [selectedTierIndex, setSelectedTierIndex] = useState(0); // Default to Country

  const tiers = [
    {
      name: "Country",
      icon: Globe,
      code: "ISO-3166",
      example: "India (IN)",
      desc: "Top-level sovereign boundary supporting multi-currency and international dial prefixes (+91).",
      records: "1 Sovereign State",
      api: "GET /api/v1/geography/countries",
    },
    {
      name: "State",
      icon: Building2,
      code: "LGD State Code",
      example: "Maharashtra (27)",
      desc: "36 States & Union Territories mapped to official Ministry of Panchayati Raj codes.",
      records: "36 States & UTs",
      api: "GET /api/v1/geography/states",
    },
    {
      name: "District",
      icon: Building,
      code: "LGD District Code",
      example: "Mumbai City (497)",
      desc: "Revenue district divisions reconciling state gazettes with census boundary tracking.",
      records: "780+ Districts",
      api: "GET /api/v1/geography/districts",
    },
    {
      name: "Sub-District",
      icon: Navigation,
      code: "Tehsil / Taluka",
      example: "Kurla Taluka",
      desc: "Administrative sub-district subdivisions ensuring exact agricultural and municipal jurisdiction.",
      records: "6,000+ Sub-Districts",
      api: "GET /api/v1/geography/sub-districts",
    },
  ];

  const activeTier = tiers[selectedTierIndex];

  return (
    <section
      id="geography"
      className="py-20 border-b scroll-mt-24"
      style={{
        borderColor: "var(--theme-glass-border)",
        background: "var(--theme-canvas)",
        scrollMarginTop: "85px",
      }}
    >
      <div className="container">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-wide uppercase"
            style={{
              background: "var(--theme-blush)",
              border: "1px solid rgba(238, 49, 53, 0.25)",
              color: "var(--theme-red)",
            }}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Official Government Master Data Ingestion</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
            style={{ color: "var(--theme-ink-darkest)", lineHeight: "1.15" }}
          >
            8-Tier National Geography Engine with{" "}
            <span style={{ color: "var(--theme-red)" }}>Zero Address Drift.</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Directly synchronized with the Ministry of Panchayati Raj Local Government Directory (LGD) and India Post. Eliminates failed dispatches, misrouted B2B consignments, and manual address formatting.
          </p>
        </div>

        {/* 8-Tier Interactive Pipeline Flow */}
        <div
          className="rounded-2xl p-6 sm:p-8 mb-12 border shadow-sm transition-all"
          style={{
            background: "var(--theme-card-bg)",
            borderColor: "var(--theme-glass-border)",
          }}
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: "var(--theme-glass-border)" }}>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Interactive Hierarchy Stepper
              </div>
              <div className="text-sm font-bold text-gray-900 mt-0.5" style={{ color: "var(--theme-ink-darkest)" }}>
                Click any tier to inspect schema mapping &amp; official government datasets
              </div>
            </div>

            <Link
              href="/admin/geography"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              <span>Explore Admin Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stepper Node Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-8">
            {tiers.map((tier, idx) => {
              const Icon = tier.icon;
              const isSelected = selectedTierIndex === idx;
              return (
                <button
                  key={tier.name}
                  type="button"
                  onClick={() => setSelectedTierIndex(idx)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "border-red-500 shadow-sm scale-102 bg-red-50/40"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                  style={{
                    background: isSelected ? "var(--theme-blush)" : "var(--theme-card-bg)",
                    borderColor: isSelected ? "var(--theme-red)" : "var(--theme-glass-border)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-2xs font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      T{idx + 1}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? "text-red-600" : "text-gray-400"}`} />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold tracking-tight" style={{ color: "var(--theme-ink-darkest)" }}>
                      {tier.name}
                    </div>
                    <div className="text-2xs text-gray-500 truncate mt-0.5">
                      {tier.code}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Tier Deep-Dive Inspector Panel */}
          <div
            className="p-5 sm:p-6 rounded-xl border"
            style={{
              background: "var(--theme-canvas)",
              borderColor: "var(--theme-glass-border)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase bg-red-600 text-white">
                    Tier {selectedTierIndex + 1} · {activeTier.name} Master
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-500">
                    {activeTier.code}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2" style={{ color: "var(--theme-ink-darkest)" }}>
                  Sample Record: {activeTier.example}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {activeTier.desc}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    <strong>Dataset Volume:</strong> {activeTier.records}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <strong>Staging Deduplication:</strong> Zero-Loss Policy
                  </span>
                </div>
              </div>

              <div
                className="md:col-span-4 p-4 rounded-xl border shadow-2xs font-mono text-xs"
                style={{
                  background: "var(--theme-card-bg)",
                  borderColor: "var(--theme-glass-border)",
                }}
              >
                <div className="text-2xs uppercase tracking-wider font-bold mb-2" style={{ color: "var(--theme-gray-400)" }}>
                  Live Endpoint Contract
                </div>
                <div className="font-bold break-all mb-2" style={{ color: "var(--theme-red)" }}>
                  {activeTier.api}
                </div>
                <div
                  className="p-2.5 rounded text-2xs space-y-1"
                  style={{
                    background: "var(--theme-canvas)",
                    color: "var(--theme-ink)",
                    border: "1px solid var(--theme-glass-border)",
                  }}
                >
                  <div>✓ Postgres Foreign Key Relational Cascade</div>
                  <div>✓ Elasticsearch Full-Text Normalized</div>
                  <div>✓ Sub-15ms Latency SLA Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Capability Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="p-6 rounded-2xl border transition-all"
            style={{
              background: "var(--theme-card-bg)",
              borderColor: "var(--theme-glass-border)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "var(--theme-blush)",
                border: "1px solid rgba(238, 49, 53, 0.25)",
                color: "var(--theme-red)",
              }}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--theme-ink-darkest)" }}>
              Automated LGD Census Ingestion
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--theme-gray-600)" }}>
              Background workers synchronize state re-organizations, newly carved districts, and block-level gazettes directly from Ministry of Panchayati Raj feeds.
            </p>
          </div>

          <div
            className="p-6 rounded-2xl border transition-all"
            style={{
              background: "var(--theme-card-bg)",
              borderColor: "var(--theme-glass-border)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "var(--theme-blush)",
                border: "1px solid rgba(238, 49, 53, 0.25)",
                color: "var(--theme-red)",
              }}
            >
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--theme-ink-darkest)" }}>
              India Post 155k Branch Mapping
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--theme-gray-600)" }}>
              Every 6-digit PIN code maps to its corresponding Head, Sub, and Branch Post Offices with delivery capability indicators and regional sorting hub codes.
            </p>
          </div>

          <div
            className="p-6 rounded-2xl border transition-all"
            style={{
              background: "var(--theme-card-bg)",
              borderColor: "var(--theme-glass-border)",
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ color: "var(--theme-ink-darkest)" }}>
              Deterministic Address Resolution
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Eliminates user spelling mistakes and delivery ambiguity with client-side cascading dropdowns and instant reverse-lookup capabilities.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

function LandmarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" y1="22" x2="22" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}
