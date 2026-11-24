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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
} from "@/components/common";

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
      linkHref: "/admin/roles",
    },
  ];

  return (
    <section className="py-20 border-y border-border bg-[var(--background-secondary)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl mb-14 text-left">
          <Badge
            variant="brand"
            size="md"
            className="mb-3 px-3 py-1 rounded-full text-xs font-semibold bg-brand-blush text-brand-wine border border-brand-rose/25"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span>ENTERPRISE MASTER CAPABILITIES</span>
          </Badge>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary mb-3">
            Built for Modern B2B Global Trade &amp; Commerce
          </h2>

          <p className="text-base text-text-secondary leading-relaxed">
            Mercora provides the foundational master data layers required to eliminate catalog chaos, address ambiguity, and access vulnerabilities.
          </p>
        </div>

        {/* 3-Column Linear High-Craft Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                id={item.id}
                className="p-6 sm:p-8 rounded-2xl border border-border bg-surface hover:border-brand-rose/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between scroll-mt-24"
              >
                <div>
                  {/* Icon & Badge Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-blush text-brand-wine border border-brand-rose/30 shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>

                    <Badge
                      variant="neutral"
                      size="sm"
                      className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-surface border-border text-text-secondary"
                    >
                      {item.badge}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold mb-3 tracking-tight text-text-primary">
                    {item.title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Benefit Points with Emerald Telemetry Checkmarks */}
                  <ul className="space-y-2.5 mb-8">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-xs font-medium text-text-primary"
                      >
                        <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Link */}
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-primary hover:text-primary-hover font-semibold text-xs inline-flex items-center gap-1.5 transition-colors"
                    asChild
                  >
                    <Link href={item.linkHref}>
                      <span>{item.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SimpleFeaturesSection;
