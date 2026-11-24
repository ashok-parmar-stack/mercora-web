"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

export function Popover({
  trigger,
  children,
  align = "center",
  className,
}: PopoverProps) {
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
    <div className="relative inline-block" ref={containerRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 w-72 rounded-xl border border-border bg-surface-raised p-4 text-foreground shadow-xl outline-none",
            "animate-in fade-in-50 zoom-in-95 duration-100",
            align === "end" ? "right-0" : align === "start" ? "left-0" : "left-1/2 -translate-x-1/2",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
