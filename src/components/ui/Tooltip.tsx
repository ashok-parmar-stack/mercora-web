"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delayMs = 80,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    side: "top" | "bottom" | "left" | "right";
    arrowLeft?: number;
    arrowTop?: number;
  } | null>(null);

  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const targetRect = triggerRef.current.getBoundingClientRect();
    const tooltipEl = tooltipRef.current;

    const tooltipWidth = tooltipEl ? tooltipEl.offsetWidth : 110;
    const tooltipHeight = tooltipEl ? tooltipEl.offsetHeight : 26;
    const gap = 6;
    const viewportMargin = 8;

    let computedSide = position;
    if (position === "top" && targetRect.top - tooltipHeight - gap < 10) {
      computedSide = "bottom";
    } else if (
      position === "bottom" &&
      targetRect.bottom + tooltipHeight + gap > window.innerHeight - 10
    ) {
      computedSide = "top";
    }

    let top = 0;
    let left = 0;
    let arrowLeft: number | undefined;
    let arrowTop: number | undefined;

    if (computedSide === "top") {
      top = targetRect.top - tooltipHeight - gap;
      const idealLeft = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      left = Math.max(
        viewportMargin,
        Math.min(window.innerWidth - tooltipWidth - viewportMargin, idealLeft)
      );
      const targetCenterX = targetRect.left + targetRect.width / 2;
      arrowLeft = Math.max(6, Math.min(tooltipWidth - 6, targetCenterX - left));
    } else if (computedSide === "bottom") {
      top = targetRect.bottom + gap;
      const idealLeft = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      left = Math.max(
        viewportMargin,
        Math.min(window.innerWidth - tooltipWidth - viewportMargin, idealLeft)
      );
      const targetCenterX = targetRect.left + targetRect.width / 2;
      arrowLeft = Math.max(6, Math.min(tooltipWidth - 6, targetCenterX - left));
    } else if (computedSide === "left") {
      left = targetRect.left - tooltipWidth - gap;
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      arrowTop = tooltipHeight / 2;
    } else if (computedSide === "right") {
      left = targetRect.right + gap;
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      arrowTop = tooltipHeight / 2;
    }

    setCoords({
      top,
      left,
      side: computedSide,
      arrowLeft,
      arrowTop,
    });
  }, [position]);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      const onScrollOrResize = () => {
        updatePosition();
      };
      window.addEventListener("scroll", onScrollOrResize, true);
      window.addEventListener("resize", onScrollOrResize);
      return () => {
        window.removeEventListener("scroll", onScrollOrResize, true);
        window.removeEventListener("resize", onScrollOrResize);
      };
    }
  }, [isVisible, updatePosition]);

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      updatePosition();
    }
  }, [isVisible, updatePosition]);

  if (!content) return <>{children}</>;

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
      </div>

      {mounted &&
        isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{
              position: "fixed",
              top: `${coords ? coords.top : -9999}px`,
              left: `${coords ? coords.left : -9999}px`,
              zIndex: 99999,
            }}
            className={`px-2.5 py-1 text-[11px] font-medium text-white bg-gray-900 rounded shadow-xl whitespace-nowrap pointer-events-none transition-all duration-150 animate-in fade-in-0 zoom-in-95 ${className}`}
          >
            {content}
            {coords && (
              <div
                style={{
                  left: coords.arrowLeft !== undefined ? `${coords.arrowLeft}px` : undefined,
                  top: coords.arrowTop !== undefined ? `${coords.arrowTop}px` : undefined,
                }}
                className={`absolute w-1.5 h-1.5 bg-gray-900 rotate-45 pointer-events-none ${
                  coords.side === "top"
                    ? "top-full -mt-0.5 -translate-x-1/2"
                    : coords.side === "bottom"
                    ? "bottom-full -mb-0.5 -translate-x-1/2"
                    : coords.side === "left"
                    ? "left-full -ml-0.5 -translate-y-1/2"
                    : "right-full -mr-0.5 -translate-y-1/2"
                }`}
              />
            )}
          </div>,
          document.body
        )}
    </>
  );
};
