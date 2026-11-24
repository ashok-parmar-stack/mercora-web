"use client";

import React, { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { Input, InputProps } from "./Input";

export interface SearchInputProps extends Omit<InputProps, "leftIcon" | "rightIcon"> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, placeholder = "Search...", ...props }, ref) => {
    const showClear = Boolean(value && String(value).length > 0 && onClear);

    return (
      <Input
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        leftIcon={<Search className="w-4 h-4 text-muted-foreground" />}
        rightIcon={
          showClear ? (
            <button
              type="button"
              onClick={onClear}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer pointer-events-auto"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";
