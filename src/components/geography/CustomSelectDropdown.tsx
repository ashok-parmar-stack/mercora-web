"use client";

import React from "react";
import { Check, Search, X, Zap } from "lucide-react";
import type { CustomSelectOption } from "./CustomLocationSelect";

interface CustomSelectDropdownProps {
  label: string;
  value?: string;
  search: string;
  focusedIndex: number;
  filteredOptions: CustomSelectOption[];
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  onSearchChange: (val: string) => void;
  onSelect: (option: CustomSelectOption) => void;
  onFocusIndexChange: (index: number) => void;
  onSyncInline?: () => void;
  syncButtonLabel?: string;
}

export function CustomSelectDropdown({
  label,
  value,
  search,
  focusedIndex,
  filteredOptions,
  searchInputRef,
  listRef,
  onSearchChange,
  onSelect,
  onFocusIndexChange,
  onSyncInline,
  syncButtonLabel,
}: CustomSelectDropdownProps) {
  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-72">
      <div className="p-2 border-b border-gray-100 bg-gray-50/70">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              onFocusIndexChange(-1);
            }}
            placeholder={`Search ${label.toLowerCase()}...`}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div ref={listRef} className="overflow-y-auto divide-y divide-gray-50 p-1 flex-1">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt, index) => {
            const isSelected = opt.id === value;
            const isFocused = index === focusedIndex;
            return (
              <button
                key={opt.id}
                data-option-item
                type="button"
                onClick={() => onSelect(opt)}
                onMouseEnter={() => onFocusIndexChange(index)}
                className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs ${
                  isSelected
                    ? "bg-brand-50 text-brand-900 font-bold"
                    : isFocused
                    ? "bg-gray-100 text-gray-900"
                    : "hover:bg-gray-50 text-gray-700 font-medium"
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{opt.label}</span>
                  {opt.subLabel && (
                    <span className="text-[10px] text-gray-400 font-normal truncate">
                      {opt.subLabel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {opt.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                        opt.badgeColor || "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />}
                </div>
              </button>
            );
          })
        ) : (
          <div className="p-4 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
            <span>No results found for &ldquo;{search || label}&rdquo;</span>
            {onSyncInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSyncInline();
                }}
                className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 border border-brand-200 cursor-pointer"
              >
                <Zap className="w-3 h-3" />
                {syncButtonLabel || "Sync from LGD"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
