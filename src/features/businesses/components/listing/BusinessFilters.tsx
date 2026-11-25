"use client";

import React, { useEffect, useState } from "react";
import {
  Filter,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  LayoutGrid,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Select } from "@/components/common";
import { BusinessFiltersState } from "../../types/business.types";
import { useBusinessCategories } from "@/features/business-categories/hooks/use-business-categories";
import { fetchCategories } from "@/features/categories/category-api";
import { CategoryItem } from "@/features/categories/types";
import { fetchStates, State } from "@/lib/geography-api";

export interface BusinessFiltersProps {
  filters: BusinessFiltersState;
  onFilterChange: (filters: Partial<BusinessFiltersState>) => void;
  onReset: () => void;
  onApply?: () => void;
}

export function BusinessFilters({
  filters,
  onFilterChange,
  onReset,
  onApply,
}: BusinessFiltersProps) {
  const { categories: businessCategories } = useBusinessCategories();
  const [masterCategories, setMasterCategories] = useState<CategoryItem[]>([]);
  const [states, setStates] = useState<State[]>([]);

  const [openSections, setOpenSections] = useState({
    businessCategory: true,
    location: true,
    masterCategory: true,
    verification: true,
  });

  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then((cats) => setMasterCategories(cats || []))
      .catch((err) => console.error("Failed to load master categories for filter:", err));

    fetchStates({ limit: 100 })
      .then((res) => {
        if (res?.items) setStates(res.items);
      })
      .catch((err) => console.error("Failed to load states for filter:", err));
  }, []);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleBusinessType = (type: string) => {
    if (filters.businessType === type) {
      onFilterChange({ businessType: "all" });
    } else {
      onFilterChange({ businessType: type });
    }
  };

  const rootCategories = businessCategories.filter(
    (c) => !c.parentId && c.isActive !== false
  );

  const displayedCategories = showAllCategories
    ? rootCategories
    : rootCategories.slice(0, 4);

  return (
    <aside className="w-full bg-surface rounded-2xl border border-border p-5 shadow-xs space-y-5">
      {/* Title & Clear All */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border">
        <div className="flex items-center gap-2 font-black text-text-primary text-base">
          <Filter className="w-4 h-4 text-[#7F1D3F] dark:text-primary" />
          <span>Filters</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#7F1D3F] dark:text-primary hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* 1. Business Category */}
      <div className="space-y-3 pb-4 border-b border-border">
        <button
          type="button"
          onClick={() => toggleSection("businessCategory")}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-text-muted group-hover:text-primary" />
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Business Category
            </span>
          </div>
          {openSections.businessCategory ? (
            <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          )}
        </button>

        {openSections.businessCategory && (
          <div className="space-y-2 pt-1">
            {displayedCategories.map((cat) => {
              const isChecked =
                filters.businessType === cat.name ||
                filters.businessType === cat.slug ||
                filters.businessType.toLowerCase() === cat.name.toLowerCase();

              const count = cat.businessCount ?? 0;

              return (
                <label
                  key={cat.id || cat.slug}
                  onClick={() => toggleBusinessType(cat.name)}
                  className="flex items-center justify-between py-1 px-1 rounded-lg text-xs font-medium cursor-pointer select-none hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        isChecked
                          ? "bg-[#7F1D3F] border-[#7F1D3F] text-white"
                          : "border-border bg-surface"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={isChecked ? "font-bold text-[#7F1D3F] dark:text-primary" : "text-text-secondary"}>
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-text-muted">
                    ({count})
                  </span>
                </label>
              );
            })}

            {rootCategories.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-xs font-bold text-[#7F1D3F] dark:text-primary hover:underline pt-1 pl-1 cursor-pointer block"
              >
                {showAllCategories ? "− Show Less" : "+ Show More"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Location */}
      <div className="space-y-3 pb-4 border-b border-border">
        <button
          type="button"
          onClick={() => toggleSection("location")}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-text-muted group-hover:text-primary" />
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Location
            </span>
          </div>
          {openSections.location ? (
            <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          )}
        </button>

        {openSections.location && (
          <div className="pt-1">
            <Select
              value={filters.location}
              selectSize="sm"
              onChange={(e) => onFilterChange({ location: e.target.value })}
              aria-label="Filter by location"
              options={[
                { value: "all", label: "Select Location" },
                ...states.map((st) => ({ value: st.name, label: st.name })),
              ]}
            />
          </div>
        )}
      </div>

      {/* 3. Master Category */}
      <div className="space-y-3 pb-4 border-b border-border">
        <button
          type="button"
          onClick={() => toggleSection("masterCategory")}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-3.5 h-3.5 text-text-muted group-hover:text-primary" />
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Master Category
            </span>
          </div>
          {openSections.masterCategory ? (
            <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          )}
        </button>

        {openSections.masterCategory && (
          <div className="pt-1">
            <Select
              value={filters.category}
              selectSize="sm"
              onChange={(e) => onFilterChange({ category: e.target.value })}
              aria-label="Filter by master category"
              options={[
                { value: "all", label: "Select Category" },
                ...masterCategories.map((mc) => ({ value: mc.name, label: mc.name })),
              ]}
            />
          </div>
        )}
      </div>

      {/* 4. Verification Status */}
      <div className="space-y-3 pb-4">
        <button
          type="button"
          onClick={() => toggleSection("verification")}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-text-muted group-hover:text-primary" />
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Verification Status
            </span>
          </div>
          {openSections.verification ? (
            <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          )}
        </button>

        {openSections.verification && (
          <div className="space-y-2 pt-1">
            <label
              onClick={() => onFilterChange({ verifiedOnly: true })}
              className="flex items-center justify-between py-1 px-1 rounded-lg text-xs font-medium cursor-pointer select-none hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                    filters.verifiedOnly
                      ? "bg-[#7F1D3F] border-[#7F1D3F] text-white"
                      : "border-border bg-surface"
                  }`}
                >
                  {filters.verifiedOnly && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={filters.verifiedOnly ? "font-bold text-[#7F1D3F] dark:text-primary" : "text-text-secondary"}>
                  Verified Only
                </span>
              </div>
            </label>

            <label
              onClick={() => onFilterChange({ verifiedOnly: false })}
              className="flex items-center justify-between py-1 px-1 rounded-lg text-xs font-medium cursor-pointer select-none hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                    !filters.verifiedOnly
                      ? "bg-[#7F1D3F] border-[#7F1D3F] text-white"
                      : "border-border bg-surface"
                  }`}
                >
                  {!filters.verifiedOnly && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={!filters.verifiedOnly ? "font-bold text-[#7F1D3F] dark:text-primary" : "text-text-secondary"}>
                  All Businesses
                </span>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Apply Filters Button */}
      <button
        type="button"
        onClick={onApply}
        className="w-full py-3 px-4 rounded-xl bg-[#7F1D3F] hover:bg-[#681532] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
      >
        <Filter className="w-3.5 h-3.5" />
        <span>Apply Filters</span>
      </button>
    </aside>
  );
}
