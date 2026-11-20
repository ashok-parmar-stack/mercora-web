import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      className = "",
      id,
      onWheel,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (props.type === "number") {
        // Prevent mouse wheel from accidentally incrementing/decrementing number inputs
        e.currentTarget.blur();
      }
      onWheel?.(e);
    };

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 pointer-events-none text-[var(--text-muted)] flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            onWheel={handleWheel}
            className={`w-full h-[42px] bg-[var(--input-background)] border ${
              error ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-red-500/20" : "border-[var(--input-border)] focus:border-[var(--border-focus)] focus:ring-[var(--border-focus)]/20"
            } rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--input-placeholder)] ${
              leftIcon ? "pl-9" : "pl-3.5"
            } pr-3.5 py-2.5 outline-none transition-all duration-150 focus:ring-2 disabled:bg-[var(--surface-hover)] disabled:text-[var(--text-muted)] ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-[var(--error)] font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-[var(--text-muted)]">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
