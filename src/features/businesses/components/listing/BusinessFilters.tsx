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

  // Collapsible accordion state
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

  // Only top-level active categories
  const rootCategories = businessCategories.filter(
    (c) => !c.parentId && c.isActive !== false
  );

  const displayedCategories = showAllCategories
    ? rootCategories
    : rootCategories.slice(0, 4);

  return (
    <aside className="w-full bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-5">
      {/* Title & Clear All */}
      <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2 font-black text-gray-900 text-base">
          <Filter className="w-4 h-4 text-[#7F1D3F]" />
          <span>Filters</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#7F1D3F] hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* 1. Business Category */}
      <div className="space-y-3 pb-4 border-b border-gray-100">
        <button
          type="button"
          onClick={() => toggleSection("businessCategory")}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#7F1D3F]" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Business Category
            </span>
          </div>
          {openSections.businessCategory ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {openSections.businessCategory && (
          <div className="space-y-2 pt-1">
            {displayedCategories.map((cat) => {
              const isChecked =
                filters.businessType === cat.name ||
                filters.businessType === cat.slug ||
                filters.businessType.toLowerCase() === cat.name.toLowerCase();

              const count = cat.businessCount || 100;

              return (
                <label
                  key={cat.id || cat.slug}
                  onClick={() => toggleBusinessType(cat.name)}
                  className="flex items-center justify-between py-1 px-1 rounded-lg text-xs font-medium cursor-pointer select-none hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        isChecked
                          ? "bg-[#7F1D3F] border-[#7F1D3F] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={isChecked ? "font-bold text-[#7F1D3F]" : "text-gray-700"}>
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400">
                    ({count})
                  </span>
                </label>
              );
            })}

            {rootCategories.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-xs font-bold text-[#7F1D3F] hover:underline pt-1 pl-1 cursor-pointer block"
              >
                {showAllCategories ? "− Show Less" : "+ Show More"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Location */}
      <div className="space-y-3 pb-4 border-b border-gray-100">
        <button
          type="button"
          onClick={() => toggleSection("location")}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#7F1D3F]" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Location
            </span>
          </div>
          {openSections.location ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {openSections.location && (
          <div className="pt-1">
            <select
              value={filters.location}
              onChange={(e) => onFilterChange({ location: e.target.value })}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7F1D3F]/20 cursor-pointer"
            >
              <option value="all">Select Location</option>
              {states.map((st) => (
                <option key={st.id || st.code} value={st.name}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 3. Master Category */}
      <div className="space-y-3 pb-4 border-b border-gray-100">
        <button
          type="button"
          onClick={() => toggleSection("masterCategory")}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#7F1D3F]" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Master Category
            </span>
          </div>
          {openSections.masterCategory ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {openSections.masterCategory && (
          <div className="pt-1">
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7F1D3F]/20 cursor-pointer"
            >
              <option value="all">Select Category</option>
              {masterCategories.map((mc) => (
                <option key={mc.id || mc.slug} value={mc.name}>
                  {mc.name}
                </option>
              ))}
            </select>
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
            <ShieldCheck className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#7F1D3F]" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Verification Status
            </span>
          </div>
          {openSections.verification ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {openSections.verification && (
          <div className="space-y-2 pt-1">
            <label
              onClick={() => onFilterChange({ verifiedOnly: !filters.verifiedOnly })}
              className="flex items-center justify-between py-1 px-1 rounded-lg text-xs font-medium cursor-pointer select-none hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                    filters.verifiedOnly
                      ? "bg-[#7F1D3F] border-[#7F1D3F] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {filters.verifiedOnly && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={filters.verifiedOnly ? "font-bold text-[#7F1D3F]" : "text-gray-700"}>
                  Verified Businesses
                </span>
              </div>
              <span className="text-[11px] font-semibold text-gray-400">(420)</span>
            </label>

            <label
              onClick={() => onFilterChange({ verifiedOnly: false })}
              className="flex items-center justify-between py-1 px-1 rounded-lg text-xs font-medium cursor-pointer select-none hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                    filters.verifiedOnly === false
                      ? "bg-[#7F1D3F] border-[#7F1D3F] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {!filters.verifiedOnly && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={!filters.verifiedOnly ? "font-bold text-[#7F1D3F]" : "text-gray-700"}>
                  Unverified
                </span>
              </div>
              <span className="text-[11px] font-semibold text-gray-400">(95)</span>
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
