"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Hash,
  MapPin,
  Anchor,
  Plane,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  BadgePercent,
  X,
  ExternalLink,
} from "lucide-react";

interface MasterRecord {
  id: string;
  type: "hsn" | "port" | "geo" | "category";
  typeLabel: string;
  code: string;
  title: string;
  subtitle: string;
  hierarchy: string;
  gstRate?: string;
  policy?: string;
  duty?: string;
  portType?: "Sea Port" | "Air Cargo" | "Inland Depot (ICD)";
}

const SAMPLE_MASTER_RECORDS: MasterRecord[] = [
  {
    id: "hsn-100630",
    type: "hsn",
    typeLabel: "HSN Tariff Engine",
    code: "1006.30",
    title: "Semi-milled or wholly milled rice (Basmati & Non-Basmati)",
    subtitle: "Chapter 10: Cereals · Heading 1006",
    hierarchy: "Section II ➔ Chapter 10 (Cereals) ➔ Heading 1006 ➔ HSN 1006.30.20",
    gstRate: "0% / 5% (Branded in Unit Container)",
    policy: "Free Export with APEDA EPC Registration",
    duty: "0% Export Duty · MEP Checked",
  },
  {
    id: "hsn-847130",
    type: "hsn",
    typeLabel: "HSN Tariff Engine",
    code: "8471.30",
    title: "Portable automatic data processing machines (<10 kg)",
    subtitle: "Chapter 84: Nuclear reactors, boilers, machinery · Laptops & Tablets",
    hierarchy: "Section XVI ➔ Chapter 84 ➔ Heading 8471 ➔ HSN 8471.30.10",
    gstRate: "18% Standard GST",
    policy: "Restricted Import (DGFT Import Authorization Required)",
    duty: "Basic Customs Duty: 0% · IGST: 18%",
  },
  {
    id: "hsn-711319",
    type: "hsn",
    typeLabel: "HSN Tariff Engine",
    code: "7113.19",
    title: "Articles of jewellery and parts thereof, of precious metal (Gold & Platinum)",
    subtitle: "Chapter 71: Natural or cultured pearls, precious stones, jewellery",
    hierarchy: "Section XIV ➔ Chapter 71 ➔ Heading 7113 ➔ HSN 7113.19.10",
    gstRate: "3% Special Precious Metal Rate",
    policy: "Canalized via RBI Nominated Agencies & Nominated Banks",
    duty: "Customs Duty: 6% + AIDC 5% + Cess",
  },
  {
    id: "hsn-300490",
    type: "hsn",
    typeLabel: "HSN Tariff Engine",
    code: "3004.90",
    title: "Medicaments consisting of mixed or unmixed products for therapeutic uses",
    subtitle: "Chapter 30: Pharmaceutical products · Formulations & Finished Dosages",
    hierarchy: "Section VI ➔ Chapter 30 ➔ Heading 3004 ➔ HSN 3004.90.99",
    gstRate: "12% Standard Concessional Pharma",
    policy: "Free Export · Subject to CDSCO NOC",
    duty: "Exempt Life Saving Drugs / 10% Standard",
  },
  {
    id: "port-inbom",
    type: "port",
    typeLabel: "Customs Port Gateway",
    code: "IN-BOM-1 (INBOM1)",
    title: "Jawaharlal Nehru Customs House (Nhava Sheva / JNPT)",
    subtitle: "Navi Mumbai, Maharashtra · EDI Customs Clearance Zone",
    hierarchy: "India ➔ Maharashtra ➔ Raigad / Navi Mumbai ➔ JNPT Sea Port",
    portType: "Sea Port",
    policy: "Direct Port Delivery (DPD) & 24x7 Customs Faceless Assessment",
  },
  {
    id: "port-indel",
    type: "port",
    typeLabel: "Customs Port Gateway",
    code: "IN-DEL-4 (INDEL4)",
    title: "Indira Gandhi International Airport Air Cargo Complex",
    subtitle: "New Delhi · Central Warehousing & Temperature-Controlled Cold Chain",
    hierarchy: "India ➔ NCT of Delhi ➔ South West Delhi ➔ IGI Air Cargo Terminal",
    portType: "Air Cargo",
    policy: "Green Channel Automated Air Clearance",
  },
  {
    id: "geo-380015",
    type: "geo",
    typeLabel: "8-Tier Geo Postal",
    code: "PIN 380015",
    title: "Ahmedabad West · Navrangpura & University Sub-Post Office",
    subtitle: "India Post Delivery Branch · LGD Sub-District #472",
    hierarchy: "India (IND) ➔ Gujarat (GUJ #24) ➔ Ahmedabad (#442) ➔ Taluka City (#472) ➔ PIN 380015",
    policy: "Tier-1 Metro Logistic Hub · Same-Day Delivery Enabled",
  },
  {
    id: "geo-400001",
    type: "geo",
    typeLabel: "8-Tier Geo Postal",
    code: "PIN 400001",
    title: "Mumbai General Post Office (Head Office) · Fort South",
    subtitle: "India Post West Zone · LGD District #497 (Mumbai City)",
    hierarchy: "India (IND) ➔ Maharashtra (MAH #27) ➔ Mumbai (#497) ➔ Fort ➔ PIN 400001",
    policy: "Commercial Central Delivery Office · High-Density B2B Corridor",
  },
];

