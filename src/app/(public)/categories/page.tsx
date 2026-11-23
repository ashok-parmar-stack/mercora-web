"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Layers, ArrowRight, Building2, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Input } from "@/components/ui/Input";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";
import { fetchCategories } from "@/features/categories/category-api";
import { CategoryItem } from "@/features/categories/types";
import { PAGE_METADATA } from "@/config/page-metadata";
import { MESSAGES } from "@/config/messages";

export default function CategoriesDirectoryPage() {
  const { savedCount } = useSavedBusinesses();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchCategories()
      .then((items) => {
        setCategories(items || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load categories");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header savedCount={savedCount} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">
              <Layers className="w-4 h-4" />
              <span>Industry Sectors</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {PAGE_METADATA.categories.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {PAGE_METADATA.categories.description}
            </p>
          </div>

          <div className="w-full md:w-72">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search industries..."
              aria-label="Search industries"
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {loading ? (
          <LoadingState message="Loading industrial categories..." />
        ) : error ? (
          <ErrorState
            title="Unable to Load Categories"
            message={error}
            onRetry={loadCategories}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={MESSAGES.categories.emptyCategories}
            description={search ? "No matching categories found. Try clearing your search keyword." : "No categories are currently registered in the directory."}
            actionLabel={search ? "Reset Search" : undefined}
            onAction={search ? () => setSearch("") : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                href={`/categories/${cat.slug}`}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-red-500/60 dark:hover:border-red-500/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {cat.count ? `${cat.count}+ verified suppliers` : "Verified suppliers & manufacturers"}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
