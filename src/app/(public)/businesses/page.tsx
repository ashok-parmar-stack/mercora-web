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
import { Business } from "@/features/businesses/types/business.types";
import { SavedBusinessesDrawer } from "@/features/saved-businesses/components/SavedBusinessesDrawer";
import { ContactInquiryModal } from "@/features/enquiries/components/ContactInquiryModal";
import { AddBusinessModal } from "@/features/businesses/components/AddBusinessModal";
import { SlidersHorizontal, X } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans transition-colors">
      <Header savedCount={savedIds.length} />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* 1. Search Hero Banner */}
        <BusinessSearch
          query={filters.query}
          onQueryChange={(q) => setFilters((prev) => ({ ...prev, query: q }))}
          selectedCategory={filters.businessType}
          onCategoryChange={(type) => setFilters((prev) => ({ ...prev, businessType: type }))}
          location={filters.location}
          onLocationChange={(loc) => setFilters((prev) => ({ ...prev, location: loc }))}
          onSubmit={refresh}
          totalFound={totalCount}
        />

        {/* 2. Main Two-Column Content: Left Filter Sidebar + Right Results */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Sticky Filter Sidebar (Desktop) */}
          <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-24">
            <BusinessFilters
              filters={filters}
              onFilterChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
              onReset={resetFilters}
              onApply={refresh}
            />
          </div>

          {/* Right Column: Business Results */}
          <div className="flex-1 w-full space-y-6">
            {/* Results Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <p className="text-sm font-bold text-text-primary tracking-tight">
                  {isLoading
                    ? "Searching verified businesses..."
                    : `Showing ${startItem}–${endItem} of ${totalCount.toLocaleString()} businesses`}
                </p>
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
                      { value: "established", label: "Sort: Established Year" },
                    ]}
                  />
                </div>

                {/* Grid / List View Toggle */}
                <BusinessViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              </div>
            </div>

            {/* Results Grid / Table */}
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
                title="No Businesses Found"
                description="Try adjusting your category selection, location, or search keywords."
                actionLabel="Clear Filters"
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
                    onContact={(b) => setInquiryBusiness(b)}
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
              onFilterChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
              onReset={resetFilters}
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
        onBusinessCreated={refresh}
      />

      <Footer />
    </div>
  );
}
