"use client";

import React from "react";
import { Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectMenuProps {
  options: SelectOption[];
  currentVal: string;
  focusedIdx: number;
  selectId?: string;
  openDirection: "top" | "bottom";
  onSelect: (opt: SelectOption) => void;
}

export function SelectMenu({
  options,
  currentVal,
  focusedIdx,
  selectId,
  openDirection,
  onSelect,
}: SelectMenuProps) {
  const enabledOpts = options.filter((o) => !o.disabled);

  return (
    <div
      className={`absolute z-50 w-full min-w-[130px] bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl max-h-60 overflow-y-auto p-1.5 animate-in fade-in-50 zoom-in-95 duration-100 ring-1 ring-black/5 dark:ring-white/10 ${
        openDirection === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
      }`}
    >
      {options.map((opt) => {
        const enabledIdx = enabledOpts.indexOf(opt);
        const isSelected = opt.value === currentVal;
        const isFocused = enabledIdx === focusedIdx;
        return (
          <button
            key={opt.value}
            id={selectId ? `${selectId}-opt-${enabledIdx}` : undefined}
            type="button"
            role="option"
            aria-selected={isSelected}
            disabled={opt.disabled}
            onClick={() => onSelect(opt)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${
              isSelected
                ? "bg-[var(--accent-soft,rgba(59,130,246,0.12))] text-[var(--accent-text,#3b82f6)] dark:bg-white/10 dark:text-white font-bold"
                : opt.disabled
                ? "text-[var(--text-muted)] opacity-50 cursor-not-allowed"
                : isFocused
                ? "bg-[var(--surface-hover)] text-[var(--text-primary)] ring-1 ring-[var(--border-focus)]/40"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
            }`}
          >
            <span className="truncate">{opt.label}</span>
            {isSelected && <Check className="w-3.5 h-3.5 text-[var(--border-focus)] flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}
