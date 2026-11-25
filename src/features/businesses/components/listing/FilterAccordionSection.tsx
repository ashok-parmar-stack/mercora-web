"use client";

import React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

export function FilterAccordionSection({
  title,
  icon,
  isOpen,
  onToggle,
  hasBorder = true,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  hasBorder?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-3 pb-4 ${hasBorder ? "border-b border-border" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
        )}
      </button>

      {isOpen && children}
    </div>
  );
}

export function FilterCheckboxOption({
  label,
  checked,
  count,
  onSelect,
}: {
  label: string;
  checked: boolean;
  count?: number;
  onSelect: () => void;
}) {
  return (
    <label
      onClick={onSelect}
      className="flex items-center justify-between py-1 px-1 rounded-lg text-xs font-medium cursor-pointer select-none hover:bg-surface-hover transition-colors"
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
            checked
              ? "bg-[#7F1D3F] border-[#7F1D3F] text-white"
              : "border-border bg-surface"
          }`}
        >
          {checked && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
        <span className={checked ? "font-bold text-[#7F1D3F] dark:text-primary" : "text-text-secondary"}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-[11px] font-semibold text-text-muted">({count})</span>
      )}
    </label>
  );
}
