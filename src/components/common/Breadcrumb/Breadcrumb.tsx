import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

/**
 * Linear-Inspired Breadcrumb Component
 * Subtle path navigation with accessible ARIA landmarks.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0" />,
  className,
  ...props
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-xs select-none", className)} {...props}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.current;

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-text-secondary hover:text-text-primary transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "font-medium",
                    isLast ? "text-text-primary font-semibold" : "text-text-secondary"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && <span aria-hidden="true">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
