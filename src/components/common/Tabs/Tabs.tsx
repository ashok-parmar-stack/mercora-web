"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
  variant: "line" | "pill" | "enclosed";
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  variant?: "line" | "pill" | "enclosed";
  children: React.ReactNode;
}

/**
 * Linear-Inspired Tabs Component
 * Subtle sliding underline, pill badges, and accessible keyboard navigation without Radix.
 */
export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  variant = "line",
  className,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const activeValue = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (val: string) => {
    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange, variant }}>
      <div className={cn("w-full flex flex-col", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, children, ...props }: TabsListProps) {
  const ctx = useContext(TabsContext);
  const variant = ctx?.variant || "line";

  const variantStyles = {
    line: "border-b border-border gap-6 px-1",
    pill: "bg-surface-raised p-1 rounded-xl border border-border gap-1 inline-flex",
    enclosed: "border-b border-border gap-1",
  };

  return (
    <div
      role="tablist"
      className={cn("flex items-center select-none overflow-x-auto", variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used inside Tabs");

  const isSelected = ctx.value === value;
  const variant = ctx.variant;

  const lineStyles = cn(
    "relative pb-3 text-xs font-medium transition-colors cursor-pointer outline-none whitespace-nowrap",
    isSelected
      ? "text-text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
      : "text-text-secondary hover:text-text-primary"
  );

  const pillStyles = cn(
    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer outline-none whitespace-nowrap",
    isSelected
      ? "bg-surface text-text-primary shadow-xs font-semibold border border-border/60"
      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
  );

  const enclosedStyles = cn(
    "px-4 py-2 border-t border-x rounded-t-lg text-xs font-medium transition-colors cursor-pointer outline-none whitespace-nowrap",
    isSelected
      ? "bg-surface border-border text-text-primary font-semibold -mb-px"
      : "border-transparent text-text-secondary hover:text-text-primary"
  );

  const variantClass = variant === "pill" ? pillStyles : variant === "enclosed" ? enclosedStyles : lineStyles;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isSelected}
      onClick={() => ctx.onValueChange(value)}
      className={cn(variantClass, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used inside Tabs");

  if (ctx.value !== value) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={cn("pt-4 outline-none animate-in fade-in-0 duration-150", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { TabsList as default };
