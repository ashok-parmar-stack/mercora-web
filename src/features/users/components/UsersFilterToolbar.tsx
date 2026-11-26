"use client";

import React from "react";
import { Role, Status } from "@/lib/admin-types";
import { Select, Button } from "@/components/common";
import { FilterX } from "lucide-react";

export interface UsersFilterToolbarProps {
  roles: Role[];
  statuses: Status[];
  roleFilter: string;
  statusFilter: string;
  includeDeleted: boolean;
  hasActiveFilters: boolean;
  onRoleFilterChange: (val: string) => void;
  onStatusFilterChange: (val: string) => void;
  onIncludeDeletedChange: (checked: boolean) => void;
  onResetFilters: () => void;
}

export function UsersFilterToolbar({
  roles,
  statuses,
  roleFilter,
  statusFilter,
  includeDeleted,
  hasActiveFilters,
  onRoleFilterChange,
  onStatusFilterChange,
  onIncludeDeletedChange,
  onResetFilters,
}: UsersFilterToolbarProps) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {/* Role Filter */}
      <div className="w-40">
        <Select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          selectSize="sm"
          aria-label="Filter by role"
        >
          <option value="ALL">All Roles</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Status Filter */}
      {statuses.length > 0 && (
        <div className="w-40">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            selectSize="sm"
            aria-label="Filter by status"
          >
            <option value="ALL">All Statuses</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Show Trash Toggle */}
      <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none bg-surface px-3 py-2.5 rounded-lg border border-border hover:bg-surface-hover hover:border-border-hover transition-colors shadow-2xs">
        <input
          type="checkbox"
          checked={includeDeleted}
          onChange={(e) => onIncludeDeletedChange(e.target.checked)}
          className="rounded border-border accent-primary focus:ring-primary/20 cursor-pointer w-4 h-4"
        />
        Show Trash
      </label>

      {/* Reset Filters Button */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="h-9 px-2.5"
          leftIcon={<FilterX className="w-3.5 h-3.5" />}
          title="Clear all filters"
        >
          Reset
        </Button>
      )}
    </div>
  );
}
