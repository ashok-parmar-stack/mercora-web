import React from "react";
import {
  Boxes,
  Layers,
  FolderTree,
  Plus,
  Hash,
  ArrowRightLeft,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { ProductCategory } from "@mercora/shared-types";
import { Column } from "../data-table/DataTable";
import { StatusBadge } from "../status/StatusBadge";
import { Tooltip } from "../ui/Tooltip";
import Link from "next/link";

export function getCategoryColumns(categoryMap: Map<string, ProductCategory>): Column<ProductCategory>[] {
  return [
    {
      key: "name",
      header: "Category & Hierarchy",
      sortable: true,
      sortAccessor: (cat) => cat.name?.toLowerCase() ?? "",
      render: (cat) => {
        const depth = Math.max(0, (cat.level || 1) - 1);
        return (
          <div className="flex items-center gap-2.5" style={{ paddingLeft: `${depth * 16}px` }}>
            {depth > 0 && (
              <span className="text-[var(--border)] font-mono text-xs select-none">{"└─"}</span>
            )}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                cat.level === 1
                  ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                  : cat.level === 2
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800"
                  : cat.level === 3
                  ? "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
              }`}
            >
              {cat.level === 1 ? <Boxes className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-[var(--text-primary)] text-xs truncate">{cat.name}</span>
                {cat.isSystem && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 whitespace-nowrap">
                    SYSTEM
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] truncate max-w-[220px] font-mono">/{cat.slug}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "code",
      header: "Category Code",
      sortable: true,
      width: "150px",
      sortAccessor: (cat) => cat.code ?? "",
      render: (cat) => (
        <span className="inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border)] whitespace-nowrap">
          {cat.code}
        </span>
      ),
    },
    {
      key: "level",
      header: "Tree Level",
      align: "center",
      sortable: true,
      width: "140px",
      sortAccessor: (cat) => cat.level ?? 1,
      render: (cat) => {
        const lvl = cat.level || 1;
        const color =
          lvl === 1
            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
            : lvl === 2
            ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800"
            : lvl === 3
            ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
            : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${color}`}>
            L{lvl} {lvl === 1 ? "Root" : lvl === 2 ? "Category" : lvl === 3 ? "Subcategory" : "Leaf"}
          </span>
        );
      },
    },
    {
      key: "parent",
      header: "Parent Category",
      sortable: true,
      width: "190px",
      sortAccessor: (cat) => {
        if (!cat.parentId) return "— Root";
        return categoryMap.get(cat.parentId)?.name ?? "";
      },
      render: (cat) => {
        if (!cat.parentId) {
          return (
            <span className="text-[var(--text-muted)] text-xs italic whitespace-nowrap">
              [ None - Top Level ]
            </span>
          );
        }
        const parent = categoryMap.get(cat.parentId);
        return (
          <div className="flex items-center gap-1.5 min-w-0">
            <FolderTree className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
            <span className="text-xs font-semibold text-[var(--text-secondary)] truncate">
              {parent ? parent.name : "Unknown Parent"}
            </span>
          </div>
        );
      },
    },
    {
      key: "sortOrder",
      header: "Sort Order",
      align: "center",
      sortable: true,
      width: "110px",
      sortAccessor: (cat) => cat.sortOrder ?? 0,
      render: (cat) => (
        <span className="font-mono text-[var(--text-secondary)] text-xs font-semibold">
          {cat.sortOrder ?? 0}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      sortable: true,
      width: "120px",
      sortAccessor: (cat) => cat.status?.code ?? "ACTIVE",
      render: (cat) => (
        <StatusBadge
          status={cat.status?.code || (cat.statusId ? "ACTIVE" : undefined)}
          isDeleted={Boolean(cat.deletedAt)}
        />
      ),
    },
  ];
}

export function renderCategoryRowActions(
  cat: ProductCategory,
  options: {
    onOpenMapHsn: (cat: ProductCategory) => void;
    onOpenMove: (cat: ProductCategory) => void;
    onViewDetails: (cat: ProductCategory) => void;
    onDeleteCategory: (cat: ProductCategory) => void;
  }
) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content="Add Child Subcategory">
        <Link
          href={`/admin/categories/create?parentId=${cat.id}`}
          className="p-1.5 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer inline-flex items-center justify-center"
          aria-label="Add child subcategory"
        >
          <Plus className="w-4 h-4" />
        </Link>
      </Tooltip>
      <Tooltip content="Map HSN Codes">
        <button
          type="button"
          onClick={() => options.onOpenMapHsn(cat)}
          className="p-1.5 rounded-lg text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer"
          aria-label="Map HSN codes"
        >
          <Hash className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip content="Move / Reparent">
        <button
          type="button"
          onClick={() => options.onOpenMove(cat)}
          className="p-1.5 rounded-lg text-purple-500 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer"
          aria-label="Move category"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip content="View Details">
        <button
          type="button"
          onClick={() => options.onViewDetails(cat)}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          aria-label="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip content="Edit Category">
        <Link
          href={`/admin/categories/${cat.id}/edit`}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer inline-flex items-center justify-center"
          aria-label="Edit category"
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </Tooltip>
      {!cat.isSystem && (
        <Tooltip content="Delete Category">
          <button
            type="button"
            onClick={() => options.onDeleteCategory(cat)}
            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
            aria-label="Delete category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </Tooltip>
      )}
    </div>
  );
}