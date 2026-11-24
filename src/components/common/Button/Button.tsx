"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
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
    const isDisabled = disabled || isLoading;

    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer";

    const variantStyles = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-xs border border-primary/20",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-surface-hover border border-border shadow-2xs",
      outline:
        "border border-border bg-surface text-foreground hover:bg-surface-hover hover:border-border-hover shadow-2xs",
      ghost:
        "text-foreground hover:bg-surface-hover active:bg-surface-active",
      danger:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 shadow-xs border border-destructive/20",
      link:
        "text-primary underline-offset-4 hover:underline p-0 h-auto active:scale-100",
    };

    const sizeStyles = {
      sm: "h-8 px-2.5 text-xs rounded-md gap-1.5",
      md: "h-9 px-3.5 text-sm rounded-lg gap-2",
      lg: "h-10 px-4 text-sm rounded-lg gap-2.5",
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
      return React.cloneElement(child, {
        ref,
        className: cn(combinedClassName, child.props.className),
        disabled: isDisabled,
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        type={props.type || "button"}
        disabled={isDisabled}
        className={combinedClassName}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
        )}
        {!isLoading && leftIcon && (
          <span className="flex-shrink-0 flex items-center">{leftIcon}</span>
        )}
        <span>{isLoading && loadingText ? loadingText : children}</span>
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0 flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
