import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, id, ...props }, ref) => {
    const textareaId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] font-rethink"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--input-placeholder)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-50 transition-all font-sans",
            error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-xs text-[var(--error)] font-medium">{error}</span>
        )}
        {!error && helperText && (
          <span className="text-xs text-[var(--text-muted)]">{helperText}</span>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
