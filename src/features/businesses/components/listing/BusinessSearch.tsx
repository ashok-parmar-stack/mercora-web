"use client";

import React from "react";
import { Search, Shield, X } from "lucide-react";

export interface BusinessSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit?: () => void;
  totalFound?: number;
}

export function BusinessSearch({
  query,
  onQueryChange,
  onSubmit,
  totalFound,
}: BusinessSearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <div className="w-full relative z-20 rounded-3xl bg-gradient-to-r from-[#FCECEE] via-[#FDF5F4] to-[#FCECEE] dark:from-[#2B1220] dark:via-[#211722] dark:to-[#2B1220] p-6 sm:p-10 md:p-12 border border-[#EACCCE]/60 dark:border-border shadow-xs">
      {/* Decorative Background Layer */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
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
          Discover trusted exporters, manufacturers, suppliers, and service providers across active regions.
        </p>

        {/* Focused Keyword Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 max-w-2xl mx-auto flex flex-col sm:flex-row items-center bg-surface rounded-2xl sm:rounded-full p-2 shadow-lg border border-border gap-2 text-text-primary"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
            <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search business name, product, category, or city..."
              aria-label="Search businesses"
              className="w-full bg-transparent border-none outline-none text-sm placeholder:text-text-muted text-text-primary font-medium"
            />
            {query.trim().length > 0 && (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                aria-label="Clear search query"
                className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-[#7F1D3F] hover:bg-[#681532] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        {typeof totalFound === "number" && totalFound > 0 && (
          <p className="text-xs font-medium text-text-muted pt-1">
            Use the filters panel to narrow results by category, state, city, or verification status.
          </p>
        )}
      </div>
    </div>
  );
}
