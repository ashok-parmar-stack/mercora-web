"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, GitCompare, Check } from "lucide-react";
import { CustomerSubHeader } from "@/components/layout/CustomerSubHeader";
import { Footer } from "@/components/layout/Footer";
import { BusinessCard } from "@/features/businesses/components/listing/BusinessCard";
import { BusinessCompareTable } from "@/features/saved-businesses/components/BusinessCompareTable";
import { ContactInquiryModal } from "@/features/enquiries/components/ContactInquiryModal";
import { Button, EmptyState, ErrorState, LoadingState } from "@/components/common";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";
import { fetchBusinesses } from "@/features/businesses/api/business-api";
import { Business } from "@/features/businesses/types/business.types";
import { MESSAGES, formatUserFriendlyError } from "@/config/messages";

export default function CustomerSavedBusinessesPage() {
  const router = useRouter();
  const { savedIds, toggleSave, isSaved } = useSavedBusinesses();
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [inquiryBusiness, setInquiryBusiness] = useState<Business | null>(null);

  const loadSaved = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBusinesses({ limit: 100 });
      setAllBusinesses(res.data || []);
    } catch (err) {
      setError(
        formatUserFriendlyError(
          err,
          "Unable to load your saved businesses right now. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSaved();
  }, [loadSaved]);

  const savedList = allBusinesses.filter((b) => savedIds.includes(b.id));

  // Keep compareIds synced with currently saved businesses
  useEffect(() => {
    setCompareIds((prev) => prev.filter((id) => savedIds.includes(id)));
  }, [savedIds]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.search.includes("compare=true") &&
      savedList.length >= 2
    ) {
      setCompareIds(savedList.slice(0, 4).map((b) => b.id));
      setIsComparing(true);
    }
  }, [savedList.length]);

  const toggleCompare = (businessId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(businessId)) {
        const next = prev.filter((id) => id !== businessId);
        if (next.length < 2) setIsComparing(false);
        return next;
      }
      if (prev.length >= 4) return prev;
      return [...prev, businessId];
    });
  };

  const handleOpenCompare = () => {
    if (compareIds.length >= 2) {
      setIsComparing(true);
      return;
    }
    if (savedList.length >= 2) {
      setCompareIds(savedList.slice(0, 4).map((b) => b.id));
      setIsComparing(true);
    }
  };

  const compareBusinesses = savedList.filter((b) => compareIds.includes(b.id));

  return (
    <>
      <CustomerSubHeader
        icon={<Bookmark className="w-5 h-5 text-primary fill-primary shrink-0" />}
        title={`Saved Businesses (${savedList.length})`}
        backHref="/businesses"
        backLabel="Back to Directory"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingState message="Loading bookmarked suppliers..." />
          </div>
        ) : error ? (
          <ErrorState
            title="Unable to Load Saved Businesses"
            message={error}
            onRetry={loadSaved}
          />
        ) : savedList.length === 0 ? (
          <EmptyState
            title="No saved businesses yet"
            description={MESSAGES.businesses.emptySaved}
            actionLabel="Browse Businesses"
            onAction={() => router.push("/businesses")}
          />
        ) : (
          <>
            {/* Compare Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-surface border border-border">
              <div className="text-xs text-text-secondary">
                {savedList.length < 2 ? (
                  <span>
                    Save at least <strong>2 businesses</strong> to compare them side-by-side.{" "}
                    <Link href="/businesses" className="text-primary font-bold hover:underline">
                      Browse Directory
                    </Link>
                  </span>
                ) : (
                  <span>
                    Select <strong>2–4</strong> saved businesses to compare side-by-side (
                    {compareIds.length} selected).
                  </span>
                )}
              </div>

              {savedList.length >= 2 && (
                <div className="flex items-center gap-2">
                  {compareIds.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCompareIds([]);
                        setIsComparing(false);
                      }}
                    >
                      Clear Selection
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleOpenCompare}
                    leftIcon={<GitCompare className="w-4 h-4" />}
                  >
                    {compareIds.length >= 2
                      ? `Compare Selected (${compareIds.length})`
                      : `Compare Businesses`}
                  </Button>
                </div>
              )}
            </div>

            {isComparing && compareBusinesses.length >= 2 && (
              <BusinessCompareTable
                businesses={compareBusinesses}
                onRemoveFromCompare={toggleCompare}
                onContact={(b) => setInquiryBusiness(b)}
                onClose={() => setIsComparing(false)}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedList.map((business) => {
                const selectedForCompare = compareIds.includes(business.id);
                return (
                  <div key={business.id} className="space-y-2">
                    <BusinessCard
                      business={business}
                      isSaved={isSaved(business.id)}
                      onToggleSave={toggleSave}
                      onContact={(b) => setInquiryBusiness(b)}
                    />
                    {savedList.length >= 2 && (
                      <button
                        type="button"
                        onClick={() => toggleCompare(business.id)}
                        disabled={!selectedForCompare && compareIds.length >= 4}
                        className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedForCompare
                            ? "bg-primary-soft border-primary/40 text-primary"
                            : "bg-surface border-border text-text-secondary hover:text-primary"
                        }`}
                      >
                        {selectedForCompare ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Selected for Comparison</span>
                          </>
                        ) : (
                          <>
                            <GitCompare className="w-3.5 h-3.5" />
                            <span>Select to Compare</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {inquiryBusiness && (
        <ContactInquiryModal
          isOpen={!!inquiryBusiness}
          onClose={() => setInquiryBusiness(null)}
          businessId={inquiryBusiness.id}
          businessName={inquiryBusiness.name}
        />
      )}

      <Footer />
    </>
  );
}
