import React, { forwardRef } from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  description?: string;
  size?: "sm" | "md" | "lg";
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, size = "md", indeterminate, className = "", id, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);

    const sizeClasses = {
      sm: "w-3.5 h-3.5",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    const autoId = id || (label && typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <label
        htmlFor={autoId}
        className={`inline-flex items-start gap-2.5 select-none ${props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className}`}
      >
        <div className="flex items-center h-5">
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }}
            id={autoId}
            type="checkbox"
            className={`rounded border-[var(--input-border)] bg-[var(--input-background)] accent-[var(--border-focus)] text-[var(--border-focus)] focus:ring-[var(--border-focus)] focus:ring-offset-0 transition-all ${sizeClasses[size]} ${props.disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="flex flex-col text-xs leading-tight">
            {label && <span className="font-semibold text-[var(--text-primary)]">{label}</span>}
            {description && <span className="text-[var(--text-muted)] mt-0.5">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
