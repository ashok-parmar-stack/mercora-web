"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
export type IconColor =
  | "default"
  | "muted"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "white";

export interface IconProps extends React.SVGAttributes<SVGElement> {
  icon?: LucideIcon;
  size?: IconSize;
  color?: IconColor;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

const sizeMap: Record<IconSize, { px: number; cls: string }> = {
  xs: { px: 12, cls: "w-3 h-3" },
  sm: { px: 14, cls: "w-3.5 h-3.5" },
  md: { px: 16, cls: "w-4 h-4" },
  lg: { px: 20, cls: "w-5 h-5" },
  xl: { px: 24, cls: "w-6 h-6" },
};

const colorMap: Record<IconColor, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  secondary: "text-secondary-brand",
  success: "text-status-success",
  warning: "text-status-warning",
  error: "text-destructive",
  info: "text-status-info",
  white: "text-white",
};

export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = "md",
  color = "default",
  strokeWidth = 2,
  className,
  children,
  ...props
}) => {
  const { cls } = sizeMap[size];
  const colorClass = colorMap[color];

  if (IconComponent) {
    return (
      <IconComponent
        strokeWidth={strokeWidth}
        className={cn(cls, colorClass, "shrink-0 transition-colors", className)}
        {...props}
      />
    );
  }

  if (children && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      strokeWidth: child.props.strokeWidth || strokeWidth,
      className: cn(cls, colorClass, "shrink-0 transition-colors", child.props.className, className),
      ...props,
    });
  }

  return null;
};

export default Icon;
