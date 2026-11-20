"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BusinessCard } from "@/features/businesses/components/listing/BusinessCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useSavedBusinesses } from "@/features/saved-businesses/hooks/use-saved-businesses";
import { fetchBusinesses } from "@/features/businesses/api/business-api";
import { Business } from "@/features/businesses/types/business.types";
import { MESSAGES } from "@/config/messages";

export default function CustomerSavedBusinessesPage() {
  const { savedIds, toggleSave, isSaved } = useSavedBusinesses();
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses({ limit: 50 }).then((res) => {
      setAllBusinesses(res.data);
      setLoading(false);
    });
  }, []);

  const savedList = allBusinesses.filter((b) => savedIds.includes(b.id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col font-sans transition-colors">
      <Header savedCount={savedIds.length} />

      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              Saved Businesses ({savedList.length})
            </h1>
          </div>
          <Link
            href="/businesses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 font-medium">
            {MESSAGES.common.loading}
          </div>
        ) : savedList.length === 0 ? (
          <EmptyState
            title="No saved businesses yet"
            description={MESSAGES.businesses.emptySaved}
            actionLabel="Browse Businesses"
            onAction={() => {
              window.location.href = "/businesses";
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedList.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                isSaved={isSaved(business.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
