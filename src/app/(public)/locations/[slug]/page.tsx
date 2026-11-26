"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Home, ArrowLeft, MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BusinessCard } from "@/features/businesses/components/listing/BusinessCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/common";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";
import { fetchBusinesses } from "@/features/businesses/api/business-api";
import { Business } from "@/features/businesses/types/business.types";
import { formatUserFriendlyError } from "@/config/messages";

export default function LocationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";
  const decodedLocation = decodeURIComponent(slug).replace(/-/g, " ");
  const { savedCount } = useSavedBusinesses();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocationBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBusinesses({ location: decodedLocation, limit: 50 });
      setBusinesses(res.data || []);
    } catch (err) {
      setBusinesses([]);
      setError(
        formatUserFriendlyError(
          err,
          `Unable to load businesses for ${decodedLocation} right now. Please try again.`
        )
      );
    } finally {
      setLoading(false);
    }
  }, [decodedLocation]);

  useEffect(() => {
    void loadLocationBusinesses();
  }, [loadLocationBusinesses]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <Header savedCount={savedCount} />

      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs text-text-secondary font-medium">
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="w-3.5 h-3.5" />
            </Link>
            <span>/</span>
            <Link href="/locations" className="hover:text-text-primary transition-colors">
              Locations
            </Link>
            <span>/</span>
            <span className="text-text-primary font-bold capitalize">
              {decodedLocation}
            </span>
          </nav>

          <Link
            href="/locations"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Locations</span>
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary capitalize">
              Businesses in {decodedLocation}
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Verified trade partners, manufacturers, and industrial suppliers operating in this hub.
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState message={`Finding verified businesses in ${decodedLocation}...`} />
        ) : error ? (
          <ErrorState
            title="Unable to Load Location Businesses"
            message={error}
            onRetry={loadLocationBusinesses}
          />
        ) : businesses.length === 0 ? (
          <EmptyState
            title={`No businesses listed in ${decodedLocation} yet`}
            description="Verified businesses in this region are currently onboarding. Browse our directory to discover verified partners across active hubs."
            actionLabel="Browse All Businesses"
            onAction={() => router.push("/businesses")}
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
