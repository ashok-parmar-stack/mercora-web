"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import {
  EmptyState,
  LoadingState,
  ErrorState,
  Input,
  Badge,
} from "@/components/common";
import { apiHttpClient } from "@/lib/http/client";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";
import { PAGE_METADATA } from "@/config/page-metadata";

interface CityItem {
  id: string;
  name: string;
  code?: string;
  slug: string;
  state?: string;
  locationType?: string;
  businessCount?: number;
}

const FALLBACK_CLUSTERS: CityItem[] = [
  { id: "ahmedabad", name: "Ahmedabad", slug: "ahmedabad", code: "AMD", state: "Gujarat", locationType: "Industrial Machinery & Engineering Hub" },
  { id: "surat", name: "Surat", slug: "surat", code: "ST", state: "Gujarat", locationType: "Textiles, Diamonds & Apparel Hub" },
  { id: "vadodara", name: "Vadodara", slug: "vadodara", code: "BRC", state: "Gujarat", locationType: "Pharmaceuticals, Chemicals & Power Hub" },
  { id: "morbi", name: "Morbi", slug: "morbi", code: "MRB", state: "Gujarat", locationType: "Ceramics, Tiles & Sanitaryware Capital" },
  { id: "rajkot", name: "Rajkot", slug: "rajkot", code: "RJT", state: "Gujarat", locationType: "Auto Components, Casting & Forging Hub" },
  { id: "gandhinagar", name: "Gandhinagar", slug: "gandhinagar", code: "GND", state: "Gujarat", locationType: "Electronics, IT & Finance Hub" },
  { id: "bharuch", name: "Bharuch", slug: "bharuch", code: "BH", state: "Gujarat", locationType: "Chemicals, Petrochemicals & Dyes" },
  { id: "ankleshwar", name: "Ankleshwar", slug: "ankleshwar", code: "ANK", state: "Gujarat", locationType: "Chemical & Bulk Drug Industrial Estate" },
  { id: "vapi", name: "Vapi", slug: "vapi", code: "VP", state: "Gujarat", locationType: "Chemical, Paper & Plastics Hub" },
  { id: "jamnagar", name: "Jamnagar", slug: "jamnagar", code: "JAM", state: "Gujarat", locationType: "Brass Components & Refining" },
  { id: "bhavnagar", name: "Bhavnagar", slug: "bhavnagar", code: "BHV", state: "Gujarat", locationType: "Ship Recycling & Plastic Machinery" },
  { id: "pune", name: "Pune", slug: "pune", code: "PN", state: "Maharashtra", locationType: "Automobile & Heavy Engineering Corridor" },
  { id: "mumbai", name: "Mumbai", slug: "mumbai", code: "BOM", state: "Maharashtra", locationType: "Commercial & Financial Headquarters" },
  { id: "bengaluru", name: "Bengaluru", slug: "bengaluru", code: "BLR", state: "Karnataka", locationType: "Aerospace, Technology & Precision Engineering" },
];

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
      const res = await apiHttpClient.get<any>("/locations/cities");
      const json = res.data;
      const list = Array.isArray(json) ? json : json?.data || [];
      if (list.length > 0) {
        const formatted: CityItem[] = list.map((item: any) => ({
          id: item.id || item.slug,
          name: item.name,
          code: item.code,
          slug: item.slug || (item.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          state: (typeof item.state === "object" ? item.state?.name : item.state) || item.stateName || "Gujarat",
          locationType: item.locationType || "Industrial Hub",
          businessCount: typeof item.businessCount === "number" ? item.businessCount : undefined,
        }));
        setLocations(formatted);
        return;
      }
      setLocations(FALLBACK_CLUSTERS);
    } catch (err: any) {
      console.warn("Locations API fetch failed, using baseline clusters:", err);
      setLocations(FALLBACK_CLUSTERS);
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
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <Header savedCount={savedCount} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
              <MapPin className="w-4 h-4" />
              <span>Pan-India Regional Clusters</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
              {PAGE_METADATA.locations.title}
            </h1>
            <p className="text-sm text-text-secondary mt-1 max-w-2xl">
              {PAGE_METADATA.locations.description}
            </p>
          </div>

          <div className="w-full md:w-72">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cities or states..."
              aria-label="Search cities or states"
              leftIcon={<Search className="w-4 h-4" />}
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
                className="group p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                      {loc.name}
                    </h2>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {typeof loc.businessCount === "number" && loc.businessCount > 0 && (
                        <Badge variant="success" size="sm">
                          {loc.businessCount} {loc.businessCount === 1 ? "Business" : "Businesses"}
                        </Badge>
                      )}
                      {loc.state && (
                        <Badge variant="secondary" size="sm">
                          {loc.state}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mt-2 font-medium">
                    {loc.locationType}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-primary">
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
