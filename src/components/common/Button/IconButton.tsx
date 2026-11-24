"use client";

import React, { forwardRef } from "react";
import { Button, ButtonProps } from "./Button";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "loadingText"> {
  "aria-label": string;
  icon: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = "md", "aria-label": ariaLabel, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8 p-0",
      md: "h-9 w-9 p-0",
      lg: "h-10 w-10 p-0",
    };

    return (
      <Button
        ref={ref}
        size={size}
        aria-label={ariaLabel}
        className={cn("flex-shrink-0", sizeClasses[size], className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
