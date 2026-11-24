"use client";

import React, { forwardRef, useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
  selectSize?: "sm" | "md" | "lg";
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      children,
      error,
      helperText,
      placeholder = "Select an option...",
      selectSize = "md",
      className = "",
      id,
      value,
      defaultValue,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const autoId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const extractedOptions: SelectOption[] = useMemo(() => {
      if (options && options.length > 0) return options;
      const list: SelectOption[] = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === "option") {
          const childProps = child.props as any;
          list.push({
            value: String(childProps.value ?? ""),
            label: String(childProps.children ?? childProps.value ?? ""),
            disabled: Boolean(childProps.disabled),
          });
        }
      });
      return list;
    }, [options, children]);

    const [isOpen, setIsOpen] = useState(false);
    const [focusedIdx, setFocusedIdx] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    const [currentVal, setCurrentVal] = useState<string>(
      String(value ?? defaultValue ?? "")
    );

    useEffect(() => {
      if (value !== undefined) {
        setCurrentVal(String(value));
      }
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = extractedOptions.find((o) => o.value === currentVal);

    const handleSelect = (opt: SelectOption) => {
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

    const sizeStyles = {
      sm: "h-8 text-xs px-2.5",
      md: "h-9 text-sm px-3",
      lg: "h-10 text-sm px-3.5",
    };

    return (
      <div className="w-full flex flex-col gap-1.5" ref={containerRef}>
        {label && (
          <label
            htmlFor={autoId}
            className="text-[13px] font-medium text-foreground leading-tight select-none"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <button
            type="button"
            id={autoId}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className={cn(
              "w-full rounded-lg border border-border bg-surface text-foreground font-normal",
              "transition-colors duration-150 outline-none flex items-center justify-between gap-2 text-left cursor-pointer",
              "focus:border-border-focus focus:ring-1 focus:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-hover",
              sizeStyles[selectSize],
              error && "border-destructive focus:border-destructive focus:ring-destructive",
              className
            )}
          >
            <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-150",
                isOpen && "rotate-180 text-foreground"
              )}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-full min-w-[140px] max-h-60 overflow-y-auto rounded-lg border border-border bg-surface-raised p-1 shadow-lg z-50 animate-in fade-in-50 zoom-in-95 duration-100">
              {extractedOptions.map((opt, idx) => {
                const isSelected = opt.value === currentVal;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors text-left cursor-pointer",
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : opt.disabled
                        ? "text-muted-foreground opacity-50 cursor-not-allowed"
                        : "text-foreground hover:bg-surface-hover"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Hidden native select for form submitters & accessibility */}
          <select
            ref={ref}
            id={autoId}
            value={currentVal}
            onChange={(e) => {
              setCurrentVal(e.target.value);
              onChange?.(e);
            }}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {extractedOptions.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
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
);

Select.displayName = "Select";
