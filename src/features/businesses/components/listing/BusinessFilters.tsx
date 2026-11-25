"use client";

import React, { useEffect, useState } from "react";
import { Filter, RotateCcw, CheckSquare, Square } from "lucide-react";
import { BusinessFiltersState } from "../../types/business.types";
import { APP_HEADERS } from "@/config/headers.config";
import { useBusinessCategories } from "@/features/business-categories/hooks/use-business-categories";
import { fetchCategories } from "@/features/categories/category-api";
import { CategoryItem } from "@/features/categories/types";
import { fetchStates, State } from "@/lib/geography-api";
import { Select, Button } from "@/components/common";

export interface BusinessFiltersProps {
  filters: BusinessFiltersState;
  onFilterChange: (filters: Partial<BusinessFiltersState>) => void;
  onReset: () => void;
}

export function BusinessFilters({
  filters,
  onFilterChange,
  onReset,
}: BusinessFiltersProps) {
  const { categories: businessCategories } = useBusinessCategories();
  const [masterCategories, setMasterCategories] = useState<CategoryItem[]>([]);
  const [states, setStates] = useState<State[]>([]);

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

  const toggleBusinessType = (type: string) => {
    if (filters.businessType === type) {
      onFilterChange({ businessType: "all" });
    } else {
      onFilterChange({ businessType: type });
    }
  };

  return (
    <aside className="w-full lg:w-72 bg-surface rounded-2xl border border-border p-5 shadow-xs space-y-6">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-text-primary text-base">
          <Filter className="w-4 h-4 text-primary" />
          <span>{APP_HEADERS.directory.filtersHeading || "Filter Results"}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 px-2 text-xs font-semibold text-text-muted hover:text-primary"
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset
        </Button>
      </div>

      {/* Dynamic Business Category / Type Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
          Business Category
        </label>
        <div className="space-y-1.5">
          {businessCategories.map((cat) => {
            const isChecked = filters.businessType === cat.name || filters.businessType === cat.slug;
            return (
              <label
                key={cat.id || cat.slug}
                onClick={() => toggleBusinessType(cat.name)}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer select-none transition-all ${
                  isChecked
                    ? "bg-primary-soft text-primary border border-primary/20 shadow-2xs"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary border border-transparent"
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-primary flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-border flex-shrink-0" />
                )}
                <span>{cat.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-3 pt-3 border-t border-border">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
          Location
        </label>
        <div className="space-y-2.5">
          <Select
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
          >
            <option value="all">All States & Territories</option>
            {states.map((st) => (
              <option key={st.id || st.code} value={st.name}>
                {st.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Dynamic Master Industry / Category Filter */}
      <div className="space-y-3 pt-3 border-t border-border">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
          Master Category
        </label>
        <Select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
        >
          <option value="all">All Master Categories</option>
          {masterCategories.map((mc) => (
            <option key={mc.id || mc.slug} value={mc.name}>
              {mc.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Verification Filter */}
      <div className="space-y-3 pt-3 border-t border-border">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
          Verification
        </label>
        <div className="space-y-2">
          <label
            onClick={() => onFilterChange({ verifiedOnly: !filters.verifiedOnly })}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer select-none transition-all ${
              filters.verifiedOnly
                ? "bg-primary-soft text-primary border border-primary/20 shadow-2xs"
                : "text-text-secondary hover:bg-surface-hover hover:text-text-primary border border-transparent"
            }`}
          >
            {filters.verifiedOnly ? (
              <CheckSquare className="w-4 h-4 text-primary flex-shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-border flex-shrink-0" />
            )}
            <span>Verified Businesses Only</span>
          </label>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        size="md"
        className="w-full font-bold shadow-xs"
      >
        Apply Filters
      </Button>
    </aside>
  );
}
