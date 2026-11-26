"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BusinessSearch } from "@/features/businesses/components/listing/BusinessSearch";
import { BusinessFilters } from "@/features/businesses/components/listing/BusinessFilters";
import { BusinessCard } from "@/features/businesses/components/listing/BusinessCard";
import { BusinessTable } from "@/features/businesses/components/listing/BusinessTable";
import { BusinessViewToggle } from "@/features/businesses/components/listing/BusinessViewToggle";
import { BusinessCardSkeleton } from "@/features/businesses/components/listing/BusinessCardSkeleton";
import {
  Button,
  Select,
  Pagination,
  EmptyState,
  ErrorState,
} from "@/components/common";
import { useBusinesses } from "@/features/businesses/hooks/use-businesses";
import { useSavedBusinesses } from "@/features/saved-businesses/hooks/use-saved-businesses";
import { useTaxonomyStore } from "@/lib/store/taxonomy-store";
import {
  Business,
  BusinessFacets,
  BusinessFiltersState,
} from "@/features/businesses/types/business.types";
import { SavedBusinessesDrawer } from "@/features/saved-businesses/components/SavedBusinessesDrawer";
import { ContactInquiryModal } from "@/features/enquiries/components/ContactInquiryModal";
import { AddBusinessModal } from "@/features/businesses/components/AddBusinessModal";
import { getDirectoryEmptyMessage } from "@/config/messages";
import { SlidersHorizontal, X } from "lucide-react";

export interface BusinessesDiscoveryClientProps {
  initialBusinesses?: Business[];
  initialTotal?: number;
  initialTotalPages?: number;
  initialFacets?: BusinessFacets | null;
  initialFilters?: Partial<BusinessFiltersState>;
}

