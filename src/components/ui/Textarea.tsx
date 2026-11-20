import React, { forwardRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error, label, helperText, disabled, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border transition-all outline-hidden resize-y min-h-[80px] ${
            error
              ? "border-rose-400 focus:border-rose-600 bg-rose-50/30 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200"
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-red-500"
          } ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800" : ""} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
