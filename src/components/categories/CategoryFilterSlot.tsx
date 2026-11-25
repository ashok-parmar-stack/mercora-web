import React from "react";
import { Select } from "@/components/ui/Select";

interface CategoryFilterSlotProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  levelFilter: string;
  onLevelChange: (level: string) => void;
}

export function CategoryFilterSlot({
  statusFilter,
  onStatusChange,
  levelFilter,
  onLevelChange,
}: CategoryFilterSlotProps) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <div className="w-36">
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          dropdownPosition="bottom"
          aria-label="Filter by status"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </Select>
      </div>

      <div className="w-40">
        <Select
          value={levelFilter}
          onChange={(e) => onLevelChange(e.target.value)}
          dropdownPosition="bottom"
          aria-label="Filter by level"
        >
          <option value="ALL">All Hierarchy Levels</option>
          <option value="L1">Level 1 (Roots)</option>
          <option value="L2">Level 2 (Categories)</option>
          <option value="L3">Level 3 (Subcategories)</option>
          <option value="L4_PLUS">Level 4+ (Leaf Items)</option>
        </Select>
      </div>
    </div>
  );
}
