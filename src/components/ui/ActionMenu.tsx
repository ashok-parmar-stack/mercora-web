"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger" | "warning";
  disabled?: boolean;
  /** Renders a divider line above this item */
  divider?: boolean;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  /** Custom trigger node. Defaults to ⋯ button. */
  trigger?: React.ReactNode;
  /** Tooltip for the default trigger button */
  triggerLabel?: string;
  align?: "left" | "right";
  disabled?: boolean;
}

/**
 * COM-02 · ActionMenu
 *
 * Reusable three-dot row-actions dropdown. Replaces every ad-hoc action
 * dropdown across the admin pages with a single consistent component.
 *
 * Usage:
 * ```tsx
 * <ActionMenu items={[
 *   { label: "Edit", icon: <Pencil />, onClick: () => openEdit(item) },
 *   { label: "Delete", icon: <Trash2 />, onClick: () => confirmDelete(item), variant: "danger", divider: true },
 * ]} />
 * ```
 */
export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  trigger,
  triggerLabel = "Actions",
  align = "right",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-detect open direction
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setOpenUpward(window.innerHeight - rect.bottom < 180);
    }
  }, [isOpen]);

  // Keyboard: Escape closes
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  const variantClasses: Record<string, string> = {
    default: "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]",
    danger: "text-[var(--error)] hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-[var(--error)]",
    warning: "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30",
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger */}
      {trigger ? (
        <div onClick={() => !disabled && setIsOpen((v) => !v)}>{trigger}</div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((v) => !v)}
          aria-label={triggerLabel}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isOpen
              ? "bg-[var(--surface-hover)] text-[var(--text-primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      )}

      {/* Dropdown menu */}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={triggerLabel}
          className={`absolute z-50 ${
            align === "right" ? "right-0" : "left-0"
          } ${
            openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"
          } w-48 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl p-1.5 animate-in fade-in-50 zoom-in-95 duration-100 ring-1 ring-black/5 dark:ring-white/10`}
        >
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              {item.divider && idx > 0 && (
                <div className="my-1 border-t border-[var(--border)]" />
              )}
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  variantClasses[item.variant || "default"]
                }`}
              >
                {item.icon && (
                  <span className="flex-shrink-0 w-3.5 h-3.5 flex items-center">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
