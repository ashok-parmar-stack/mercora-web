"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectOption } from "./Select";

export interface MultiSelectProps {
  label?: string;
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  label,
  options,
  value = [],
  onChange,
  placeholder = "Select multiple...",
  error,
  helperText,
  disabled,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleOption = (val: string) => {
    if (disabled) return;
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const handleRemove = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(value.filter((v) => v !== val));
  };

  const selectedLabels = options
    .filter((o) => value.includes(o.value))
    .map((o) => o.label);

  return (
    <div className="w-full flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <span className="text-[13px] font-medium text-foreground leading-tight select-none">
          {label}
        </span>
      )}

      <div className="relative">
        <div
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={cn(
            "min-h-[40px] w-full rounded-lg border border-border bg-surface px-2.5 py-1 text-sm text-foreground",
            "transition-colors duration-150 outline-none flex items-center justify-between gap-2 cursor-pointer flex-wrap",
            "hover:border-border-hover focus-within:border-border-focus focus-within:ring-1 focus-within:ring-ring",
            disabled && "cursor-not-allowed opacity-50 bg-surface-hover",
            error && "border-destructive",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 items-center flex-1">
            {value.length === 0 && (
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            )}
            {value.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium border border-border"
                >
                  <span>{opt ? opt.label : val}</span>
                  <X
                    className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={(e) => handleRemove(e, val)}
                  />
                </span>
              );
            })}
          </div>

          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-150",
              isOpen && "rotate-180"
            )}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-border bg-surface-raised p-1 shadow-lg z-50 animate-in fade-in-50 zoom-in-95 duration-100">
            {options.map((opt) => {
              const isSelected = value.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => handleToggleOption(opt.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors text-left cursor-pointer",
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : opt.disabled
                      ? "text-muted-foreground opacity-50 cursor-not-allowed"
                      : "text-foreground hover:bg-surface-hover"
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-destructive font-medium leading-none">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="text-xs text-muted-foreground leading-none">
          {helperText}
        </span>
      )}
    </div>
  );
}

