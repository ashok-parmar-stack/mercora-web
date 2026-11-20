import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  loading,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const isButtonLoading = isLoading || loading || false;
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-md";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-xs px-4 py-2.5 gap-2",
    lg: "text-sm px-6 py-3.5 gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-brand-500 hover:bg-brand-600 text-white border border-brand-500 hover:border-brand-600 focus:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600 dark:text-white dark:border-brand-500 dark:shadow-[0_0_18px_rgba(238,49,53,0.32)] shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
    secondary:
      "bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--border-hover)] focus:ring-[var(--border-focus)] shadow-2xs cursor-pointer",
    outline:
      "bg-transparent hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-hover)] focus:ring-[var(--border-focus)] hover:-translate-y-0.5 cursor-pointer",
    danger:
      "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/40 dark:hover:bg-red-950/70 dark:text-red-300 dark:border-red-800/60 focus:ring-red-500 cursor-pointer",
    ghost:
      "bg-transparent hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent focus:ring-[var(--border)] cursor-pointer",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isButtonLoading}
      {...props}
    >
      {isButtonLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
