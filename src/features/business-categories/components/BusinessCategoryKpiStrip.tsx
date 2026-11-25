"use client";

import React from "react";
import { Layers, Building2, FolderTree, CheckCircle2 } from "lucide-react";

export interface BusinessCategoryStats {
  total: number;
  roots: number;
  subcats: number;
  active: number;
}

export function BusinessCategoryKpiStrip({ stats }: { stats: BusinessCategoryStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-surface p-4 rounded-xl border border-border shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-xs text-text-muted font-medium">Total Categories</div>
          <div className="text-xl font-black text-text-primary mt-1">{stats.total}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
          <Layers className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-surface p-4 rounded-xl border border-border shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-xs text-text-muted font-medium">Core Business Types</div>
          <div className="text-xl font-black text-blue-600 mt-1">{stats.roots}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
          <Building2 className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-surface p-4 rounded-xl border border-border shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-xs text-text-muted font-medium">Subcategories</div>
          <div className="text-xl font-black text-emerald-600 mt-1">{stats.subcats}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
          <FolderTree className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-surface p-4 rounded-xl border border-border shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-xs text-text-muted font-medium">Active Live Types</div>
          <div className="text-xl font-black text-primary mt-1">{stats.active}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
