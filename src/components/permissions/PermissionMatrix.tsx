"use client";

import React, { useState } from "react";
import { Permission, PermissionAction } from "../../lib/admin-types";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { Search, CheckSquare, Square, Shield } from "lucide-react";

export interface PermissionMatrixProps {
  permissions: Permission[];
  selectedActionIds: Set<string>;
  onChange: (selectedActionIds: Set<string>) => void;
  disabled?: boolean;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  permissions,
  selectedActionIds,
  onChange,
  disabled = false,
}) => {
  const [search, setSearch] = useState("");

  const toggleAction = (actionId: string) => {
    if (disabled) return;
    const next = new Set(selectedActionIds);
    if (next.has(actionId)) {
      next.delete(actionId);
    } else {
      next.add(actionId);
    }
    onChange(next);
  };

  const toggleGroup = (permission: Permission) => {
    if (disabled) return;
    const actions = permission.actions || [];
    const next = new Set(selectedActionIds);
    const allSelected = actions.every((a) => next.has(a.id));

    actions.forEach((a) => {
      if (allSelected) {
        next.delete(a.id);
      } else {
        next.add(a.id);
      }
    });

    onChange(next);
  };

  const selectAll = () => {
    if (disabled) return;
    const next = new Set<string>();
    permissions.forEach((p) => {
      p.actions?.forEach((a) => next.add(a.id));
    });
    onChange(next);
  };

  const clearAll = () => {
    if (disabled) return;
    onChange(new Set());
  };

  const totalActions = permissions.reduce((acc, p) => acc + (p.actions?.length || 0), 0);

  const filteredPermissions = permissions.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const matchName = p.name.toLowerCase().includes(q);
    const matchCode = p.code.toLowerCase().includes(q);
    const matchAction = p.actions?.some((a) =>
      a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
    );
    return matchName || matchCode || matchAction;
  });

  return (
    <div className="flex flex-col gap-4 border border-gray-200 rounded-xl bg-white p-4 sm:p-6 shadow-xs">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">API Access & Privilege Matrix</h4>
            <div className="text-xs text-gray-500">
              Selected: <strong className="text-brand-600 font-extrabold">{selectedActionIds.size}</strong> of{" "}
              <strong>{totalActions}</strong> actions
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-48">
            <Input
              placeholder="Search permissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5" />}
            />
          </div>
          {!disabled && (
            <>
              <button
                type="button"
                onClick={selectAll}
                className="px-2.5 py-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 rounded-lg border border-brand-200 transition-colors"
              >
                Grant All
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg border border-gray-200 transition-colors"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modules List */}
      <div className="flex flex-col gap-4">
        {filteredPermissions.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            No permissions matching search criteria.
          </div>
        ) : (
          filteredPermissions.map((perm) => {
            const actions = perm.actions || [];
            const selectedInGroup = actions.filter((a) => selectedActionIds.has(a.id)).length;
            const isAllGroupSelected = actions.length > 0 && selectedInGroup === actions.length;

            return (
              <div
                key={perm.id}
                className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface)]"
              >
                {/* Module Bar */}
                <div className="px-4 py-3 bg-[var(--background-secondary)] border-b border-[var(--border)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleGroup(perm)}
                      disabled={disabled}
                      className="text-[var(--text-secondary)] hover:text-brand-600 transition-colors disabled:opacity-50 cursor-pointer"
                      aria-label="Toggle group selection"
                    >
                      {isAllGroupSelected ? (
                        <CheckSquare className="w-4 h-4 text-brand-600 dark:text-white" />
                      ) : (
                        <Square className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                    </button>
                    <span className="font-extrabold text-xs text-[var(--text-primary)] uppercase tracking-wider">
                      {perm.name}
                    </span>
                    <code className="text-[10px] text-[var(--text-muted)] font-mono">({perm.code})</code>
                  </div>

                  <Badge variant={selectedInGroup > 0 ? "brand" : "neutral"} size="sm">
                    {selectedInGroup} / {actions.length} enabled
                  </Badge>
                </div>

                {/* Actions Checkbox Grid */}
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {actions.map((act) => {
                    const isChecked = selectedActionIds.has(act.id);
                    return (
                      <label
                        key={act.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isChecked
                            ? "bg-brand-50/40 border-brand-300 text-[var(--text-primary)] dark:bg-brand-950/40 dark:border-brand-800/80 shadow-2xs"
                            : "bg-[var(--surface-hover)] border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-secondary)]"
                        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={disabled}
                          onChange={() => toggleAction(act.id)}
                          className="mt-0.5 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold truncate text-[var(--text-primary)]">{act.name}</div>
                          <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-tight truncate">
                            {act.code}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
