"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
  value?: Date | string | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Linear-Inspired DatePicker & Calendar Component
 * Pure React custom calendar popup with zero external heavy date libraries.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  label,
  error,
  disabled = false,
  className = "",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? (typeof value === "string" ? new Date(value) : value) : null;
  const [viewDate, setViewDate] = useState<Date>(selectedDate || new Date());

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const days: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  return (
    <div className={cn("relative flex flex-col gap-1.5 w-full", className)} ref={containerRef}>
      {label && <label className="text-xs font-semibold text-text-primary tracking-tight">{label}</label>}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm",
          "text-foreground shadow-2xs transition-colors hover:border-border-hover cursor-pointer",
          "focus:outline-none focus:ring-1 focus:ring-ring focus:border-border-focus disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-destructive focus:ring-destructive"
        )}
      >
        <span className={cn(!selectedDate && "text-muted-foreground")}>
          {selectedDate ? formatDateDisplay(selectedDate) : placeholder}
        </span>
        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
      </button>

      {error && <span className="text-[11px] text-destructive leading-tight">{error}</span>}

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-64 rounded-xl border border-border bg-surface-raised p-3 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
            <span className="text-xs font-semibold text-text-primary">
              {monthNames[month]} {year}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-text-muted mb-1">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (day === null) {
                return <span key={`empty-${idx}`} />;
              }
              const selected = isSelected(day);
              const today = isToday(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => {
                    const picked = new Date(year, month, day);
                    onChange(picked);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors cursor-pointer",
                    selected
                      ? "bg-primary text-primary-foreground font-semibold"
                      : today
                      ? "border border-primary text-primary font-semibold hover:bg-primary-soft"
                      : "text-text-primary hover:bg-surface-hover"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
