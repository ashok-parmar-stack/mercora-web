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
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { useBusinesses } from "@/features/businesses/hooks/use-businesses";
import { useSavedBusinesses } from "@/features/saved-businesses/hooks/use-saved-businesses";
import { Business } from "@/features/businesses/types/business.types";
import { SavedBusinessesDrawer } from "@/features/saved-businesses/components/SavedBusinessesDrawer";
import { ContactInquiryModal } from "@/features/enquiries/components/ContactInquiryModal";
import { AddBusinessModal } from "@/features/businesses/components/AddBusinessModal";
import { APP_HEADERS } from "@/config/headers.config";
import { APP_MESSAGES } from "@/config/messages.config";
import { SlidersHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  RadixSelect as Select,
  RadixSelectContent as SelectContent,
  RadixSelectItem as SelectItem,
  RadixSelectTrigger as SelectTrigger,
  RadixSelectValue as SelectValue,
} from "@/components/ui/RadixSelect";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";

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

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans transition-colors">
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="lg:hidden"
              leftIcon={<SlidersHorizontal className="w-4 h-4 text-slate-500" />}
            >
              Filters
            </Button>

            {/* Sort Selector */}
            <Select
              value={filters.sortBy}
              onValueChange={(val) => setFilters((prev) => ({ ...prev, sortBy: val as any }))}
            >
              <SelectTrigger className="w-[180px] h-9 text-xs font-semibold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Sort: Relevance</SelectItem>
                <SelectItem value="rating">Sort: Highest Rated</SelectItem>
                <SelectItem value="established">Sort: Established Year</SelectItem>
              </SelectContent>
            </Select>

            {/* Card / Table Toggle */}
            <BusinessViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

            {/* Add Business Action */}
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="font-bold rounded-xl shadow-xs"
            >
              Add Business
            </Button>
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
                    onSelect={() => { }}
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

      <AddBusinessModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBusinessCreated={refresh}
      />

      <Footer />
    </div>
  );
}
