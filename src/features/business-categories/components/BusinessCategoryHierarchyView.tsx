"use client";

import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge, Button } from "@/components/common";
import { getBusinessCategoryIcon } from "@/features/business-categories/components/business-category-columns";
import { BusinessCategoryItem } from "@/features/business-categories/types";

interface BusinessCategoryHierarchyViewProps {
  rootCategories: BusinessCategoryItem[];
  allCategories: BusinessCategoryItem[];
  onCreateSubcategory: (parentId: string) => void;
  onEdit: (category: BusinessCategoryItem) => void;
  onDelete: (category: BusinessCategoryItem) => void;
}

export function BusinessCategoryHierarchyView({
  rootCategories,
  allCategories,
  onCreateSubcategory,
  onEdit,
  onDelete,
}: BusinessCategoryHierarchyViewProps) {
  return (
    <div className="space-y-4">
      {rootCategories.map((root) => {
        const Icon = getBusinessCategoryIcon(root.icon);
        const children = allCategories.filter((c) => c.parentId === root.id);
        return (
          <div
            key={root.id}
            className="rounded-2xl border border-border bg-surface p-4 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center border border-primary/20">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-text-primary">{root.name}</span>
                    <Badge variant={root.isActive !== false ? "success" : "neutral"} size="sm">
                      {root.isActive !== false ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-text-muted">
                    {root.businessCount || 0} businesses · {children.length} subcategories
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCreateSubcategory(root.id)}
                  leftIcon={<Plus className="w-3 h-3" />}
                >
                  Add Sub
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(root)}
                  aria-label={`Edit ${root.name}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(root)}
                  aria-label={`Delete ${root.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>
            </div>

            {children.length > 0 && (
              <div className="pl-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 border-t border-border">
                {children.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-background border border-border"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-text-primary truncate">{sub.name}</div>
                      <div className="text-[10px] font-mono text-text-muted truncate">/{sub.slug}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEdit(sub)}
                        className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(sub)}
                        className="p-1 rounded-md text-text-muted hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
