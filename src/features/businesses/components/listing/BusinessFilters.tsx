"use client";

import React, { useEffect, useState } from "react";
import { Filter, RotateCcw, CheckSquare, Square } from "lucide-react";
import { BusinessFiltersState } from "../../types/business.types";
import { APP_HEADERS } from "@/config/headers.config";
import { useBusinessCategories } from "@/features/business-categories/hooks/use-business-categories";
import { fetchCategories } from "@/features/categories/category-api";
import { CategoryItem } from "@/features/categories/types";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

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

  useEffect(() => {
    fetchCategories()
      .then((cats) => setMasterCategories(cats || []))
      .catch((err) => console.error("Failed to load master categories for filter:", err));
  }, []);

  const toggleBusinessType = (type: string) => {
    if (filters.businessType === type) {
      onFilterChange({ businessType: "all" });
    } else {
      onFilterChange({ businessType: type });
    }
  };

  return (
    <aside className="w-full lg:w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-6">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
          <Filter className="w-4 h-4 text-red-600" />
          <span>{APP_HEADERS.directory.filtersHeading || "Filter Results"}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 px-2 text-xs font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset
        </Button>
      </div>

      {/* Dynamic Business Category / Type Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
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
                    ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/80 dark:border-red-900/40 shadow-xs"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white border border-transparent"
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                )}
                <span>{cat.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Location
        </label>
        <div className="space-y-2.5">
          <Select
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
          >
            <option value="all">All States</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Delhi">Delhi NCR</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </Select>
        </div>
      </div>

      {/* Dynamic Master Industry / Category Filter */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
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
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Verification
        </label>
        <div className="space-y-2">
          <label
            onClick={() => onFilterChange({ verifiedOnly: !filters.verifiedOnly })}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer select-none transition-all ${
              filters.verifiedOnly
                ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/80 dark:border-red-900/40 shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white border border-transparent"
            }`}
          >
            {filters.verifiedOnly ? (
              <CheckSquare className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
            )}
            <span>Verified Businesses Only</span>
          </label>
        </div>
      </div>

      {/* Action button */}
      <button
        type="button"
        onClick={() => {}}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs transition-all shadow-sm hover:shadow-md cursor-pointer"
      >
        Apply Filters
      </button>
    </aside>
  );
}
