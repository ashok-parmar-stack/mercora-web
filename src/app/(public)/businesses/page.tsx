"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BusinessSearch } from "@/features/businesses/components/listing/BusinessSearch";
import { BusinessFilters } from "@/features/businesses/components/listing/BusinessFilters";
import { BusinessCard } from "@/features/businesses/components/listing/BusinessCard";
import { BusinessTable } from "@/features/businesses/components/listing/BusinessTable";
import { BusinessViewToggle } from "@/features/businesses/components/listing/BusinessViewToggle";
import { BusinessCardSkeleton } from "@/features/businesses/components/listing/BusinessCardSkeleton";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { useBusinesses } from "@/features/businesses/hooks/use-businesses";
import { useSavedBusinesses } from "@/features/saved-businesses/hooks/use-saved-businesses";
import { Business } from "@/features/businesses/types/business.types";
import { SavedBusinessesDrawer } from "@/features/saved-businesses/components/SavedBusinessesDrawer";
import { ContactInquiryModal } from "@/features/enquiries/components/ContactInquiryModal";
import { APP_HEADERS } from "@/config/headers.config";
import { APP_MESSAGES } from "@/config/messages.config";
import { SlidersHorizontal } from "lucide-react";

export default function BusinessesDiscoveryPage() {
  const {
    businesses,
    totalCount,
    isLoading,
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
  } = useBusinesses();

  const { savedIds, isSaved, toggleSave } = useSavedBusinesses();
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [inquiryBusiness, setInquiryBusiness] = useState<Business | null>(null);

  const savedList = businesses.filter((b) => savedIds.includes(b.id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header savedCount={savedIds.length} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Search Hero */}
        <BusinessSearch
          query={filters.query}
          onQueryChange={(q) => setFilters((prev) => ({ ...prev, query: q }))}
          selectedCategory={filters.businessType}
          onCategoryChange={(type) => setFilters((prev) => ({ ...prev, businessType: type }))}
          onSubmit={refresh}
          totalFound={totalCount}
        />

        {/* Results Header Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{totalCount.toLocaleString()} {APP_HEADERS.directory.resultsHeading}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified suppliers and certified manufacturers across India.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span>Filters</span>
            </button>

            {/* Sort Selector */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 outline-hidden font-semibold"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="established">Sort: Established Year</option>
            </select>

            {/* Card / Table Toggle */}
            <BusinessViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>

        {/* Two-Column Grid: Filters Sidebar + Results */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filters Sidebar */}
          <div className={`${showMobileFilter ? "block" : "hidden"} lg:block w-full lg:w-72 flex-shrink-0`}>
            <BusinessFilters
              filters={filters}
              onFilterChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
              onReset={resetFilters}
            />
          </div>

          {/* Results Area */}
          <div className="flex-1 w-full space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BusinessCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState
                title="Unable to Load Businesses"
                message={error}
                onRetry={refresh}
              />
            ) : businesses.length === 0 ? (
              <EmptyState
                title={APP_MESSAGES.empty.noBusinessesFound.title}
                description={APP_MESSAGES.empty.noBusinessesFound.description}
                actionLabel={APP_MESSAGES.empty.noBusinessesFound.actionLabel}
                onAction={resetFilters}
              />
            ) : viewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    isSaved={isSaved(business.id)}
                    onToggleSave={() => toggleSave(business.id)}
                    onSelect={() => {}}
                  />
                ))}
              </div>
            ) : (
              <BusinessTable
                businesses={businesses}
                onSelect={(b) => {
                  window.location.href = `/businesses/${b.slug}`;
                }}
              />
            )}

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalCount}
              pageSize={12}
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>

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

      <Footer />
    </div>
  );
}
