"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isBusy = isLoading || loading;
    const isDisabled = disabled || isBusy;

    const baseStyles =
      "relative inline-flex items-center justify-center font-medium whitespace-nowrap transition-all duration-150 ease-out select-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.985] cursor-pointer group";

    const variantStyles = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active border border-transparent shadow-xs hover:shadow-sm",
      secondary:
        "bg-surface text-foreground border border-border shadow-2xs hover:bg-surface-hover hover:border-border-hover hover:text-foreground",
      outline:
        "border border-border bg-transparent text-foreground hover:bg-surface-hover hover:border-border-hover hover:text-foreground",
      ghost:
        "text-foreground hover:bg-surface-hover hover:text-primary active:bg-surface-active",
      danger:
        "bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-hover shadow-xs border border-transparent",
      link:
        "text-primary underline-offset-4 hover:underline p-0 h-auto hover:text-primary-hover",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
      md: "h-10 px-4 text-sm rounded-lg gap-2 font-medium",
      lg: "h-11 px-5 text-sm sm:text-base rounded-xl gap-2.5 font-semibold",
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      variant !== "link" && sizeStyles[size],
      className
    );

    // Custom asChild implementation without Radix Slot dependency
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      const content = (
        <>
          {!isBusy && leftIcon && (
            <span className="flex-shrink-0 flex items-center transition-transform duration-200">
              {leftIcon}
            </span>
          )}
          <span className="relative z-10 inline-flex items-center justify-center gap-1.5">
            {child.props.children}
          </span>
          {!isBusy && rightIcon && (
            <span className="flex-shrink-0 flex items-center transition-transform duration-200">
              {rightIcon}
            </span>
          )}
        </>
      );
      return React.cloneElement(
        child,
        {
          ref,
          className: cn(combinedClassName, child.props.className),
          disabled: isDisabled,
          ...props,
        },
        content
      );
    }

    return (
      <button
        ref={ref}
        type={props.type || "button"}
        disabled={isDisabled}
        className={combinedClassName}
        {...props}
      >
        {isBusy && (
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
        )}
        {!isBusy && leftIcon && (
          <span className="flex-shrink-0 flex items-center transition-transform duration-200">
            {leftIcon}
          </span>
        )}
        <span className="relative z-10 inline-flex items-center justify-center gap-1.5">
          {isBusy && loadingText ? loadingText : children}
        </span>
        {!isBusy && rightIcon && (
          <span className="flex-shrink-0 flex items-center transition-transform duration-200 relative z-10">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
