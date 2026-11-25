import React from "react";
import {
  Building2,
  Globe,
  Ship,
  Truck,
  Plane,
  Factory,
  Briefcase,
  FileCheck,
  Wrench,
  ShieldCheck,
  Search,
  Layers,
  GitFork,
  Plus,
  Pencil,
  Trash2,
  LucideIcon,
} from "lucide-react";
import { Column } from "@/components/data-table/DataTable";
import { Badge, Tooltip } from "@/components/common";
import { BusinessCategoryItem } from "../types";

const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Ship,
  Truck,
  Plane,
  Factory,
  Building2,
  Briefcase,
  FileCheck,
  Wrench,
  ShieldCheck,
  Search,
  Layers,
};

export function getBusinessCategoryIcon(iconName?: string): LucideIcon {
  return (iconName && ICON_MAP[iconName]) || Layers;
}

export function getBusinessCategoryColumns(
  categoryMap: Map<string, BusinessCategoryItem>,
  onToggleStatus: (cat: BusinessCategoryItem) => void
): Column<BusinessCategoryItem>[] {
  return [
    {
      key: "name",
      header: "Category Name",
      sortable: true,
      sortAccessor: (c) => c.name.toLowerCase(),
      render: (cat) => {
        const Icon = getBusinessCategoryIcon(cat.icon);
        const isSub = Boolean(cat.parentId);
        return (
          <div className="flex items-center gap-3 min-w-[210px]">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                isSub
                  ? "bg-background-secondary text-text-muted border-border"
                  : "bg-primary-soft text-primary border-primary/20"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-text-primary truncate">
                  {cat.name}
                </span>
                {isSub && (
                  <Badge variant="success" size="sm">
                    Sub
                  </Badge>
                )}
              </div>
              {cat.description && (
                <p className="text-[11px] text-text-muted line-clamp-1 max-w-xs mt-0.5">
                  {cat.description}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "code",
      header: "Code & Slug",
      sortable: true,
      sortAccessor: (c) => (c.code || c.slug || "").toLowerCase(),
      render: (cat) => (
        <div className="flex flex-col gap-1">
          <code className="text-[11px] font-mono font-bold text-text-primary bg-background px-1.5 py-0.5 rounded border border-border inline-block w-fit">
            {cat.code || cat.slug.toUpperCase()}
          </code>
          <span className="text-[10px] font-mono text-text-muted">
            /{cat.slug}
          </span>
        </div>
      ),
    },
    {
      key: "parentId",
      header: "Hierarchy",
      sortable: true,
      sortAccessor: (c) => (c.parentId ? categoryMap.get(c.parentId)?.name || "Sub" : "AAA_Root"),
      render: (cat) => {
        const parentCat = cat.parentId ? categoryMap.get(cat.parentId) : null;
        return parentCat ? (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-background-secondary text-[11px] font-semibold text-text-secondary border border-border">
            <GitFork className="w-3 h-3 text-text-muted" />
            <span>{parentCat.name}</span>
          </div>
        ) : (
          <Badge variant="info" size="sm">
            Root / Primary
          </Badge>
        );
      },
    },
    {
      key: "businessCount",
      header: "Businesses",
      align: "center",
      sortable: true,
      sortAccessor: (c) => c.businessCount || 0,
      render: (cat) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-background text-text-secondary border border-border">
          {cat.businessCount || 0}
        </span>
      ),
    },
    {
      key: "displayOrder",
      header: "Order",
      align: "center",
      sortable: true,
      sortAccessor: (c) => c.displayOrder ?? 0,
      render: (cat) => (
        <span className="text-xs font-mono font-semibold text-text-muted">
          #{cat.displayOrder ?? 0}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      align: "center",
      sortable: true,
      sortAccessor: (c) => (c.isActive !== false ? 1 : 0),
      render: (cat) => {
        const active = cat.isActive !== false;
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(cat);
            }}
            title={active ? "Click to Deactivate" : "Click to Activate"}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
              active
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-neutral-100 text-neutral-500 border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                active ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
              }`}
            />
            <span>{active ? "Active" : "Inactive"}</span>
          </button>
        );
      },
    },
  ];
}

export function renderBusinessCategoryRowActions(
  cat: BusinessCategoryItem,
  handlers: {
    onAddSubcategory: (parentId: string) => void;
    onEdit: (cat: BusinessCategoryItem) => void;
    onDelete: (cat: BusinessCategoryItem) => void;
  }
) {
  const isSub = Boolean(cat.parentId);
  return (
    <div className="flex items-center justify-end gap-1">
      {!isSub && (
        <Tooltip content="Add Subcategory">
          <button
            type="button"
            onClick={() => handlers.onAddSubcategory(cat.id)}
            aria-label={`Add subcategory under ${cat.name}`}
            className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary-soft transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </Tooltip>
      )}
      <Tooltip content="Edit Category">
        <button
          type="button"
          onClick={() => handlers.onEdit(cat)}
          aria-label={`Edit ${cat.name}`}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip content="Delete Category">
        <button
          type="button"
          onClick={() => handlers.onDelete(cat)}
          aria-label={`Delete ${cat.name}`}
          className="p-1.5 rounded-lg text-text-muted hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );
}
