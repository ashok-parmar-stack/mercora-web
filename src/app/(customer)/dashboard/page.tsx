"use client";

import React from "react";
import Link from "next/link";
import { Heart, MessageSquare, Building2, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/common";
import { PAGE_METADATA } from "@/config/page-metadata";

export default function CustomerDashboardPage() {
  const { savedCount } = useSavedBusinesses();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <Header savedCount={savedCount} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-border pb-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Buyer Trade Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            {PAGE_METADATA.customerDashboard.title}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {PAGE_METADATA.customerDashboard.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/saved-businesses"
            className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-primary/30" />
            </div>
            <h2 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors">
              Saved Businesses
            </h2>
            <p className="text-xs text-text-muted mt-1">
              {savedCount} bookmarked manufacturers
            </p>
          </Link>

          <Link
            href="/enquiries"
            className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors">
              Quotations &amp; Inquiries
            </h2>
            <p className="text-xs text-text-muted mt-1">
              Track active RFQs and vendor inquiries
            </p>
          </Link>

          <Link
            href="/profile"
            className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors">
              Buyer Profile
            </h2>
            <p className="text-xs text-text-muted mt-1">
              Company GSTIN, contacts &amp; preferences
            </p>
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center text-text-secondary">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Discover Verified Indian Manufacturers
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Explore 8,000+ audited suppliers across ceramics, machinery, chemicals, and textiles.
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm" asChild>
            <Link href="/businesses" className="inline-flex items-center gap-1.5 self-start sm:self-auto">
              <span>Open Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