export function BusinessesDiscoveryClient({
  initialBusinesses,
  initialTotal,
  initialTotalPages,
  initialFacets,
  initialFilters,
}: BusinessesDiscoveryClientProps) {
  const {
    businesses,
    facets,
    totalCount,
    isLoading,
    isFetching,
    error,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    resetFilters,
    page,
    setPage,
    totalPages,
    refresh,
  } = useBusinesses({
    initialBusinesses,
    initialTotal,
    initialTotalPages,
    initialFacets,
    initialFilters,
  });

  const { savedIds, isSaved, toggleSave } = useSavedBusinesses();
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [inquiryBusiness, setInquiryBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("action=add")) {
      setIsAddModalOpen(true);
    }
  }, []);

  const savedList = businesses.filter((b) => savedIds.includes(b.id));

  const startItem = totalCount === 0 ? 0 : (page - 1) * 12 + 1;
  const endItem = Math.min(page * 12, totalCount);

  const activeFilterPills: Array<{ key: string; label: string; onClear: () => void }> = [];
  if (filters.query.trim()) {
    activeFilterPills.push({
      key: "query",
      label: `Search: "${filters.query.trim()}"`,
      onClear: () => setFilters((prev) => ({ ...prev, query: "" })),
    });
  }
  if (filters.businessType && filters.businessType !== "all") {
    activeFilterPills.push({
      key: "businessType",
      label: `Category: ${filters.businessType}`,
      onClear: () => setFilters((prev) => ({ ...prev, businessType: "all" })),
    });
  }
  if (filters.location && filters.location !== "all") {
    activeFilterPills.push({
      key: "location",
      label: `State: ${filters.location}`,
      onClear: () => setFilters((prev) => ({ ...prev, location: "all", city: "all" })),
    });
  }
  if (filters.city && filters.city !== "all") {
    activeFilterPills.push({
      key: "city",
      label: `City: ${filters.city}`,
      onClear: () => setFilters((prev) => ({ ...prev, city: "all" })),
    });
  }
  if (filters.category && filters.category !== "all") {
    activeFilterPills.push({
      key: "category",
      label: `Sector: ${filters.category}`,
      onClear: () => setFilters((prev) => ({ ...prev, category: "all" })),
    });
  }

  const emptyMessage = getDirectoryEmptyMessage({
    query: filters.query,
    businessType: filters.businessType,
    category: filters.category,
    location: filters.location,
    city: filters.city,
    verifiedOnly: filters.verifiedOnly,
    totalAvailable: facets?.totalBusinesses,
  });

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans transition-colors">
      <Header savedCount={savedIds.length} />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* 1. Search Hero Banner */}
        <BusinessSearch
          query={filters.query}
          onQueryChange={(q) => setFilters((prev) => ({ ...prev, query: q }))}
          onSubmit={refresh}
          totalFound={facets?.totalBusinesses ?? totalCount}
        />

        {/* 2. Main Two-Column Content: Left Filter Sidebar + Right Results */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Sticky Filter Sidebar (Desktop) */}
          <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-24">
            <BusinessFilters
              filters={filters}
              facets={facets}
              onFilterChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
              onReset={resetFilters}
              onApply={refresh}
            />
          </div>

          {/* Right Column: Business Results */}
          <div className="flex-1 w-full space-y-6">
            {/* Results Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <p className="text-sm font-bold text-text-primary tracking-tight">
                  {isLoading
                    ? "Searching verified businesses..."
                    : totalCount === 0
                    ? "No matching businesses found"
                    : `Showing ${startItem}–${endItem} of ${totalCount.toLocaleString()} businesses`}
                </p>
                {!isLoading && isFetching && (
                  <span className="text-xs font-medium text-primary animate-pulse">
                    Updating...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileFilter(true)}
                  className="lg:hidden"
                  leftIcon={<SlidersHorizontal className="w-4 h-4 text-primary" />}
                >
                  Filters
                </Button>

                {/* Sort Selector Dropdown */}
                <div className="w-48">
                  <Select
                    value={filters.sortBy}
                    selectSize="sm"
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
                    }
                    aria-label="Sort businesses"
                    options={[
                      { value: "relevance", label: "Sort: Most Relevant" },
                      { value: "rating", label: "Sort: Highest Rated" },
                      { value: "reviews", label: "Sort: Most Reviewed" },
                      { value: "established", label: "Sort: Established Year" },
                    ]}
                  />
                </div>

                {/* Grid / List View Toggle */}
                <BusinessViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              </div>
            </div>

            {activeFilterPills.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-text-muted">Active filters:</span>
                {activeFilterPills.map((pill) => (
                  <button
                    key={pill.key}
                    type="button"
                    onClick={pill.onClear}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FCECEE] dark:bg-primary-soft text-[#7F1D3F] dark:text-primary border border-[#EACCCE] dark:border-primary/30 hover:opacity-85 transition-opacity cursor-pointer"
                  >
                    <span>{pill.label}</span>
                    <X className="w-3 h-3" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-bold text-text-secondary hover:text-primary underline ml-1 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Grid / Table */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BusinessCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState
                title="Unable to Load Directory"
                message={error}
                onRetry={refresh}
              />
            ) : businesses.length === 0 ? (
              <EmptyState
                title={emptyMessage.title}
                description={emptyMessage.description}
                actionLabel={activeFilterPills.length > 0 ? "Clear All Filters" : undefined}
                onAction={activeFilterPills.length > 0 ? resetFilters : undefined}
              />
            ) : viewMode === "card" ? (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-150 ${
                  isFetching ? "opacity-60" : "opacity-100"
                }`}
              >
                {businesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    isSaved={isSaved(business.id)}
                    onToggleSave={() => toggleSave(business.id)}
                    onContact={(b) => setInquiryBusiness(b)}
                  />
                ))}
              </div>
            ) : (
              <div className={`transition-opacity duration-150 ${isFetching ? "opacity-60" : "opacity-100"}`}>
                <BusinessTable
                  businesses={businesses}
                  onSelect={(b) => {
                    window.location.href = `/businesses/${b.slug}`;
                  }}
                />
              </div>
            )}

            {/* Centered Pagination */}
            {totalPages > 1 && (
              <div className="pt-6 pb-2 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  pageSize={12}
                  showFirstLast={false}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Slide-Over Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowMobileFilter(false)}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-surface shadow-2xl p-5 overflow-y-auto flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-black text-base text-text-primary">Filters</span>
              <button
                type="button"
                onClick={() => setShowMobileFilter(false)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <BusinessFilters
              filters={filters}
              facets={facets}
              onFilterChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
              onReset={resetFilters}
              showApplyButton
              onApply={() => {
                refresh();
                setShowMobileFilter(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Drawers & Modals */}
      <SavedBusinessesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedBusinesses={savedList}
        onRemove={toggleSave}
      />

      {inquiryBusiness && (
        <ContactInquiryModal
          isOpen={!!inquiryBusiness}
          onClose={() => setInquiryBusiness(null)}
          businessId={inquiryBusiness.id}
          businessName={inquiryBusiness.name}
        />
      )}

      <AddBusinessModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBusinessCreated={() => {
          useTaxonomyStore.getState().invalidateTaxonomy();
          refresh();
        }}
      />

      <Footer />
    </div>
  );
}
