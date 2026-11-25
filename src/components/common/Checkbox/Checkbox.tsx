"use client";

import React, { forwardRef, useEffect, useRef } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  description?: string;
  size?: "sm" | "md" | "lg";
  indeterminate?: boolean;
}

const SIZE_CLASSES = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      size = "md",
      indeterminate,
      id,
      disabled,
      checked,
      onChange,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);

    const autoId =
      id ||
      (typeof label === "string"
        ? label.toLowerCase().replace(/\s+/g, "-")
        : undefined);

    return (
      <label
        htmlFor={autoId}
        className={cn(
          "inline-flex items-start gap-2.5 select-none transition-opacity",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className
        )}
      >
        <div className="relative flex items-center justify-center h-5">
          <input
            ref={(node) => {
              innerRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) {
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
              }
            }}
            id={autoId}
            type="checkbox"
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "rounded border border-border bg-surface transition-all duration-150 flex items-center justify-center",
              SIZE_CLASSES[size],
              "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1",
              "peer-checked:bg-primary peer-checked:border-primary peer-checked:text-primary-foreground",
              indeterminate && "bg-primary border-primary text-primary-foreground",
              "peer-hover:border-border-hover"
            )}
          >
            {indeterminate ? (
              <Minus className="w-3 h-3 stroke-[3]" />
            ) : checked ? (
              <Check className="w-3 h-3 stroke-[3]" />
            ) : null}
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col text-xs leading-tight pt-0.5">
            {label && <span className="font-medium text-foreground">{label}</span>}
            {description && (
              <span className="text-muted-foreground mt-0.5">{description}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
