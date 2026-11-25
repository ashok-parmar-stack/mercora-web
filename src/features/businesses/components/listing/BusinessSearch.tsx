"use client";

import React, { useState } from "react";
import {
  Search,
  MapPin,
  Shield,
  Building2,
  Factory,
  Truck,
  Layers,
  Wrench,
  Globe,
  Ship,
  Plane,
  Briefcase,
  ChevronDown,
  LucideIcon,
} from "lucide-react";
import { Select } from "@/components/common";
import { useBusinessCategories } from "@/features/business-categories/hooks/use-business-categories";

export interface BusinessSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  location?: string;
  onLocationChange?: (loc: string) => void;
  onSubmit?: () => void;
  totalFound?: number;
}

const CATEGORY_ICON_LOOKUP: Record<string, LucideIcon> = {
  export: Globe,
  importer: Ship,
  logistics: Truck,
  "freight-forwarder": Plane,
  manufacture: Factory,
  wholesaler: Building2,
  "trading-company": Briefcase,
  "service-provider": Wrench,
  distributor: Truck,
  manufacturer: Factory,
  exporter: Globe,
};

export function BusinessSearch({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  location = "all",
  onLocationChange,
  onSubmit,
}: BusinessSearchProps) {
  const { categories: dynamicCategories } = useBusinessCategories();
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  const rootCategories = dynamicCategories.filter(
    (c) => !c.parentId && c.isActive !== false
  );

  const displayChips = rootCategories.slice(0, 6);
  const remainingChips = rootCategories.slice(6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <div className="w-full relative rounded-3xl bg-gradient-to-r from-[#FCECEE] via-[#FDF5F4] to-[#FCECEE] dark:from-[#2B1220] dark:via-[#211722] dark:to-[#2B1220] p-6 sm:p-10 md:p-12 border border-[#EACCCE]/60 dark:border-border shadow-xs">
      {/* Decorative Background Layer (clipped to card radius so dropdowns never clip) */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {/* Visual Cargo Ship Graphic on Left */}
        <div className="absolute left-0 bottom-0 top-0 w-1/4 max-w-[280px] opacity-30 sm:opacity-50 lg:opacity-75 overflow-hidden">
        <svg
          viewBox="0 0 300 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover object-left"
        >
          <path d="M40 180 L80 40 L90 40 L50 180 Z" fill="#7F1D3F" opacity="0.4" />
          <path d="M60 80 L180 80 L170 90 L70 90 Z" fill="#7F1D3F" opacity="0.3" />
          <line x1="85" y1="40" x2="160" y2="80" stroke="#7F1D3F" strokeWidth="2" opacity="0.5" />
          <path d="M10 160 L240 160 L220 195 L30 195 Z" fill="#7F1D3F" opacity="0.85" />
          <path d="M25 155 L235 155 L232 162 L18 162 Z" fill="#DC2626" opacity="0.7" />
          <rect x="50" y="115" width="35" height="18" rx="2" fill="#2563EB" opacity="0.75" />
          <rect x="88" y="115" width="35" height="18" rx="2" fill="#D97706" opacity="0.8" />
          <rect x="126" y="115" width="35" height="18" rx="2" fill="#DC2626" opacity="0.8" />
          <rect x="164" y="115" width="35" height="18" rx="2" fill="#059669" opacity="0.8" />
          <rect x="68" y="94" width="35" height="18" rx="2" fill="#0284C7" opacity="0.8" />
          <rect x="106" y="94" width="35" height="18" rx="2" fill="#DC2626" opacity="0.8" />
          <rect x="144" y="94" width="35" height="18" rx="2" fill="#D97706" opacity="0.8" />
          <rect x="88" y="73" width="35" height="18" rx="2" fill="#2563EB" opacity="0.8" />
          <rect x="126" y="73" width="35" height="18" rx="2" fill="#059669" opacity="0.8" />
          <path d="M0 190 Q50 185 100 190 T200 190 T300 190 L300 200 L0 200 Z" fill="#7F1D3F" opacity="0.2" />
        </svg>
      </div>

      {/* Stylized World Map with Route Connections on Right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 max-w-[340px] pointer-events-none opacity-40 sm:opacity-60 lg:opacity-80">
        <svg
          viewBox="0 0 320 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain object-right"
        >
          <circle cx="80" cy="70" r="14" fill="#C08497" opacity="0.35" />
          <circle cx="160" cy="90" r="18" fill="#C08497" opacity="0.3" />
          <circle cx="230" cy="65" r="15" fill="#C08497" opacity="0.35" />
          <circle cx="250" cy="130" r="12" fill="#C08497" opacity="0.3" />
          <path d="M80 70 Q120 40 160 90" stroke="#7F1D3F" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
          <path d="M160 90 Q200 50 230 65" stroke="#7F1D3F" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
          <path d="M160 90 Q210 120 250 130" stroke="#7F1D3F" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
          <circle cx="80" cy="70" r="4" fill="#7F1D3F" />
          <circle cx="80" cy="70" r="7" stroke="#7F1D3F" strokeWidth="1.5" opacity="0.5" />
          <circle cx="160" cy="90" r="4" fill="#7F1D3F" />
          <circle cx="160" cy="90" r="7" stroke="#7F1D3F" strokeWidth="1.5" opacity="0.5" />
          <circle cx="230" cy="65" r="4" fill="#7F1D3F" />
          <circle cx="230" cy="65" r="7" stroke="#7F1D3F" strokeWidth="1.5" opacity="0.5" />
          <circle cx="250" cy="130" r="4" fill="#7F1D3F" />
          <circle cx="250" cy="130" r="7" stroke="#7F1D3F" strokeWidth="1.5" opacity="0.5" />
        </svg>
      </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-3.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface/90 backdrop-blur-xs text-text-primary border border-border text-xs font-semibold shadow-2xs">
          <Shield className="w-3.5 h-3.5 text-blue-600 fill-blue-50 dark:fill-blue-950" />
          <span>Trusted Global B2B Marketplace</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-text-primary leading-tight">
          Find <span className="text-[#7F1D3F] dark:text-primary underline decoration-[#7F1D3F]/40 underline-offset-4">Verified Businesses</span>
        </h1>
        <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto font-normal leading-relaxed">
          Discover trusted exporters, suppliers, and service providers across the globe.
        </p>

        {/* Floating Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col sm:flex-row items-center bg-surface rounded-2xl sm:rounded-full p-2 shadow-lg border border-border gap-2 text-text-primary"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
            <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search business, product or service..."
              className="w-full bg-transparent border-none outline-none text-sm placeholder:text-text-muted text-text-primary font-medium"
            />
          </div>

          <div className="w-full sm:w-44 flex items-center gap-1.5 px-3 py-1 border-t sm:border-t-0 sm:border-l border-border text-text-secondary text-xs sm:text-sm font-medium">
            <MapPin className="w-4 h-4 text-text-muted flex-shrink-0" />
            <Select
              value={location}
              selectSize="sm"
              onChange={(e) => onLocationChange?.(e.target.value)}
              aria-label="Select Location"
              className="border-0 shadow-none bg-transparent hover:border-transparent focus:ring-0 px-1 h-8 font-medium"
              options={[
                { value: "all", label: "All Locations" },
                { value: "Gujarat", label: "Gujarat" },
                { value: "Maharashtra", label: "Maharashtra" },
                { value: "Delhi", label: "Delhi" },
                { value: "Karnataka", label: "Karnataka" },
                { value: "Tamil Nadu", label: "Tamil Nadu" },
                { value: "International", label: "International" },
              ]}
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-[#7F1D3F] hover:bg-[#681532] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        {/* Business Category Pills (Horizontal scrollable on mobile) */}
        <div className="pt-3 flex items-center sm:justify-center gap-2 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-2xs shrink-0 ${
              !selectedCategory || selectedCategory === "all"
                ? "bg-[#7F1D3F] text-white border-[#7F1D3F] shadow-xs"
                : "bg-surface text-text-secondary hover:text-primary hover:bg-surface-hover border-border"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </button>

          {displayChips.map((chip) => {
            const Icon =
              CATEGORY_ICON_LOOKUP[chip.slug] ||
              CATEGORY_ICON_LOOKUP[chip.name.toLowerCase()] ||
              Building2;

            const isSelected =
              selectedCategory?.toLowerCase() === chip.name.toLowerCase() ||
              selectedCategory?.toLowerCase() === chip.slug.toLowerCase();

            return (
              <button
                key={chip.id || chip.slug}
                type="button"
                onClick={() => onCategoryChange(chip.name)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border shadow-2xs shrink-0 ${
                  isSelected
                    ? "bg-[#7F1D3F] text-white border-[#7F1D3F] shadow-xs"
                    : "bg-surface text-text-secondary hover:text-primary hover:bg-surface-hover border-border"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-text-muted"}`} />
                <span>{chip.name.split("/")[0].trim()}</span>
              </button>
            );
          })}

          {remainingChips.length > 0 && (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowMoreCategories(!showMoreCategories)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface text-text-secondary hover:text-primary border border-border shadow-2xs cursor-pointer"
              >
                <span>More</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showMoreCategories ? "rotate-180" : ""}`} />
              </button>

              {showMoreCategories && (
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-lg border border-border p-2 z-50 flex flex-col gap-1 text-left">
                  {remainingChips.map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => {
                        onCategoryChange(chip.name);
                        setShowMoreCategories(false);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:bg-primary-soft hover:text-primary text-left transition-colors"
                    >
                      {chip.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
