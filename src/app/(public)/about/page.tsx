"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Globe, Users, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/common";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";

export default function AboutPage() {
  const { savedCount } = useSavedBusinesses();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <Header savedCount={savedCount} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 shadow-xs space-y-8">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              About Mercora
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-2">
              India&apos;s High-Trust B2B Trade &amp; Discovery Platform
            </h1>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Mercora is engineered to connect manufacturers, suppliers, exporters, and wholesale buyers across every district and industrial cluster in India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-border">
            <div className="p-5 rounded-2xl bg-surface-hover/50 border border-border shadow-2xs">
              <ShieldCheck className="w-7 h-7 text-emerald-600 mb-3" />
              <h2 className="text-sm font-bold text-text-primary">Verified Credentials</h2>
              <p className="text-xs text-text-secondary mt-1">
                GSTIN, CIN, and physical factory verification on every listing.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-surface-hover/50 border border-border shadow-2xs">
              <Globe className="w-7 h-7 text-blue-600 mb-3" />
              <h2 className="text-sm font-bold text-text-primary">Pan-India Reach</h2>
              <p className="text-xs text-text-secondary mt-1">
                Official geographical indexing across all 36 States &amp; UTs and 780+ Districts.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-surface-hover/50 border border-border shadow-2xs">
              <Users className="w-7 h-7 text-primary mb-3" />
              <h2 className="text-sm font-bold text-text-primary">Direct Trade Connections</h2>
              <p className="text-xs text-text-secondary mt-1">
                Zero intermediaries. Instant phone, WhatsApp, and RFQ quotations.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
            <p className="text-xs text-text-muted">
              Deterministic Master Data &amp; B2B Intelligence for Modern Commerce.
            </p>
            <Button variant="primary" size="sm" asChild>
              <Link href="/businesses" className="inline-flex items-center gap-1.5">
                <span>Explore Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
