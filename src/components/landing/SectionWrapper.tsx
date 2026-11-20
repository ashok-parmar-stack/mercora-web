"use client";

import React, { useEffect, useRef, useState } from "react";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  threshold?: number;
  delayMs?: number;
}

export function SectionWrapper({
  children,
  id,
  className = "",
  threshold = 0.15,
  delayMs = 0,
}: SectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delayMs);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin: "50px 0px 50px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, delayMs]);

  return (
    <div
      ref={ref}
      id={id}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionSkeleton({
  height = "380px",
  label = "Loading Module...",
}: {
  height?: string;
  label?: string;
}) {
  return (
    <div
      className="container my-8"
      style={{
        minHeight: height,
        borderRadius: "16px",
        border: "1px solid var(--theme-glass-border)",
        background: "var(--theme-card-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "32px",
      }}
    >
      <div
        className="skeleton-shimmer"
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: "var(--theme-blush)",
        }}
      />
      <div
        className="skeleton-shimmer"
        style={{
          width: "160px",
          height: "16px",
          borderRadius: "8px",
          background: "var(--theme-blush)",
        }}
      />
      <span
        style={{
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          color: "var(--theme-gray-400)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}
