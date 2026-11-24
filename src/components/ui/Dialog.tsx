"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild, children, onClick, ...props }, ref) => {
    const ctx = React.useContext(DialogContext);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      ctx?.setOpen(true);
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void }>;
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          child.props.onClick?.(e);
          handleClick(e);
        },
      });
    }

    return (
      <button ref={ref} type="button" onClick={handleClick} {...props}>
        {children}
      </button>
    );
  }
);
DialogTrigger.displayName = "DialogTrigger";

export function DialogPortal({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(DialogContext);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ctx?.open || typeof document === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
}

export const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, onClick, ...props }, ref) => {
    const ctx = React.useContext(DialogContext);

    return (
      <div
        ref={ref}
        onClick={(e) => {
          onClick?.(e);
          ctx?.setOpen(false);
        }}
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200",
          className
        )}
        {...props}
      />
    );
  }
);
DialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  showCloseButton?: boolean;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, showCloseButton = true, ...props }, ref) => {
    const ctx = React.useContext(DialogContext);
    if (!ctx?.open) return null;

    return (
      <DialogPortal>
        <DialogOverlay />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4",
            "border border-border bg-surface-raised text-text-primary p-6 shadow-xl rounded-2xl duration-200",
            "animate-in fade-in-0 zoom-in-95 max-h-[90vh] overflow-y-auto",
            className
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <button
              type="button"
              onClick={() => ctx?.setOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors focus:outline-none cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
        </div>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = "DialogContent";

export const DialogClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, children, ...props }, ref) => {
    const ctx = React.useContext(DialogContext);
    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          onClick?.(e);
          ctx?.setOpen(false);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DialogClose.displayName = "DialogClose";

export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-base sm:text-lg font-semibold tracking-tight text-text-primary",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-text-secondary leading-relaxed", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export default Dialog;
