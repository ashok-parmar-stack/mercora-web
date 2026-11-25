"use client";

import React from "react";
import {
  Search,
  MapPin,
  Building2,
  Factory,
  Truck,
  Layers,
  Wrench,
  Shield,
  LucideIcon,
} from "lucide-react";
import { APP_HEADERS } from "@/config/headers.config";
import { APP_MESSAGES } from "@/config/messages.config";
import { Button } from "@/components/common";
import { useBusinessCategories } from "@/features/business-categories/hooks/use-business-categories";

export interface BusinessSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onSubmit?: () => void;
  totalFound?: number;
}

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  manufacturer: Factory,
  exporter: Shield,
  distributor: Truck,
  wholesaler: Building2,
  "service provider": Wrench,
  "seller / supplier": Layers,
  supplier: Layers,
};

export function BusinessSearch({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  onSubmit,
}: BusinessSearchProps) {
  const { categories: dynamicCategories } = useBusinessCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-surface via-background-secondary/40 to-surface p-6 sm:p-10 shadow-sm border border-border">
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, #7F1D3F 0%, #2B1220 70%, transparent 100%)" }}
      />
      <div
        className="absolute -bottom-10 left-10 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, #C08497 0%, #7F1D3F 60%, transparent 100%)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
        {/* Trusted Directory Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft text-primary border border-primary/20 text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          <span>{APP_HEADERS.directory.hero.badge || "Trusted Business Directory For Your Growth"}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-text-primary">
          Find <span className="text-primary underline decoration-accent/50 underline-offset-8">Verified Businesses</span>
        </h1>
        <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto font-normal leading-relaxed">
          {APP_HEADERS.directory.hero.subtitle || "Discover trusted manufacturers, suppliers, wholesalers and service providers across India."}
        </p>

        {/* Big Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col sm:flex-row items-center bg-surface rounded-2xl p-2 shadow-md border border-border gap-2 text-text-primary"
        >
          {/* Keyword Input */}
          <div className="flex-1 flex items-center gap-3 px-3 py-1.5 w-full">
            <Search className="w-5 h-5 text-primary flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={APP_MESSAGES.placeholders.searchKeyword || "Search business, product or service..."}
              className="w-full bg-transparent border-none outline-none text-sm sm:text-base placeholder:text-text-muted text-text-primary font-medium"
            />
          </div>

          {/* Location divider & picker */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 border-l border-border text-text-secondary text-sm font-semibold select-none">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Pan-India</span>
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm shadow-sm flex-shrink-0"
            leftIcon={<Search className="w-4 h-4" />}
          >
            Search
          </Button>
        </form>

        {/* Business Type Filter Pills */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
          {/* All Businesses */}
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              !selectedCategory || selectedCategory === "all"
                ? "bg-primary text-white shadow-xs border-primary scale-[1.02]"
                : "bg-surface text-text-secondary hover:text-primary hover:bg-surface-hover border-border shadow-2xs"
            }`}
          >
            <Building2
              className={`w-3.5 h-3.5 ${
                !selectedCategory || selectedCategory === "all"
                  ? "text-white"
                  : "text-text-muted"
              }`}
            />
            <span>All Businesses</span>
          </button>

          {/* Business Type Pills */}
          {dynamicCategories.map((chip) => {
            const Icon = CATEGORY_ICON_MAP[chip.name.toLowerCase()] || CATEGORY_ICON_MAP[chip.slug] || Building2;
            const isSelected =
              selectedCategory?.toLowerCase() === chip.name.toLowerCase() ||
              selectedCategory?.toLowerCase() === chip.slug.toLowerCase();

            return (
              <button
                key={chip.id || chip.slug}
                type="button"
                onClick={() => onCategoryChange(chip.name)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-primary text-white shadow-xs border-primary scale-[1.02]"
                    : "bg-surface text-text-secondary hover:text-primary hover:bg-surface-hover border-border shadow-2xs"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isSelected ? "text-white" : "text-text-muted"
                  }`}
                />
                <span>{chip.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
