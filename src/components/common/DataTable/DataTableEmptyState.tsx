"use client";

import React from "react";
import { Inbox } from "lucide-react";

export interface DataTableEmptyStateProps {
  title?: string;
  description?: string;
}

export const DataTableEmptyState: React.FC<DataTableEmptyStateProps> = ({
  title = "No records found",
  description = "There are no entries matching your current filters.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 max-w-sm mx-auto text-center select-none">
      <div className="w-12 h-12 rounded-2xl bg-surface-hover flex items-center justify-center text-muted-foreground border border-border">
        <Inbox className="w-6 h-6 stroke-[1.75]" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground text-sm tracking-tight">{title}</h4>
        <p className="text-xs text-text-secondary leading-relaxed mt-1">{description}</p>
      </div>
    </div>
  );
};

export default DataTableEmptyState;
