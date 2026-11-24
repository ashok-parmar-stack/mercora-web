"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalendarProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  className?: string;
}

export function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  className = "",
}: CalendarProps) {
  const [viewDate, setViewDate] = useState<Date>(value || new Date());

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

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    return (
      value.getDate() === day &&
      value.getMonth() === month &&
      value.getFullYear() === year
    );
  };

  const isDateDisabled = (day: number) => {
    const targetDate = new Date(year, month, day);
    if (minDate && targetDate < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) {
      return true;
    }
    if (maxDate && targetDate > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) {
      return true;
    }
    if (disabledDates && disabledDates(targetDate)) {
      return true;
    }
    return false;
  };

  return (
    <div className={cn("w-full max-w-xs rounded-xl border border-border bg-surface p-3 text-foreground select-none", className)}>
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
        <span className="text-xs font-semibold text-foreground">
          {monthNames[month]} {year}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Previous month"
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-muted-foreground mb-1">
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
          const disabled = isDateDisabled(day);

          return (
            <button
              key={`day-${day}`}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled && onChange) {
                  onChange(new Date(year, month, day));
                }
              }}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors cursor-pointer",
                selected
                  ? "bg-primary text-primary-foreground font-semibold"
                  : today
                  ? "border border-primary text-primary font-semibold hover:bg-secondary"
                  : "text-foreground hover:bg-surface-hover",
                disabled && "opacity-30 cursor-not-allowed hover:bg-transparent"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
