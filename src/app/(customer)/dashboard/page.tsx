"use client";

import React from "react";
import Link from "next/link";
import { Heart, MessageSquare, Building2, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";
import { Header } from "@/components/layout/Header";
import { PAGE_METADATA } from "@/config/page-metadata";

export default function CustomerDashboardPage() {
  const { savedCount } = useSavedBusinesses();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header savedCount={savedCount} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Buyer Trade Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {PAGE_METADATA.customerDashboard.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {PAGE_METADATA.customerDashboard.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/saved-businesses"
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-red-500/60 dark:hover:border-red-500/60 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-red-600/30" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              Saved Businesses
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {savedCount} bookmarked manufacturers
            </p>
          </Link>

          <Link
            href="/enquiries"
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Quotations & Inquiries
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track active RFQs and vendor inquiries
            </p>
          </Link>

          <Link
            href="/profile"
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Buyer Profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Company GSTIN, contacts & preferences
            </p>
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Discover Verified Indian Manufacturers
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Explore 8,000+ audited suppliers across ceramics, machinery, chemicals, and textiles.
              </p>
            </div>
          </div>
          <Link
            href="/businesses"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
          >
            <span>Open Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
