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
} from "lucide-react";
import { APP_HEADERS } from "@/config/headers.config";
import { APP_MESSAGES } from "@/config/messages.config";
import { Button } from "@/components/ui/Button";

export interface BusinessSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onSubmit?: () => void;
  totalFound?: number;
}

const BUSINESS_TYPE_PILLS = [
  { name: "Distributor", icon: Truck },
  { name: "Exporter", icon: Shield },
  { name: "Manufacturer", icon: Factory },
  { name: "Seller / Supplier", icon: Layers },
  { name: "Service Provider", icon: Wrench },
  { name: "Wholesaler", icon: Building2 },
];

export function BusinessSearch({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  onSubmit,
}: BusinessSearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-red-50/30 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 p-6 sm:p-10 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200/90 dark:border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-red-500/10 dark:bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
        {/* Trusted Directory Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200/80 dark:border-red-900/40 text-xs font-semibold text-red-700 dark:text-red-300 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{APP_HEADERS.directory.hero.badge || "Trusted Business Directory For Your Growth"}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Find <span className="text-red-600 dark:text-red-500 underline decoration-red-400/50 underline-offset-8">Verified Businesses</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          {APP_HEADERS.directory.hero.subtitle || "Discover trusted manufacturers, suppliers, wholesalers and service providers across India."}
        </p>

        {/* Big Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col sm:flex-row items-center bg-white dark:bg-slate-950 rounded-2xl p-2 shadow-xl shadow-slate-200/60 dark:shadow-slate-950/80 border border-slate-200 dark:border-slate-800 gap-2 text-slate-800 dark:text-white"
        >
          {/* Keyword Input */}
          <div className="flex-1 flex items-center gap-3 px-3 py-1.5 w-full">
            <Search className="w-5 h-5 text-red-500 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={APP_MESSAGES.placeholders.searchKeyword || "Search business, product or service..."}
              className="w-full bg-transparent border-none outline-none text-sm sm:text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white font-medium"
            />
          </div>

          {/* Location divider & picker */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 border-l border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold">
            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>Gujarat, India</span>
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm shadow-md flex-shrink-0"
            leftIcon={<Search className="w-4 h-4" />}
          >
            Search
          </Button>
        </form>

        {/* Business Type Filter Pills (exact match with UI design) */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
          {/* All Businesses */}
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              !selectedCategory || selectedCategory === "all"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30 border-red-600 scale-[1.02]"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/60 dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-800 shadow-2xs"
            }`}
          >
            <Building2
              className={`w-3.5 h-3.5 ${
                !selectedCategory || selectedCategory === "all"
                  ? "text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            />
            <span>All Businesses</span>
          </button>

          {/* Business Type Pills */}
          {BUSINESS_TYPE_PILLS.map((chip) => {
            const Icon = chip.icon;
            const isSelected =
              selectedCategory?.toLowerCase() === chip.name.toLowerCase() ||
              selectedCategory?.toLowerCase().replace(/\s+/g, "") ===
                chip.name.toLowerCase().replace(/\s+/g, "");

            return (
              <button
                key={chip.name}
                type="button"
                onClick={() => onCategoryChange(chip.name)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30 border-red-600 scale-[1.02]"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/60 dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-800 shadow-2xs"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isSelected ? "text-white" : "text-slate-500 dark:text-slate-400"
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
