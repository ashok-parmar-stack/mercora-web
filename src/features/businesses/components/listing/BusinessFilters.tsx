"use client";

import React from "react";
import { Filter, RotateCcw, CheckSquare, Square } from "lucide-react";
import { BusinessFiltersState } from "../../types/business.types";
import { BUSINESS_TYPES } from "@/lib/constants";
import { APP_HEADERS } from "@/config/headers.config";

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
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Business Type Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Business Type
        </label>
        <div className="space-y-1.5">
          {BUSINESS_TYPES.map((type) => {
            const isChecked = filters.businessType === type;
            return (
              <label
                key={type}
                onClick={() => toggleBusinessType(type)}
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
                <span>{type}</span>
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
          <select
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
          >
            <option value="all">Select State (Gujarat)</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Rajasthan">Rajasthan</option>
          </select>
          <select
            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
          >
            <option value="all">Select City</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Surat">Surat</option>
            <option value="Vadodara">Vadodara</option>
            <option value="Rajkot">Rajkot</option>
            <option value="Morbi">Morbi</option>
          </select>
        </div>
      </div>

      {/* Industry / Category */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Industry / Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
        >
          <option value="all">All Industries</option>
          <option value="Industrial Machinery">Industrial Machinery</option>
          <option value="Textiles & Fabrics">Textiles & Fabrics</option>
          <option value="Pharmaceuticals">Pharmaceuticals</option>
          <option value="Ceramic & Tiles">Ceramic & Tiles</option>
          <option value="Chemicals">Chemicals</option>
        </select>
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
