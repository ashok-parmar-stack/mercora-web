"use client";

import React, { createContext, useContext, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (id: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
}

/**
 * Linear-Inspired Accordion Component
 * Smooth spring expand/collapse, clean hairlines, and accessible keyboard states without Radix.
 */
export function Accordion({
  type = "single",
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internalValue, setInternalValue] = useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const activeItems = controlledValue !== undefined
    ? Array.isArray(controlledValue)
      ? controlledValue
      : [controlledValue]
    : internalValue;

  const toggleItem = (id: string) => {
    let next: string[];
    if (type === "single") {
      next = activeItems.includes(id) ? [] : [id];
    } else {
      next = activeItems.includes(id) ? activeItems.filter((i) => i !== id) : [...activeItems, id];
    }

    if (controlledValue === undefined) {
      setInternalValue(next);
    }
    onValueChange?.(type === "single" ? next[0] || "" : next);
  };

  return (
    <AccordionContext.Provider value={{ openItems: activeItems, toggleItem, type }}>
      <div className={cn("w-full divide-y divide-border border-y border-border", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

const AccordionItemContext = createContext<{ value: string; isOpen: boolean }>({ value: "", isOpen: false });

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const ctx = useContext(AccordionContext);
  const isOpen = ctx?.openItems.includes(value) ?? false;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={cn("overflow-hidden", className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const ctx = useContext(AccordionContext);
  const itemCtx = useContext(AccordionItemContext);

  return (
    <button
      type="button"
      onClick={() => ctx?.toggleItem(itemCtx.value)}
      aria-expanded={itemCtx.isOpen}
      className={cn(
        "flex w-full items-center justify-between py-4 text-xs font-semibold text-text-primary text-left transition-all hover:text-primary cursor-pointer select-none",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "w-4 h-4 text-text-muted transition-transform duration-200 shrink-0",
          itemCtx.isOpen && "rotate-180 text-primary"
        )}
      />
    </button>
  );
}

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const itemCtx = useContext(AccordionItemContext);
  if (!itemCtx.isOpen) return null;

  return (
    <div
      className={cn("pb-4 text-xs text-text-secondary leading-relaxed animate-in fade-in-0 duration-150", className)}
      {...props}
    >
      {children}
    </div>
  );
}
