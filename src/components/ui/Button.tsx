import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-bold tracking-wider uppercase transition-all duration-150 outline-none select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:translate-y-px rounded-xl border border-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary-hover text-primary-foreground border-primary hover:border-primary-hover focus:ring-primary shadow-xs hover:shadow-md",
        primary:
          "bg-primary hover:bg-primary-hover text-primary-foreground border-primary hover:border-primary-hover focus:ring-primary shadow-xs hover:shadow-md",
        secondary:
          "bg-secondary hover:bg-slate-200 dark:hover:bg-slate-800 text-secondary-foreground border border-border focus:ring-border shadow-2xs",
        outline:
          "bg-card hover:bg-muted text-foreground border border-border focus:ring-border",
        danger:
          "bg-destructive hover:bg-rose-700 text-destructive-foreground focus:ring-destructive shadow-xs",
        destructive:
          "bg-destructive hover:bg-rose-700 text-destructive-foreground focus:ring-destructive shadow-xs",
        ghost:
          "bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground border-transparent",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto border-transparent",
      },
      size: {
        default: "text-xs px-4 py-2.5 gap-2 h-10",
        xs: "text-[10px] px-2 py-1 gap-1 h-6",
        sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
        md: "text-xs px-4 py-2.5 gap-2 h-10",
        lg: "text-sm px-6 py-3.5 gap-2.5 h-12",
        icon: "size-9 p-0",
        "icon-xs": "size-6 p-0",
        "icon-sm": "size-7 p-0",
        "icon-lg": "size-11 p-0",
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
      variant = "primary",
      size = "md",
      asChild = false,
      isLoading = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isSpinning = Boolean(isLoading || loading);

    if (asChild) {
      const Comp = Slot.Root;
      return (
        <Comp
          ref={ref as any}
          className={cn(buttonVariants({ variant, size, className }))}
          {...(props as any)}
        >
          {children}
        </Comp>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isSpinning}
        {...props}
      >
        {isSpinning && <Loader2 className="w-4 h-4 animate-spin -ml-0.5 mr-1" />}
        {!isSpinning && leftIcon}
        <span>{children}</span>
        {!isSpinning && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
