"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Filter,
  LayoutGrid,
  MapPin,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Select } from "@/components/common";
import { BusinessFiltersState } from "../../types/business.types";
import { useBusinessCategories } from "@/features/business-categories/hooks/use-business-categories";
import { fetchCategories } from "@/features/categories/category-api";
import { CategoryItem } from "@/features/categories/types";
import { getLocationStates, State } from "@/lib/geography-api";
import {
  FilterAccordionSection,
  FilterCheckboxOption,
} from "./FilterAccordionSection";

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
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [openSections, setOpenSections] = useState({
    businessCategory: true,
    location: true,
    masterCategory: true,
    verification: true,
  });

  useEffect(() => {
    fetchCategories()
      .then((cats) => setMasterCategories(cats || []))
      .catch((err) => console.error("Failed to load master categories for filter:", err));

    getLocationStates()
      .then((items) => {
        if (Array.isArray(items)) setStates(items);
      })
      .catch((err) => console.error("Failed to load states for filter:", err));
  }, []);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleBusinessType = (type: string) => {
    onFilterChange({ businessType: filters.businessType === type ? "all" : type });
  };

  const rootCategories = businessCategories.filter(
    (c) => !c.parentId && c.isActive !== false
  );
  const displayedCategories = showAllCategories
    ? rootCategories
    : rootCategories.slice(0, 4);

  return (
    <aside className="w-full bg-surface rounded-2xl border border-border p-5 shadow-xs space-y-5">
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

      <FilterAccordionSection
        title="Business Category"
        icon={<Building2 className="w-3.5 h-3.5 text-text-muted group-hover:text-primary" />}
        isOpen={openSections.businessCategory}
        onToggle={() => toggleSection("businessCategory")}
      >
        <div className="space-y-2 pt-1">
          {displayedCategories.map((cat) => (
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
          ))}

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
      </FilterAccordionSection>

      <FilterAccordionSection
        title="Location"
        icon={<MapPin className="w-3.5 h-3.5 text-text-muted group-hover:text-primary" />}
        isOpen={openSections.location}
        onToggle={() => toggleSection("location")}
      >
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
      </FilterAccordionSection>

      <FilterAccordionSection
        title="Master Category"
        icon={<LayoutGrid className="w-3.5 h-3.5 text-text-muted group-hover:text-primary" />}
        isOpen={openSections.masterCategory}
        onToggle={() => toggleSection("masterCategory")}
      >
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
      </FilterAccordionSection>

      <FilterAccordionSection
        title="Verification Status"
        icon={<ShieldCheck className="w-3.5 h-3.5 text-text-muted group-hover:text-primary" />}
        isOpen={openSections.verification}
        onToggle={() => toggleSection("verification")}
        hasBorder={false}
      >
        <div className="space-y-2 pt-1">
          <FilterCheckboxOption
            label="Verified Only"
            checked={filters.verifiedOnly}
            onSelect={() => onFilterChange({ verifiedOnly: true })}
          />
          <FilterCheckboxOption
            label="All Businesses"
            checked={!filters.verifiedOnly}
            onSelect={() => onFilterChange({ verifiedOnly: false })}
          />
        </div>
      </FilterAccordionSection>

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
