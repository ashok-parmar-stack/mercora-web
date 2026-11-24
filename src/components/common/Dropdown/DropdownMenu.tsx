"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
  destructive?: boolean;
  icon?: React.ReactNode;
}

export function DropdownMenuItem({
  className,
  inset,
  destructive,
  icon,
  children,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium outline-none",
        "transition-colors hover:bg-surface-hover text-foreground",
        destructive && "text-destructive hover:bg-destructive/10",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0 text-muted-foreground">{icon}</span>}
      <span className="truncate flex-1 text-left">{children}</span>
    </button>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-border", className)} />;
}

export function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function DropdownMenu({
  trigger,
  children,
  align = "right",
  className,
}: DropdownMenuProps) {
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

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          onClick={() => setIsOpen(false)}
          className={cn(
            "absolute z-50 mt-1 min-w-[8rem] rounded-xl border border-border bg-surface-raised p-1 text-foreground shadow-xl",
            "animate-in fade-in-50 zoom-in-95 duration-100",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
