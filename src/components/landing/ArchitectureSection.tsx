"use client";

import React from "react";
import Link from "next/link";
import {
  Server,
  Database,
  Search,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  Code2,
  Terminal,
} from "lucide-react";

export default function ArchitectureSection() {
  const archItems = [
    {
      num: "01",
      tag: "Gateway Architecture",
      title: "Zero-CORS Internal Reverse Proxy",
      desc: "Next.js App Router on Port 9000 transparently reverses proxy traffic via /api/:path* directly to the NestJS/Express Backend API on Port 6000, eliminating CORS preflight overhead and protecting internal service topologies.",
      icon: Zap,
      color: "text-red-500 bg-red-50 border-red-100",
    },
    {
      num: "02",
      tag: "Relational Persistence",
      title: "TypeORM & PostgreSQL 16 Schema",
      desc: "Strict foreign key relational constraints, cascading deletes, normalized master lookup staging tables, and migration-driven schema versioning ensure zero database corruption across all enterprise tenants.",
      icon: Database,
      color: "text-blue-500 bg-blue-50 border-blue-100",
    },
    {
      num: "03",
      tag: "Distributed Search",
      title: "Elasticsearch 8 Cluster Sync",
      desc: "Dual-engine persistence reconciles PostgreSQL relational updates with Elasticsearch 8 inverted indexes, delivering sub-millisecond full-text search across 19,000+ PIN codes and deep product taxonomy trees.",
      icon: Search,
      color: "text-amber-500 bg-amber-50 border-amber-100",
    },
    {
      num: "04",
      tag: "Automated SLAs",
      title: "Continuous Playwright E2E Contracts",
      desc: "Strict Non-Functional Requirement (NFR) validation suites continuously test endpoints for <1000ms latency SLAs, automated session invalidation behavior, and UI regression prevention.",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-50 border-emerald-100",
    },
  ];

  return (
    <section className="py-20 border-b" style={{ borderColor: "var(--theme-glass-border)", background: "var(--theme-canvas)" }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-wide uppercase"
              style={{
                background: "var(--theme-blush)",
                border: "1px solid rgba(238, 49, 53, 0.25)",
                color: "var(--theme-red)",
              }}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Fullstack Engineering Foundation</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: "var(--theme-ink-darkest)", lineHeight: "1.15" }}
            >
              Engineered for High-Scale Enterprise Deal Flow.
            </h2>
          </div>

          <a
            href="/api/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg border transition-colors self-start md:self-auto"
            style={{
              background: "var(--theme-card-bg)",
              borderColor: "var(--theme-glass-border)",
              color: "var(--theme-ink-darkest)",
            }}
          >
            <Code2 className="w-3.5 h-3.5" style={{ color: "var(--theme-red)" }} />
            <span>Explore Swagger API Docs</span>
            <ExternalLink className="w-3 h-3" style={{ color: "var(--theme-gray-400)" }} />
          </a>
        </div>

        {/* 4 Architectural Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {archItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="p-6 rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between"
                style={{
                  background: "var(--theme-card-bg)",
                  borderColor: "var(--theme-glass-border)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-2xs font-extrabold font-mono px-2 py-0.5 rounded border"
                      style={{
                        background: "var(--theme-blush)",
                        color: "var(--theme-red)",
                        borderColor: "rgba(238, 49, 53, 0.2)",
                      }}
                    >
                      {item.num}
                    </span>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center border"
                      style={{
                        background: "var(--theme-panel-bg)",
                        borderColor: "var(--theme-glass-border)",
                        color: "var(--theme-red)",
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-2xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--theme-gray-400)" }}>
                    {item.tag}
                  </div>
                  <h3 className="text-base font-bold mb-2.5" style={{ color: "var(--theme-ink-darkest)" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--theme-gray-600)" }}>
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t flex items-center justify-between text-2xs font-mono" style={{ borderColor: "var(--theme-glass-border)", color: "var(--theme-gray-400)" }}>
                  <span>STATUS: HEALTHY</span>
                  <span className="font-bold" style={{ color: "var(--theme-success)" }}>100% PASS</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
