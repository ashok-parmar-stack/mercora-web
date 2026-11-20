"use client";

import React, { forwardRef, useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { SelectOption, SelectMenu } from "./SelectMenu";

export type { SelectOption };

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
  dropdownPosition?: "top" | "bottom" | "auto";
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      children,
      error,
      helperText,
      className = "",
      id,
      value,
      defaultValue,
      onChange,
      disabled,
      dropdownPosition = "auto",
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const extractedOptions: SelectOption[] = useMemo(() => {
      if (options && options.length > 0) return options;
      const list: SelectOption[] = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === "option") {
          const childProps = child.props as Record<string, any>;
          let labelText = "";
          if (Array.isArray(childProps.children)) {
            labelText = childProps.children
              .map((c: any) => (typeof c === "string" || typeof c === "number" ? c : ""))
              .join("");
          } else {
            labelText = String(childProps.children ?? "");
          }
          list.push({
            value: String(childProps.value ?? ""),
            label: labelText,
            disabled: Boolean(childProps.disabled),
          });
        }
      });
      return list;
    }, [options, children]);

    const [isOpen, setIsOpen] = useState(false);
    const [openDirection, setOpenDirection] = useState<"top" | "bottom">("bottom");
    const [focusedIdx, setFocusedIdx] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    const [currentVal, setCurrentVal] = useState<string>(
      String(value ?? defaultValue ?? extractedOptions[0]?.value ?? "")
    );

    useEffect(() => {
      setCurrentVal(String(value ?? ""));
    }, [value]);

    useEffect(() => {
      if (isOpen && containerRef.current) {
        if (dropdownPosition === "top") {
          setOpenDirection("top");
        } else if (dropdownPosition === "bottom") {
          setOpenDirection("bottom");
        } else {
          const rect = containerRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          setOpenDirection(spaceBelow < 220 && spaceAbove > 180 ? "top" : "bottom");
        }
      }
    }, [isOpen, dropdownPosition]);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = extractedOptions.find((o) => o.value === currentVal) || extractedOptions[0];

    const handleSelectOption = (opt: SelectOption) => {
      if (opt.disabled || disabled) return;
      setCurrentVal(opt.value);
      setIsOpen(false);

      if (onChange) {
        const syntheticEvent = {
          target: { value: opt.value, name: props.name },
          currentTarget: { value: opt.value, name: props.name },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const opts = extractedOptions.filter((o) => !o.disabled);
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIdx(0);
          } else {
            setFocusedIdx((prev) => Math.min(prev + 1, opts.length - 1));
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isOpen) setFocusedIdx((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIdx(0);
          } else if (focusedIdx >= 0 && opts[focusedIdx]) {
            handleSelectOption(opts[focusedIdx]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setFocusedIdx(-1);
          break;
      }
    };

    return (
      <div className="w-full flex flex-col gap-1.5" ref={containerRef}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <button
            type="button"
            id={selectId}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`w-full h-[42px] bg-[var(--input-background)] border ${
              error
                ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-red-500/20"
                : isOpen
                ? "border-[var(--border-focus)] ring-2 ring-[var(--border-focus)]/20 shadow-2xs"
                : "border-[var(--input-border)] hover:border-[var(--border-hover)]"
            } rounded-lg text-sm text-[var(--text-primary)] px-3.5 py-2.5 outline-none transition-all duration-150 flex items-center justify-between gap-2 text-left disabled:bg-[var(--surface-hover)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed ${className}`}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className={`truncate font-medium ${!selectedOption ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
              {selectedOption?.label || "Select option..."}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0 ${
                isOpen ? "rotate-180 text-[var(--border-focus)]" : ""
              }`}
            />
          </button>

          {isOpen && (
            <SelectMenu
              options={extractedOptions}
              currentVal={currentVal}
              focusedIdx={focusedIdx}
              selectId={selectId}
              openDirection={openDirection}
              onSelect={handleSelectOption}
            />
          )}

          <select
            {...props}
            ref={ref}
            id={selectId}
            value={currentVal}
            onChange={(e) => {
              setCurrentVal(e.target.value);
              onChange?.(e);
            }}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
          >
            {extractedOptions.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {error && <span className="text-xs text-[var(--error)] font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-[var(--text-muted)]">{helperText}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
