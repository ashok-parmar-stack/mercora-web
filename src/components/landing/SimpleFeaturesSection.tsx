"use client";

import React from "react";
import Link from "next/link";
import {
  Globe2,
  Layers,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function SimpleFeaturesSection() {
  const features = [
    {
      id: "geography",
      icon: Globe2,
      badge: "LGD & INDIA POST SYNC",
      title: "8-Tier National Geography",
      description:
        "Deterministic cascading resolution from Country, State, District, Taluka down to 19,000+ official Indian PIN codes and delivery branch offices with zero address drift.",
      points: [
        "Ministry of Panchayati Raj (LGD) sync",
        "Official 6-digit India Post PIN mapping",
        "Cascading parent-child hierarchy validation",
      ],
      linkText: "Explore Geography Master",
      linkHref: "/admin/geography",
    },
    {
      id: "taxonomy",
      icon: Layers,
      badge: "GST & DGFT COMPLIANT",
      title: "Customs & HSN Tariff Engine",
      description:
        "Structured 8-digit HSN & SAC classification with automated GST rate calculations, customs port gateway rules, and DGFT export/import compliance tagging.",
      points: [
        "12,800+ 8-digit HSN/SAC codes",
        "Automated GST slab & tax calculation",
        "Port clearance & bill of entry automation",
      ],
      linkText: "Explore Tariff Catalog",
      linkHref: "/admin",
    },
    {
      id: "security",
      icon: ShieldCheck,
      badge: "ZERO-TRUST GOVERNANCE",
      title: "Deterministic RBAC & Security",
      description:
        "Dual-layer role and user-based access control (RBAC/UBAC) coupled with a strict single active session policy (1 User = 1 Device) to eliminate credential sharing.",
      points: [
        "1 User = 1 Device session enforcement",
        "Granular module and action permissions",
        "Tamper-evident audit logging for all mutations",
      ],
      linkText: "Inspect Security Console",
      linkHref: "/admin",
    },
  ];

  return (
    <section className="py-20 border-b" style={{ borderColor: "var(--theme-glass-border)", background: "var(--theme-canvas)" }}>
      <div className="container">
        {/* Section Heading */}
        <div className="max-w-2xl mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs font-bold tracking-wide"
            style={{
              background: "var(--theme-blush)",
              border: "1px solid rgba(238, 49, 53, 0.2)",
              color: "var(--theme-red)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENTERPRISE MASTER CAPABILITIES</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
            style={{ color: "var(--theme-ink-darkest)" }}
          >
            Built for Modern B2B Global Trade &amp; Commerce
          </h2>

          <p className="text-base text-gray-500 leading-relaxed">
            Mercora provides the foundational master data layers required to eliminate catalog chaos, address ambiguity, and access vulnerabilities.
          </p>
        </div>

        {/* 3-Column Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={item.id}
                className="p-8 rounded-2xl border transition-all hover:shadow-lg flex flex-col justify-between scroll-mt-24"
                style={{
                  background: "var(--theme-card-bg)",
                  borderColor: "var(--theme-glass-border)",
                }}
              >
                <div>
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: "var(--theme-blush)",
                        border: "1px solid rgba(238, 49, 53, 0.2)",
                        color: "var(--theme-red)",
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span
                      className="text-3xs font-extrabold px-2.5 py-1 rounded-full"
                      style={{
                        background: "var(--theme-canvas)",
                        border: "1px solid var(--theme-glass-border)",
                        color: "var(--theme-gray-600)",
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className="text-xl font-bold mb-3 tracking-tight"
                    style={{ color: "var(--theme-ink-darkest)" }}
                  >
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Benefit Points */}
                  <ul className="space-y-2.5 mb-8">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-xs font-medium"
                        style={{ color: "var(--theme-ink-darkest)" }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Link */}
                <Link
                  href={item.linkHref}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-colors pt-4 border-t"
                  style={{ borderColor: "var(--theme-glass-border)" }}
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default SimpleFeaturesSection;
