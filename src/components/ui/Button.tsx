import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/**
 * Linear-Inspired High-Craft Button Component
 * Precise geometry, micro-hairlines, subtle active scaling, and high-readability typography.
 * Zero dependency on Radix Slot.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-medium tracking-tight transition-all duration-150 outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] rounded-lg border [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-foreground border-transparent shadow-xs hover:shadow-sm",
        primary:
          "bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-foreground border-transparent shadow-xs hover:shadow-sm",
        secondary:
          "bg-secondary hover:bg-surface-hover text-text-primary border-border hover:border-border-hover shadow-2xs",
        outline:
          "bg-transparent hover:bg-surface-hover text-text-primary border-border hover:border-border-hover shadow-2xs",
        danger:
          "bg-destructive hover:opacity-90 active:opacity-95 text-destructive-foreground border-transparent shadow-xs",
        destructive:
          "bg-destructive hover:opacity-90 active:opacity-95 text-destructive-foreground border-transparent shadow-xs",
        ghost:
          "bg-transparent hover:bg-surface-hover text-text-secondary hover:text-text-primary border-transparent",
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto border-transparent active:scale-100",
      },
      size: {
        default: "text-xs px-3.5 py-1.5 gap-2 h-9",
        xs: "text-[11px] px-2 py-1 gap-1 h-6 rounded-md",
        sm: "text-xs px-2.5 py-1 gap-1.5 h-8",
        md: "text-xs px-3.5 py-1.5 gap-2 h-9",
        lg: "text-sm px-5 py-2.5 gap-2.5 h-10 rounded-xl",
        icon: "size-9 p-0",
        "icon-xs": "size-6 p-0 rounded-md",
        "icon-sm": "size-7 p-0",
        "icon-lg": "size-10 p-0 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isBusy = isLoading || loading;
    const isDisabled = disabled || isBusy;
    const computedClass = cn(buttonVariants({ variant, size, className }));

    // Custom asChild implementation without Radix Slot dependency
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        className: cn(computedClass, child.props.className),
        "aria-disabled": isDisabled ? true : undefined,
        children: (
          <>
            {isBusy && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            {!isBusy && leftIcon && <span className="mr-1.5 inline-flex shrink-0">{leftIcon}</span>}
            {child.props.children}
            {!isBusy && rightIcon && <span className="ml-1.5 inline-flex shrink-0">{rightIcon}</span>}
          </>
        ),
      } as any);
    }

    return (
      <button
        className={computedClass}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isBusy && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
        {!isBusy && leftIcon && <span className="mr-1.5 inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {!isBusy && rightIcon && <span className="ml-1.5 inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
