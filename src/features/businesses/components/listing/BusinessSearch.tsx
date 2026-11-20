"use client";

import React from "react";
import { Search, MapPin, Building2, Factory, Truck, Layers, Wrench, Shield } from "lucide-react";
import { APP_HEADERS } from "@/config/headers.config";
import { APP_MESSAGES } from "@/config/messages.config";

export interface BusinessSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onSubmit?: () => void;
  totalFound?: number;
}

const CATEGORY_CHIPS = [
  { id: "all", label: "All Businesses", icon: Building2 },
  { id: "Manufacturer", label: "Manufacturers", icon: Factory },
  { id: "Supplier", label: "Suppliers", icon: Layers },
  { id: "Wholesaler", label: "Wholesalers", icon: Building2 },
  { id: "Distributor", label: "Distributors", icon: Truck },
  { id: "Exporter", label: "Exporters", icon: Shield },
  { id: "Service Provider", label: "Service Providers", icon: Wrench },
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
    <div className="w-full relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-red-950 text-white p-6 sm:p-10 shadow-xl border border-slate-700/60">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
        {/* Trusted Directory Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-red-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{APP_HEADERS.directory.hero.badge}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
          Find <span className="text-red-500 underline decoration-red-500/40">Verified Businesses</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          {APP_HEADERS.directory.hero.subtitle}
        </p>

        {/* Big Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col sm:flex-row items-center bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-2xl border border-slate-200/50 dark:border-slate-700 gap-2 text-slate-800 dark:text-white"
        >
          {/* Keyword Input */}
          <div className="flex-1 flex items-center gap-3 px-3 py-1.5 w-full">
            <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={APP_MESSAGES.placeholders.searchKeyword}
              className="w-full bg-transparent border-none outline-hidden text-sm sm:text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Location divider & picker */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 border-l border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium">
            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>Gujarat, India</span>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        {/* Quick Category Chips */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          {CATEGORY_CHIPS.map((chip) => {
            const Icon = chip.icon;
            const isSelected = selectedCategory === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onCategoryChange(chip.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all backdrop-blur-md cursor-pointer ${
                  isSelected
                    ? "bg-red-600 text-white shadow-md shadow-red-600/25 border border-red-500"
                    : "bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5 opacity-80" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
