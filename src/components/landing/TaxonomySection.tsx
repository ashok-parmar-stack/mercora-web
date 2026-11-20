"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderTree,
  Hash,
  Layers,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Folder,
  FolderOpen,
  Package,
  Calculator,
  Percent,
  CheckCircle2,
} from "lucide-react";

export default function TaxonomySection() {
  const [expandedFolder, setExpandedFolder] = useState<string>("bearings");
  const [selectedGstSlab, setSelectedGstSlab] = useState<number>(18);
  const [demoAmount, setDemoAmount] = useState<number>(25000);

  const gstRates = [0, 5, 12, 18, 28];

  const calculatedTax = (demoAmount * selectedGstSlab) / 100;
  const halfTax = calculatedTax / 2;
  const totalAmount = demoAmount + calculatedTax;

  return (
    <section
      id="taxonomy"
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
            <FolderTree className="w-3.5 h-3.5" />
            <span>Taxonomy &amp; Fiscal Compliance Engine</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
            style={{ color: "var(--theme-ink-darkest)", lineHeight: "1.15" }}
          >
            Infinite Product Taxonomy Meets{" "}
            <span style={{ color: "var(--theme-red)" }}>Indian Customs HSN Codes.</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Eliminates catalog disorder and tax audit penalties. Pair multi-depth e-commerce categorization with official Directorate General of Foreign Trade (DGFT) 8-digit tariff items and automatic GST slab mapping.
          </p>
        </div>

        {/* Two-Column Interactive Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column: Flipkart-Style Category Tree */}
          <div
            className="lg:col-span-6 rounded-2xl p-6 sm:p-8 border shadow-sm flex flex-col justify-between"
            style={{
              background: "var(--theme-card-bg)",
              borderColor: "var(--theme-glass-border)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: "var(--theme-glass-border)" }}>
                <div className="flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Recursive Category Tree
                  </span>
                </div>
                <Link
                  href="/admin/categories"
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <span>Open Master</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ color: "var(--theme-ink-darkest)" }}>
                Flipkart-Grade Infinite Hierarchy
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Supports unlimited parent-child nesting, slug generation, icon/media bindings, and live visibility toggles without slow relational queries.
              </p>

              {/* Interactive Category Tree Widget */}
              <div
                className="p-4 rounded-xl border font-mono text-xs space-y-2 mb-6"
                style={{
                  background: "var(--theme-canvas)",
                  borderColor: "var(--theme-glass-border)",
                }}
              >
                {/* Level 0 */}
                <div className="flex items-center gap-2 text-gray-700 font-bold">
                  <FolderOpen className="w-4 h-4 text-amber-500" />
                  <span>Industrial Supplies &amp; Machinery (L0)</span>
                </div>

                {/* Level 1 */}
                <div className="pl-6 flex items-center gap-2 text-gray-600 font-medium">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  <FolderOpen className="w-4 h-4 text-amber-500" />
                  <span>Power Transmission Components (L1)</span>
                </div>

                {/* Level 2 Expandable */}
                <div className="pl-12 space-y-2">
                  <button
                    type="button"
                    onClick={() => setExpandedFolder(expandedFolder === "bearings" ? "" : "bearings")}
                    className="flex items-center gap-2 text-red-600 font-bold hover:underline cursor-pointer"
                  >
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedFolder === "bearings" ? "rotate-90" : ""}`} />
                    <Folder className="w-4 h-4 text-red-500" />
                    <span>Ball &amp; Roller Bearings (L2)</span>
                    <span className="text-2xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Selected</span>
                  </button>

                  {/* Level 3 Leaf Items */}
                  {expandedFolder === "bearings" && (
                    <div className="pl-6 space-y-1.5 pt-1" style={{ color: "var(--theme-ink-darkest)" }}>
                      <div
                        className="flex items-center justify-between p-2 rounded border"
                        style={{
                          background: "var(--theme-card-bg)",
                          borderColor: "var(--theme-glass-border)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-blue-500" />
                          <span className="font-sans font-medium">Adapter Ball Bearings</span>
                        </div>
                        <span className="text-2xs px-2 py-0.5 rounded font-mono" style={{ background: "var(--theme-canvas)", border: "1px solid var(--theme-glass-border)", color: "var(--theme-gray-500)" }}>
                          HSN: 8482.10.10
                        </span>
                      </div>

                      <div
                        className="flex items-center justify-between p-2 rounded border"
                        style={{
                          background: "var(--theme-card-bg)",
                          borderColor: "var(--theme-glass-border)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-blue-500" />
                          <span className="font-sans font-medium">Tapered Roller Bearings</span>
                        </div>
                        <span className="text-2xs px-2 py-0.5 rounded font-mono" style={{ background: "var(--theme-canvas)", border: "1px solid var(--theme-glass-border)", color: "var(--theme-gray-500)" }}>
                          HSN: 8482.20.00
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--theme-glass-border)", color: "var(--theme-gray-500)" }}>
              <span>✓ Automated Materialized Path Indexing</span>
              <span className="font-mono font-bold" style={{ color: "var(--theme-red)" }}>&lt; 10ms Query Execution</span>
            </div>
          </div>

          {/* Right Column: Indian Customs ITCHS & GST Slabs */}
          <div
            className="lg:col-span-6 rounded-2xl p-6 sm:p-8 border shadow-sm flex flex-col justify-between"
            style={{
              background: "var(--theme-card-bg)",
              borderColor: "var(--theme-glass-border)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: "var(--theme-glass-border)" }}>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" style={{ color: "var(--theme-red)" }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--theme-gray-400)" }}>
                    Indian Customs ITCHS Master
                  </span>
                </div>
                <Link
                  href="/admin/hsn-codes"
                  className="text-xs font-bold flex items-center gap-1"
                  style={{ color: "var(--theme-red)" }}
                >
                  <span>Open Master</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--theme-ink-darkest)" }}>
                8-Digit HSN &amp; GST Tax Engine
              </h3>
              <p className="text-sm mb-6" style={{ color: "var(--theme-gray-600)" }}>
                Official Indian Trade Classification (Harmonised System) with deterministic GST tax slab bindings and real-time tax calculation.
              </p>

              {/* 8-Digit Structure Explainer */}
              <div className="grid grid-cols-4 gap-2 mb-6 text-center font-mono">
                <div className="p-2.5 rounded-lg border" style={{ background: "var(--theme-panel-bg)", borderColor: "var(--theme-glass-border)" }}>
                  <div className="text-base font-extrabold" style={{ color: "var(--theme-red)" }}>84</div>
                  <div className="text-3xs uppercase font-sans font-bold mt-1" style={{ color: "var(--theme-gray-500)" }}>2-Digit Chapter</div>
                </div>
                <div className="p-2.5 rounded-lg border" style={{ background: "var(--theme-panel-bg)", borderColor: "var(--theme-glass-border)" }}>
                  <div className="text-base font-extrabold" style={{ color: "var(--theme-ink-darkest)" }}>8482</div>
                  <div className="text-3xs uppercase font-sans font-bold mt-1" style={{ color: "var(--theme-gray-500)" }}>4-Digit Heading</div>
                </div>
                <div className="p-2.5 rounded-lg border" style={{ background: "var(--theme-panel-bg)", borderColor: "var(--theme-glass-border)" }}>
                  <div className="text-base font-extrabold" style={{ color: "var(--theme-ink-darkest)" }}>8482.10</div>
                  <div className="text-3xs uppercase font-sans font-bold mt-1" style={{ color: "var(--theme-gray-500)" }}>6-Digit Subheading</div>
                </div>
                <div className="p-2.5 rounded-lg border" style={{ background: "var(--theme-blush)", borderColor: "rgba(238, 49, 53, 0.3)" }}>
                  <div className="text-base font-extrabold" style={{ color: "var(--theme-red)" }}>8482.10.10</div>
                  <div className="text-3xs uppercase font-sans font-bold mt-1" style={{ color: "var(--theme-red)" }}>8-Digit Tariff</div>
                </div>
              </div>

              {/* Interactive GST Slab Simulator */}
              <div
                className="p-4 rounded-xl border"
                style={{
                  background: "var(--theme-canvas)",
                  borderColor: "var(--theme-glass-border)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--theme-ink-darkest)" }}>
                    <Calculator className="w-3.5 h-3.5" style={{ color: "var(--theme-red)" }} />
                    <span>Live GST Calculator on ₹{demoAmount.toLocaleString("en-IN")}</span>
                  </span>
                  <div className="flex gap-1">
                    {gstRates.map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setSelectedGstSlab(rate)}
                        className="px-2 py-0.5 text-xs font-bold rounded cursor-pointer transition-colors"
                        style={{
                          background: selectedGstSlab === rate ? "var(--theme-red)" : "var(--theme-card-bg)",
                          color: selectedGstSlab === rate ? "#ffffff" : "var(--theme-ink-darkest)",
                          border: `1px solid ${selectedGstSlab === rate ? "var(--theme-red)" : "var(--theme-glass-border)"}`,
                        }}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 rounded border" style={{ background: "var(--theme-card-bg)", borderColor: "var(--theme-glass-border)" }}>
                    <div className="text-3xs font-sans" style={{ color: "var(--theme-gray-400)" }}>CGST ({selectedGstSlab / 2}%)</div>
                    <div className="font-bold" style={{ color: "var(--theme-ink-darkest)" }}>₹{halfTax.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="p-2 rounded border" style={{ background: "var(--theme-card-bg)", borderColor: "var(--theme-glass-border)" }}>
                    <div className="text-3xs font-sans" style={{ color: "var(--theme-gray-400)" }}>SGST ({selectedGstSlab / 2}%)</div>
                    <div className="font-bold" style={{ color: "var(--theme-ink-darkest)" }}>₹{halfTax.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="p-2 rounded border" style={{ background: "var(--theme-blush)", borderColor: "rgba(238, 49, 53, 0.25)" }}>
                    <div className="text-3xs font-sans font-bold" style={{ color: "var(--theme-red)" }}>Total with Tax</div>
                    <div className="font-bold" style={{ color: "var(--theme-red)" }}>₹{totalAmount.toLocaleString("en-IN")}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between text-xs text-gray-500 mt-6" style={{ borderColor: "var(--theme-glass-border)" }}>
              <span>✓ Official DGFT ITCHS Gazetteer Reconciled</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                GST Compliant Invoicing
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
