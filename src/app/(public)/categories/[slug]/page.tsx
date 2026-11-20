"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Home, ArrowLeft, Layers } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BusinessCard } from "@/features/businesses/components/listing/BusinessCard";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";
import { fetchBusinesses } from "@/features/businesses/api/business-api";
import { Business } from "@/features/businesses/types/business.types";

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const decodedCategory = slug === "ceramics-tiles" ? "Ceramics & Tiles" : decodeURIComponent(slug).replace(/-/g, " ");
  const { savedCount } = useSavedBusinesses();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchBusinesses({ category: decodedCategory, limit: 50 })
      .then((res) => {
        if (active) {
          setBusinesses(res.data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [decodedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header savedCount={savedCount} />

      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link href="/" className="flex items-center gap-1 hover:text-red-600 transition-colors">
              <Home className="w-3.5 h-3.5" />
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-slate-800 dark:hover:text-slate-200">
              Categories
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-bold capitalize">
              {decodedCategory}
            </span>
          </nav>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Categories
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white capitalize">
              {decodedCategory} Businesses
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Showing verified manufacturers, suppliers, and distributors in this industrial sector.
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState message={`Finding verified suppliers in ${decodedCategory}...`} />
        ) : businesses.length === 0 ? (
          <EmptyState
            title={`No businesses found in ${decodedCategory}`}
            description="We haven't indexed manufacturers in this specific category yet. Browse our comprehensive directory to discover related sectors."
            actionLabel="Browse All Businesses"
            onAction={() => {
              window.location.href = "/businesses";
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
