"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  delayMs = 120,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const triggerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const gap = 6;

      let top = 0;
      let left = rect.left + rect.width / 2;

      if (side === "top") top = rect.top - gap;
      else if (side === "bottom") top = rect.bottom + gap;
      else if (side === "left") {
        left = rect.left - gap;
        top = rect.top + rect.height / 2;
      } else if (side === "right") {
        left = rect.right + gap;
        top = rect.top + rect.height / 2;
      }

      setCoords({ top, left });
      setIsVisible(true);
    }, delayMs);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-flex"
    >
      {children}

      {mounted &&
        isVisible &&
        coords &&
        createPortal(
          <div
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform:
                side === "top"
                  ? "translate(-50%, -100%)"
                  : side === "bottom"
                  ? "translate(-50%, 0)"
                  : side === "left"
                  ? "translate(-100%, -50%)"
                  : "translate(0, -50%)",
            }}
            role="tooltip"
            className={cn(
              "fixed z-50 px-2.5 py-1 text-[11px] font-medium leading-none text-foreground bg-surface-raised border border-border rounded-md shadow-lg pointer-events-none",
              "animate-in fade-in-0 zoom-in-95 duration-100",
              className
            )}
          >
            {content}
          </div>,
          document.body
        )}
    </div>
  );
}
