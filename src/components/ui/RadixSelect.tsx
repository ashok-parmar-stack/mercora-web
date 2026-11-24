"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  displayLabel?: string;
  setDisplayLabel: (label: string) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

export interface RadixSelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function RadixSelect({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: RadixSelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [displayLabel, setDisplayLabel] = React.useState<string>("");

  const isControlledValue = controlledValue !== undefined;
  const value = isControlledValue ? controlledValue : internalValue;

  const isControlledOpen = controlledOpen !== undefined;
  const open = isControlledOpen ? controlledOpen : internalOpen;

  const handleValueChange = React.useCallback(
    (newVal: string) => {
      if (!isControlledValue) {
        setInternalValue(newVal);
      }
      onValueChange?.(newVal);
      if (!isControlledOpen) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);
    },
    [isControlledValue, onValueChange, isControlledOpen, onOpenChange]
  );

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlledOpen) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlledOpen, onOpenChange]
  );

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen: handleOpenChange,
        displayLabel,
        setDisplayLabel,
      }}
    >
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export const RadixSelectGroup = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-1", className)} {...props}>
    {children}
  </div>
);
RadixSelectGroup.displayName = "RadixSelectGroup";

export interface RadixSelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export const RadixSelectValue = React.forwardRef<HTMLSpanElement, RadixSelectValueProps>(
  ({ placeholder = "Select...", className, ...props }, ref) => {
    const ctx = React.useContext(SelectContext);
    const displayText = ctx?.displayLabel || ctx?.value || placeholder;

    return (
      <span ref={ref} className={cn("block truncate", !ctx?.value && "text-text-muted", className)} {...props}>
        {displayText}
      </span>
    );
  }
);
RadixSelectValue.displayName = "RadixSelectValue";

export const RadixSelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);

  return (
    <button
      ref={ref}
      type="button"
      role="combobox"
      aria-expanded={ctx?.open}
      onClick={(e) => {
        onClick?.(e);
        ctx?.setOpen(!ctx?.open);
      }}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-xs",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
    </button>
  );
});
RadixSelectTrigger.displayName = "RadixSelectTrigger";

export const RadixSelectScrollUpButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </div>
));
RadixSelectScrollUpButton.displayName = "RadixSelectScrollUpButton";

export const RadixSelectScrollDownButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </div>
));
RadixSelectScrollDownButton.displayName = "RadixSelectScrollDownButton";

export interface RadixSelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "item-aligned" | "popper";
}

export const RadixSelectContent = React.forwardRef<HTMLDivElement, RadixSelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (contentRef.current && !contentRef.current.parentElement?.contains(e.target as Node)) {
          ctx?.setOpen(false);
        }
      };
      if (ctx?.open) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ctx]);

    if (!ctx?.open) return null;

    return (
      <div
        ref={contentRef}
        role="listbox"
        className={cn(
          "absolute top-full left-0 z-50 mt-1 max-h-80 min-w-[8rem] w-full overflow-auto rounded-xl border border-border bg-surface-raised text-text-primary shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-150 p-1.5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
RadixSelectContent.displayName = "RadixSelectContent";

export const RadixSelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-text-muted", className)}
    {...props}
  />
));
RadixSelectLabel.displayName = "RadixSelectLabel";

export interface RadixSelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const RadixSelectItem = React.forwardRef<HTMLDivElement, RadixSelectItemProps>(
  ({ className, children, value, disabled = false, ...props }, ref) => {
    const ctx = React.useContext(SelectContext);
    const isSelected = ctx?.value === value;

    React.useEffect(() => {
      if (isSelected && typeof children === "string") {
        ctx?.setDisplayLabel(children);
      }
    }, [isSelected, children, ctx]);

    const handleSelect = () => {
      if (disabled) return;
      ctx?.onValueChange?.(value);
      if (typeof children === "string") {
        ctx?.setDisplayLabel(children);
      }
    };

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        onClick={handleSelect}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-lg py-1.5 pl-8 pr-2.5 text-xs font-medium outline-none transition-colors",
          isSelected
            ? "bg-primary/10 text-primary font-semibold"
            : "hover:bg-surface-hover text-text-primary",
          disabled && "pointer-events-none opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && <Check className="h-4 w-4 text-primary" />}
        </span>
        <span className="block truncate">{children}</span>
      </div>
    );
  }
);
RadixSelectItem.displayName = "RadixSelectItem";

export const RadixSelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
));
RadixSelectSeparator.displayName = "RadixSelectSeparator";

export default RadixSelect;
