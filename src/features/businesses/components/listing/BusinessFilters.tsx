"use client";

import React, { useState } from "react";
import {
  Building2,
  Filter,
  LayoutGrid,
  MapPin,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Select } from "@/components/common";
import { BusinessFacets, BusinessFiltersState } from "../../types/business.types";
import { useBusinessCategories } from "@/features/business-categories/hooks/use-business-categories";
import { resolveLocationFilterUpdate } from "../../utils/business-filters";
import {
  FilterAccordionSection,
  FilterCheckboxOption,
} from "./FilterAccordionSection";

export interface BusinessFiltersProps {
  filters: BusinessFiltersState;
  facets?: BusinessFacets | null;
  onFilterChange: (filters: Partial<BusinessFiltersState>) => void;
  onReset: () => void;
  onApply?: () => void;
  showApplyButton?: boolean;
}

export function BusinessFilters({
  filters,
  facets,
  onFilterChange,
  onReset,
  onApply,
  showApplyButton = false,
}: BusinessFiltersProps) {
  const { categories: storeCategories, loading: taxonomyLoading } = useBusinessCategories();
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [openSections, setOpenSections] = useState({
    businessCategory: true,
    location: true,
    masterCategory: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleBusinessType = (type: string) => {
    onFilterChange({ businessType: filters.businessType === type ? "all" : type });
  };

  const rootCategories = (
    facets?.businessCategories && facets.businessCategories.length > 0
      ? facets.businessCategories
      : storeCategories.filter((c) => !c.parentId && c.isActive !== false)
  )
    .slice()
    .sort((a, b) => (b.businessCount ?? 0) - (a.businessCount ?? 0));

  const populatedCategories = rootCategories.filter((c) => (c.businessCount ?? 0) > 0);
  const defaultVisible = populatedCategories.length > 0 ? populatedCategories : rootCategories.slice(0, 6);
  const displayedCategories = showAllCategories ? rootCategories : defaultVisible;
  const hiddenCount = Math.max(0, rootCategories.length - defaultVisible.length);

  const stateOptions = [
    { value: "all", label: "All States" },
    ...(facets?.locations || []).map((loc) => ({
      value: loc.name,
      label: `${loc.name} (${loc.count})`,
    })),
    ...(filters.location &&
    filters.location !== "all" &&
    !(facets?.locations || []).some(
      (l) => l.name.toLowerCase() === filters.location.toLowerCase()
    )
      ? [{ value: filters.location, label: `${filters.location} (0)` }]
      : []),
  ];

  const cityOptions = [
    {
      value: "all",
      label:
        filters.location && filters.location !== "all"
          ? `All Cities in ${filters.location}`
          : "All Cities",
    },
    ...(facets?.cities || []).map((c) => ({
      value: c.name,
      label: `${c.name} (${c.count})`,
    })),
    ...(filters.city &&
    filters.city !== "all" &&
    !(facets?.cities || []).some(
      (c) => c.name.toLowerCase() === filters.city.toLowerCase()
    )
      ? [{ value: filters.city, label: `${filters.city} (0)` }]
      : []),
  ];

  const masterCategoryOptions = [
    { value: "all", label: "All Industry Sectors" },
    ...(facets?.masterCategories || []).map((mc) => ({
      value: mc.name,
      label: `${mc.name} (${mc.count})`,
    })),
    ...(filters.category &&
    filters.category !== "all" &&
    !(facets?.masterCategories || []).some(
      (mc) => mc.name.toLowerCase() === filters.category.toLowerCase()
    )
      ? [{ value: filters.category, label: `${filters.category} (0)` }]
      : []),
  ];

  const activeFilterCount = [
    filters.businessType !== "all",
    filters.location !== "all",
    filters.city !== "all",
    filters.category !== "all",
  ].filter(Boolean).length;

  return (
    <aside className="w-full bg-surface rounded-2xl border border-border p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3.5 border-b border-border">
        <div className="flex items-center gap-2 font-black text-text-primary text-base">
          <Filter className="w-4 h-4 text-[#7F1D3F] dark:text-primary" />
          <span>Filters</span>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#7F1D3F] dark:text-primary hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All ({activeFilterCount})</span>
          </button>
        )}
      </div>

      <FilterAccordionSection
        title="Business Category"
        icon={<Building2 className="w-3.5 h-3.5 text-text-muted group-hover:text-primary" />}
        isOpen={openSections.businessCategory}
        onToggle={() => toggleSection("businessCategory")}
      >
        <div className="space-y-2 pt-1">
          {displayedCategories.length === 0 ? (
            <p className="text-xs text-text-muted py-1">
              {taxonomyLoading
                ? "Loading live categories..."
                : "No active categories are available right now."}
            </p>
          ) : (
            displayedCategories.map((cat) => (
              <FilterCheckboxOption
                key={cat.id || cat.slug}
                label={cat.name}
                count={cat.businessCount ?? 0}
                checked={
                  filters.businessType === cat.name ||
                  filters.businessType === cat.slug ||
                  filters.businessType.toLowerCase() === cat.name.toLowerCase()
                }
                onSelect={() => toggleBusinessType(cat.name)}
              />
            ))
          )}

          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-xs font-bold text-[#7F1D3F] dark:text-primary hover:underline pt-1 pl-1 cursor-pointer block"
            >
              {showAllCategories
                ? "− Show Active Only"
                : `+ Show More Categories (${hiddenCount})`}
            </button>
          )}
        </div>
      </FilterAccordionSection>

      <FilterAccordionSection
        title="State & City"
        icon={<MapPin className="w-3.5 h-3.5 text-text-muted group-hover:text-primary" />}
        isOpen={openSections.location}
        onToggle={() => toggleSection("location")}
      >
        <div className="pt-1 space-y-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-text-muted mb-1">
              State
            </label>
            <Select
              value={filters.location}
              selectSize="sm"
              onChange={(e) =>
                onFilterChange(
                  resolveLocationFilterUpdate(
                    filters,
                    { location: e.target.value },
                    facets?.cities || []
                  )
                )
              }
              aria-label="Filter by state"
              options={stateOptions}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-text-muted mb-1">
              City
            </label>
            <Select
              value={filters.city}
              selectSize="sm"
              onChange={(e) =>
                onFilterChange(
                  resolveLocationFilterUpdate(
                    filters,
                    { city: e.target.value },
                    facets?.cities || []
                  )
                )
              }
              aria-label="Filter by city"
              options={cityOptions}
            />
          </div>
        </div>
      </FilterAccordionSection>

      <FilterAccordionSection
        title="Master Category"
        icon={<LayoutGrid className="w-3.5 h-3.5 text-text-muted group-hover:text-primary" />}
        isOpen={openSections.masterCategory}
        onToggle={() => toggleSection("masterCategory")}
        hasBorder={false}
      >
        <div className="pt-1">
          <Select
            value={filters.category}
            selectSize="sm"
            onChange={(e) => onFilterChange({ category: e.target.value })}
            aria-label="Filter by master category"
            options={masterCategoryOptions}
          />
        </div>
      </FilterAccordionSection>

      {showApplyButton && (
        <button
          type="button"
          onClick={onApply}
          className="w-full py-3 px-4 rounded-xl bg-[#7F1D3F] hover:bg-[#681532] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Show Matching Businesses</span>
        </button>
      )}
    </aside>
  );
}
