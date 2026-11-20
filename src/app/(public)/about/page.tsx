"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Globe, Users, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";

export default function AboutPage() {
  const { savedCount } = useSavedBusinesses();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header savedCount={savedCount} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              About Mercora
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              India&apos;s High-Trust B2B Trade & Discovery Platform
            </h1>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Mercora is engineered to connect manufacturers, suppliers, exporters, and wholesale buyers across every district and industrial cluster in India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mb-3" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Verified Credentials</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                GSTIN, CIN, and physical factory verification on every listing.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <Globe className="w-7 h-7 text-blue-600 dark:text-blue-400 mb-3" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Pan-India Reach</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Official geographical indexing across all 36 States & UTs and 780+ Districts.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <Users className="w-7 h-7 text-red-600 dark:text-red-400 mb-3" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Direct Trade Connections</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Zero intermediaries. Instant phone, WhatsApp, and RFQ quotations.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic Master Data & Deal OS for Modern B2B Commerce.
            </p>
            <Link
              href="/businesses"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Explore Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
