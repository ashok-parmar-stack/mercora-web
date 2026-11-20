"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";
import { PAGE_METADATA } from "@/config/page-metadata";

interface CityItem {
  id: string;
  name: string;
  code?: string;
  slug: string;
  state?: string;
  locationType?: string;
}

export default function LocationsDirectoryPage() {
  const { savedCount } = useSavedBusinesses();
  const [locations, setLocations] = useState<CityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/locations/cities", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.data || [];
        const formatted: CityItem[] = list.map((item: any) => ({
          id: item.id,
          name: item.name,
          code: item.code,
          slug: (item.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          state: item.state?.name || item.stateName || "Gujarat",
          locationType: item.locationType || "Industrial Hub",
        }));
        setLocations(formatted);
      } else {
        throw new Error(`Failed to load cities (HTTP ${res.status})`);
      }
    } catch (err: any) {
      console.error("Failed to load locations:", err);
      setError(err?.message || "Unable to load locations from directory service.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const filtered = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      (loc.state && loc.state.toLowerCase().includes(search.toLowerCase())) ||
      (loc.code && loc.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header savedCount={savedCount} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">
              <MapPin className="w-4 h-4" />
              <span>Pan-India Regional Clusters</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {PAGE_METADATA.locations.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {PAGE_METADATA.locations.description}
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cities or states..."
              aria-label="Search cities or states"
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>
        </div>

        {loading ? (
          <LoadingState message="Loading industrial regional clusters..." />
        ) : error ? (
          <ErrorState
            title="Unable to Load Locations"
            message={error}
            onRetry={loadLocations}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={search ? "No matching locations found" : "No locations available"}
            description={search ? "No industrial hubs match your search term. Try another city or state name." : "No regional clusters are registered in the directory at this time."}
            actionLabel={search ? "Reset Search" : undefined}
            onAction={search ? () => setSearch("") : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((loc) => (
              <Link
                key={loc.id || loc.slug}
                href={`/locations/${loc.slug}`}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-red-500/60 dark:hover:border-red-500/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {loc.name}
                    </h2>
                    {loc.state && (
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {loc.state}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    {loc.locationType}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                  <span>Explore industrial cluster</span>
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
