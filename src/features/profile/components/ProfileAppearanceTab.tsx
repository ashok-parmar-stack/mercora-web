"use client";

import React from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { useUIStore } from "@/lib/store/ui-store";

export function ProfileAppearanceTab() {
  const { theme, setTheme } = useTheme();
  const addToast = useUIStore((s) => s.addToast);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-xs">
      <div className="mb-6">
        <h3 className="text-base font-extrabold text-[var(--text-primary)]">
          Appearance & Theme Settings
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Customize how the Mercora administrative console is displayed on your screen.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
        {/* Light Mode Card */}
        <div
          onClick={() => {
            setTheme("light");
            addToast("success", "Theme Changed", "Light mode activated.");
          }}
          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between gap-4 ${
            theme === "light"
              ? "border-primary bg-primary-soft/30 shadow-xs"
              : "border-[var(--border)] bg-[var(--surface-hover)] hover:border-gray-400 dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Sun className="w-5 h-5" />
            </div>
            {theme === "light" && (
              <span className="w-3 h-3 rounded-full bg-primary shadow-xs" />
            )}
          </div>
          <div>
            <span className="font-extrabold text-sm text-[var(--text-primary)] block">Light Mode</span>
            <span className="text-xs text-[var(--text-muted)] mt-0.5 block">
              Crisp, clean daytime interface with clear separation.
            </span>
          </div>
        </div>

        {/* Dark Mode Card */}
        <div
          onClick={() => {
            setTheme("dark");
            addToast("success", "Theme Changed", "Dark mode activated.");
          }}
          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between gap-4 ${
            theme === "dark"
              ? "border-primary bg-primary-soft/30 shadow-xs"
              : "border-[var(--border)] bg-[var(--surface-hover)] hover:border-gray-400 dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Moon className="w-5 h-5" />
            </div>
            {theme === "dark" && (
              <span className="w-3 h-3 rounded-full bg-primary shadow-xs" />
            )}
          </div>
          <div>
            <span className="font-extrabold text-sm text-[var(--text-primary)] block">Dark Mode</span>
            <span className="text-xs text-[var(--text-muted)] mt-0.5 block">
              Deep plum background with high contrast and brand accents.
            </span>
          </div>
        </div>

        {/* System Preference */}
        <div
          onClick={() => {
            setTheme("system");
            addToast("success", "Theme Changed", "Syncing with OS system theme.");
          }}
          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between gap-4 ${
            theme === "system"
              ? "border-primary bg-primary-soft/30 shadow-xs"
              : "border-[var(--border)] bg-[var(--surface-hover)] hover:border-gray-400 dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              <Laptop className="w-5 h-5" />
            </div>
            {theme === "system" && (
              <span className="w-3 h-3 rounded-full bg-primary shadow-xs" />
            )}
          </div>
          <div>
            <span className="font-extrabold text-sm text-[var(--text-primary)] block">System Auto</span>
            <span className="text-xs text-[var(--text-muted)] mt-0.5 block">
              Adapts dynamically based on your operating system mode.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
