import React, { useEffect, useRef } from "react";


export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth,
  size = "md",
  showCloseButton = true,
}) => {
  const effectiveMaxWidth = maxWidth || size;
  // BUG-04: Save the body overflow before locking so we can restore it correctly
  // even when multiple modals are chained (form → confirm dialog pattern)
  const prevOverflowRef = useRef<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      prevOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Restore the previous value — not blindly "unset"
      document.body.style.overflow = prevOverflowRef.current;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--overlay)] backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative w-full ${maxWidthClasses[effectiveMaxWidth]} bg-[var(--surface)] text-[var(--text-primary)] rounded-2xl shadow-2xl border border-[var(--border)] p-6 md:p-8 max-h-[90vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-150`}
      >
        <div className="flex items-start justify-between mb-5">
          <div className="min-w-0 flex-1 pr-2">
            <h3 id="modal-title" className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{title}</h3>
            {description && <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>}
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors cursor-pointer flex-shrink-0"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
