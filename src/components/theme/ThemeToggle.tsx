"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";

export interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "pill" | "dropdown";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  variant = "icon",
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] opacity-60 ${className}`}
        aria-hidden="true"
      >
        <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (variant === "pill") {
    return (
      <div className={`inline-flex items-center p-0.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] ${className}`}>
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            !isDark
              ? "bg-[var(--surface)] text-amber-600 shadow-2xs border border-[var(--border)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
          title="Light Mode"
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isDark
              ? "bg-[var(--surface)] text-blue-400 shadow-2xs border border-[var(--border)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
          title="Dark Mode"
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs group focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
        {/* Sun Icon (Visible in Light Mode) */}
        <Sun
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 transition-all duration-300 absolute ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100 group-hover:rotate-45"
          }`}
        />
        {/* Moon Icon (Visible in Dark Mode) */}
        <Moon
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 transition-all duration-300 absolute ${
            isDark
              ? "rotate-0 scale-100 opacity-100 group-hover:-rotate-12"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;

