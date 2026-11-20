"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Role, Permission, PermissionAction } from "../../lib/admin-types";

export interface RolePermissionMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  allPermissions: Permission[];
  currentAssignedActions: PermissionAction[];
  onSave: (selectedActionIds: string[]) => Promise<void> | void;
}

export const RolePermissionMatrixModal: React.FC<RolePermissionMatrixModalProps> = ({
  isOpen,
  onClose,
  role,
  allPermissions,
  currentAssignedActions,
  onSave,
}) => {
  const [selectedActionIds, setSelectedActionIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [filterModule, setFilterModule] = useState<string>("ALL");

  useEffect(() => {
    if (isOpen) {
      const initialIds = new Set(currentAssignedActions.map((a) => a.id));
      setSelectedActionIds(initialIds);
    }
  }, [isOpen, currentAssignedActions]);

  const toggleAction = (actionId: string) => {
    const next = new Set(selectedActionIds);
    if (next.has(actionId)) {
      next.delete(actionId);
    } else {
      next.add(actionId);
    }
    setSelectedActionIds(next);
  };

  const toggleAllInPermission = (permission: Permission) => {
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

    setSelectedActionIds(next);
  };

  const selectAllGlobally = () => {
    const next = new Set<string>();
    allPermissions.forEach((p) => {
      p.actions?.forEach((a) => next.add(a.id));
    });
    setSelectedActionIds(next);
  };

  const clearAllGlobally = () => {
    setSelectedActionIds(new Set());
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(Array.from(selectedActionIds));
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const totalActionsCount = allPermissions.reduce((acc, p) => acc + (p.actions?.length || 0), 0);

  const displayedPermissions = allPermissions.filter((p) => {
    if (filterModule !== "ALL" && p.id !== filterModule && p.code !== filterModule) return false;
    return true;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Permissions Matrix: ${role?.name || "Role"}`}
      description={`Assign granular API permissions and action capabilities to [${role?.code}].`}
      maxWidth="2xl"
    >
      <div className="flex flex-col gap-5 mt-2 max-h-[65vh] overflow-y-auto pr-1">
        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700">
              Assigned Privileges:
            </span>
            <Badge variant="brand">
              {selectedActionIds.size} / {totalActionsCount} endpoints
            </Badge>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={selectAllGlobally}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 px-2 py-1 bg-white border border-gray-200 rounded-md hover:border-brand-300 transition-colors"
            >
              Grant All
            </button>
            <button
              type="button"
              onClick={clearAllGlobally}
              className="text-xs font-bold text-gray-600 hover:text-gray-900 px-2 py-1 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Modules & Action Groups */}
        <div className="flex flex-col gap-4">
          {displayedPermissions.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              No permission modules found in catalog.
            </div>
          ) : (
            displayedPermissions.map((perm) => {
              const actions = perm.actions || [];
              const selectedInGroup = actions.filter((a) => selectedActionIds.has(a.id)).length;
              const isAllSelected = actions.length > 0 && selectedInGroup === actions.length;

              return (
                <div
                  key={perm.id}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  {/* Module Header */}
                  <div className="p-3.5 bg-gray-50/70 border-b border-gray-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                      <div>
                        <div className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                          {perm.name} <span className="font-mono text-gray-500 font-normal">({perm.code})</span>
                        </div>
                        {perm.description && (
                          <div className="text-[11px] text-gray-500 leading-tight">
                            {perm.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-500">
                        {selectedInGroup}/{actions.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleAllInPermission(perm)}
                        className={`text-[11px] font-bold px-2 py-1 rounded transition-colors ${
                          isAllSelected
                            ? "bg-brand-50 text-brand-700 border border-brand-200"
                            : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {isAllSelected ? "Unselect Group" : "Select Group"}
                      </button>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {actions.length === 0 ? (
                      <span className="text-xs text-gray-400 italic">
                        No actions defined for this permission.
                      </span>
                    ) : (
                      actions.map((act) => {
                        const isChecked = selectedActionIds.has(act.id);
                        return (
                          <label
                            key={act.id}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer ${
                              isChecked
                                ? "bg-brand-50/40 border-brand-300 text-[var(--text-primary)] dark:bg-brand-950/40 dark:border-brand-800/80 shadow-2xs"
                                : "bg-[var(--surface-hover)] border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-secondary)]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleAction(act.id)}
                              className="mt-0.5 cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-gray-900 flex items-center justify-between gap-1">
                                <span>{act.name}</span>
                                <span className="font-mono text-[10px] text-gray-400 font-normal uppercase">
                                  {act.code}
                                </span>
                              </div>
                              {act.description && (
                                <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                                  {act.description}
                                </p>
                              )}
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 sticky bottom-0 bg-white">
          <Button variant="secondary" size="sm" type="button" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="button" onClick={handleSave} isLoading={saving}>
            Save Permissions
          </Button>
        </div>
      </div>
    </Modal>
  );
};
