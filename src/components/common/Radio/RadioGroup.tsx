"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
  className?: string;
  disabled?: boolean;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      options,
      value,
      defaultValue,
      onChange,
      orientation = "vertical",
      className,
      disabled: groupDisabled,
    },
    ref
  ) => {
    const [selected, setSelected] = React.useState(value ?? defaultValue ?? "");

    React.useEffect(() => {
      if (value !== undefined) setSelected(value);
    }, [value]);

    const handleChange = (val: string) => {
      setSelected(val);
      onChange?.(val);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(
          "flex gap-3",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
          className
        )}
      >
        {options.map((opt) => {
          const isChecked = selected === opt.value;
          const isDisabled = groupDisabled || opt.disabled;

          return (
            <label
              key={opt.value}
              className={cn(
                "inline-flex items-start gap-2.5 select-none transition-opacity",
                isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              )}
            >
              <div className="relative flex items-center justify-center h-5">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => handleChange(opt.value)}
                  className="peer sr-only"
                />
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border border-border bg-surface transition-all duration-150 flex items-center justify-center",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1",
                    isChecked && "border-primary bg-primary"
                  )}
                >
                  {isChecked && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>

              <div className="flex flex-col text-xs leading-tight pt-0.5">
                <span className="font-medium text-foreground">{opt.label}</span>
                {opt.description && (
                  <span className="text-muted-foreground mt-0.5">{opt.description}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";
