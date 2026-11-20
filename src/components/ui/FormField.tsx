import React from "react";

export interface FormFieldProps {
  /** Label text shown above the field */
  label?: string;
  /** Shows a red asterisk next to the label */
  required?: boolean;
  /** Error message shown below the field */
  error?: string;
  /** Helper text shown below the field when there is no error */
  helperText?: string;
  /** Mirrors disabled state visually on the label */
  disabled?: boolean;
  /** HTML id — passed to the label's htmlFor */
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * COM-01 · FormField
 *
 * Uniform label + field + error + helperText wrapper.
 * Eliminates 40-50 lines of repeated markup per form.
 *
 * Usage:
 * ```tsx
 * <FormField label="Email" error={errors.email?.message} required>
 *   <Input {...register("email")} />
 * </FormField>
 * ```
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  helperText,
  disabled,
  htmlFor,
  className = "",
  children,
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={`text-xs font-bold uppercase tracking-wider ${
            disabled
              ? "text-[var(--text-muted)]"
              : "text-[var(--text-secondary)]"
          }`}
        >
          {label}
          {required && (
            <span className="ml-0.5 text-[var(--error)]" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {children}

      {error && (
        <span className="text-xs text-[var(--error)] font-medium flex items-center gap-1">
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </span>
      )}

      {!error && helperText && (
        <span className="text-xs text-[var(--text-muted)]">{helperText}</span>
      )}
    </div>
  );
};
