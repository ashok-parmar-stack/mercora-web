"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, type ButtonProps } from "./Button";
import { cn } from "@/lib/utils";

export interface BackButtonProps
  extends Omit<ButtonProps, "leftIcon" | "children"> {
  href: string;
  label?: string;
  iconOnly?: boolean;
}

/**
 * Standardized theme-aware BackButton bound to global `--surface`,
 * `--border`, `--foreground`, and `--primary` tokens.
 */
export function BackButton({
  href,
  label = "Back",
  iconOnly = false,
  variant = "secondary",
  size = "sm",
  className,
  "aria-label": ariaLabel,
  ...props
}: BackButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      asChild
      aria-label={ariaLabel || (iconOnly ? "Go back" : label)}
      className={cn(
        "hover:text-primary hover:border-primary/40 transition-colors",
        iconOnly && "w-9 h-9 px-0",
        className
      )}
      {...props}
    >
      <Link href={href}>
        <ArrowLeft className="w-4 h-4 shrink-0" />
        {!iconOnly && <span>{label}</span>}
      </Link>
    </Button>
  );
}

export default BackButton;