const POPULAR_TAGS = [
  { label: "1006.30 (Rice)", query: "1006.30" },
  { label: "8471.30 (Laptops)", query: "8471.30" },
  { label: "7113.19 (Jewellery)", query: "7113.19" },
  { label: "IN-BOM (Nhava Sheva)", query: "Nhava Sheva" },
  { label: "PIN 380015 (Ahmedabad)", query: "380015" },
  { label: "3004.90 (Pharma)", query: "3004.90" },
];

export function CustomsSearchWidget() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "hsn" | "port" | "geo">("all");

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE_MASTER_RECORDS.filter((rec) => {
      // Filter by type if set
      if (activeFilter !== "all" && rec.type !== activeFilter) {
        return false;
      }
      if (!q) return true;
      return (
        rec.code.toLowerCase().includes(q) ||
        rec.title.toLowerCase().includes(q) ||
        rec.subtitle.toLowerCase().includes(q) ||
        rec.hierarchy.toLowerCase().includes(q)
      );
    });
  }, [query, activeFilter]);

  return (
    <section
      id="customs-search"
      className="py-12 border-b relative scroll-mt-24"
      style={{
        background: "var(--theme-canvas)",
        borderColor: "var(--theme-glass-border)",
        scrollMarginTop: "85px",
      }}
    >
      <div className="container">
        
        {/* Header Eyebrow & Title */}
        <div className="w-full text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs font-bold tracking-wide"
            style={{
              background: "var(--theme-blush)",
              border: "1px solid rgba(238, 49, 53, 0.2)",
              color: "var(--theme-red)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>INSTANT TRADE &amp; CUSTOMS MASTER SEARCH</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2"
            style={{ color: "var(--theme-ink-darkest)" }}
          >
            Live Customs Tariff &amp; Master Data Explorer
          </h2>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "var(--theme-gray-500)" }}>
            Search 12,000+ HSN codes, official DGFT trade policies, customs port gateways, and 19,000+ PIN codes with
            sub-millisecond precision.
          </p>
        </div>

        {/* Search Input Box (Spans Full Container) */}
        <div className="w-full mb-6">
          <div
            className="rounded-2xl p-2 sm:p-2.5 shadow-lg border transition-all flex flex-col sm:flex-row items-center gap-2"
            style={{
              background: "var(--theme-card-bg)",
              borderColor: "var(--theme-glass-border)",
            }}
          >
            <div className="flex items-center flex-1 w-full pl-3 pr-2">
              <Search className="w-5 h-5 text-gray-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search by 2/4/8-digit HS code (e.g. 1006.30), product name, port or PIN..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search customs master data"
                className="w-full py-2.5 text-sm sm:text-base font-medium focus:outline-none"
                style={{
                  background: "transparent",
                  color: "var(--theme-ink-darkest)",
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 mr-1"
                  aria-label="Clear query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 px-2 sm:px-0">
              {[
                { id: "all", label: "All Masters" },
                { id: "hsn", label: "HSN / Tariff" },
                { id: "port", label: "Ports & EDI" },
                { id: "geo", label: "Geo PINs" },
              ].map((f) => {
                const isSelected = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id as any)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all"
                    style={{
                      background: isSelected ? "var(--theme-red)" : "var(--theme-canvas)",
                      color: isSelected ? "#ffffff" : "var(--theme-gray-600)",
                      border: isSelected
                        ? "1px solid var(--theme-red)"
                        : "1px solid var(--theme-glass-border)",
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Query Shortcut Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs px-2">
            <span style={{ color: "var(--theme-gray-500)", fontWeight: 600 }}>Try queries:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => setQuery(tag.query)}
                className="px-2.5 py-1 rounded-md text-2xs font-semibold transition-all hover:bg-red-50"
                style={{
                  background: "var(--theme-card-bg)",
                  border: "1px solid var(--theme-glass-border)",
                  color: "var(--theme-ink-darkest)",
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Stream (Spans Full Container Width in 2-Column Grid) */}
        <div className="w-full">
          {/* Telemetry bar above results */}
          <div className="flex items-center justify-between text-2xs px-2 mb-3" style={{ color: "var(--theme-gray-500)" }}>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>
                Found <strong style={{ color: "var(--theme-ink-darkest)" }}>{filteredResults.length}</strong> verified master records
              </span>
            </div>
            <div className="font-mono text-gray-400">Response SLA: 4ms · Deterministic TypeORM Cache</div>
          </div>

          {filteredResults.length === 0 ? (
            <div
              className="p-8 text-center rounded-2xl border w-full"
              style={{
                background: "var(--theme-card-bg)",
                borderColor: "var(--theme-glass-border)",
              }}
            >
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <div className="font-bold text-sm" style={{ color: "var(--theme-ink-darkest)" }}>
                No direct match found for &quot;{query}&quot;
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Try searching by 2-digit chapter (e.g. 10 for Cereals, 84 for Machinery) or explore our complete 19,000+ master directory in the admin console.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-red-600 hover:text-red-700"
              >
                <span>Open Full Master Catalog in Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredResults.slice(0, 4).map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 sm:p-5 rounded-2xl border transition-all hover:shadow-md"
                  style={{
                    background: "var(--theme-card-bg)",
                    borderColor: "var(--theme-glass-border)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                    <div>
                      {/* Badge Row */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className="px-2 py-0.5 rounded text-3xs font-extrabold uppercase tracking-wider"
                          style={{
                            background:
                              rec.type === "hsn"
                                ? "rgba(238, 49, 53, 0.1)"
                                : rec.type === "port"
                                ? "rgba(37, 99, 235, 0.1)"
                                : "rgba(16, 185, 129, 0.1)",
                            color:
                              rec.type === "hsn"
                                ? "var(--theme-red)"
                                : rec.type === "port"
                                ? "#2563eb"
                                : "#059669",
                          }}
                        >
                          {rec.typeLabel}
                        </span>

                        <span className="font-mono text-xs font-bold" style={{ color: "var(--theme-ink-darkest)" }}>
                          {rec.code}
                        </span>

                        {rec.portType && (
                          <span className="text-3xs text-gray-500 font-semibold flex items-center gap-1">
                            {rec.portType === "Sea Port" ? (
                              <Anchor className="w-3 h-3 text-blue-500" />
                            ) : (
                              <Plane className="w-3 h-3 text-sky-500" />
                            )}
                            {rec.portType}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm sm:text-base leading-snug" style={{ color: "var(--theme-ink-darkest)" }}>
                        {rec.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{rec.subtitle}</p>
                    </div>

                    {/* Tax or Rate Chip */}
                    {rec.gstRate && (
                      <div
                        className="self-start px-2.5 py-1 rounded-lg text-right shrink-0"
                        style={{
                          background: "var(--theme-canvas)",
                          border: "1px solid var(--theme-glass-border)",
                        }}
                      >
                        <div className="text-3xs text-gray-400 uppercase font-bold">GST Tariff</div>
                        <div className="text-xs font-black text-emerald-700">{rec.gstRate}</div>
                      </div>
                    )}
                  </div>

                  {/* Cascading Taxonomy Path */}
                  <div
                    className="p-2.5 rounded-lg text-2xs font-mono mb-3 flex items-center gap-1.5 overflow-x-auto"
                    style={{
                      background: "var(--theme-canvas)",
                      border: "1px solid var(--theme-glass-border)",
                      color: "var(--theme-gray-600)",
                    }}
                  >
                    <Layers className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="whitespace-nowrap">{rec.hierarchy}</span>
                  </div>

                  {/* Policy & Action Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t text-2xs" style={{ borderColor: "var(--theme-glass-border)" }}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-500">DGFT / Customs:</span>
                      <span className="font-medium" style={{ color: "var(--theme-ink-darkest)" }}>
                        {rec.policy || "Deterministic Clearance Route"}
                      </span>
                    </div>

                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-700 self-end sm:self-auto"
                    >
                      <span>Inspect in Master Console</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
export default CustomsSearchWidget;
