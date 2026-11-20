import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Hash,
  ArrowRightLeft,
  Pencil,
  Trash2,
  RefreshCw,
  FolderTree,
} from "lucide-react";
import { CategoryTreeNode, ProductCategory } from "@mercora/shared-types";
import { Tooltip } from "../ui/Tooltip";

interface CategoryTreeViewProps {
  tree: CategoryTreeNode[];
  isTreeLoading: boolean;
  searchTerm: string;
  expandedNodeIds: Set<string>;
  toggleNode: (nodeId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  totalNodes: number;
  onOpenMove: (cat: ProductCategory) => void;
  onOpenMapHsn: (cat: ProductCategory) => void;
  onDeleteCategory: (cat: ProductCategory) => void;
  onSeedBaseline: () => void;
}

export const CategoryTreeView: React.FC<CategoryTreeViewProps> = ({
  tree,
  isTreeLoading,
  searchTerm,
  expandedNodeIds,
  toggleNode,
  expandAll,
  collapseAll,
  totalNodes,
  onOpenMove,
  onOpenMapHsn,
  onDeleteCategory,
  onSeedBaseline,
}) => {
  const renderTreeNode = (node: CategoryTreeNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodeIds.has(node.id) || searchTerm.trim().length > 0;
    const mappedCount = node.mappedHsnsCount ?? (node as any).hsnMappings?.length ?? 0;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`group flex items-center justify-between py-2.5 px-3 rounded-xl border transition-all duration-150 mb-1.5 ${
            depth === 0
              ? "bg-white border-gray-200 shadow-2xs"
              : depth === 1
              ? "bg-gray-50/80 border-gray-200/80"
              : depth === 2
              ? "bg-slate-50/70 border-slate-200/70"
              : "bg-white/50 border-dashed border-gray-200"
          } hover:border-brand-400 hover:shadow-xs`}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          {/* Left info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleNode(node.id)}
                className="w-6 h-6 rounded-md bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <div className="w-6 h-6 flex items-center justify-center text-gray-300 font-mono text-xs">
                •
              </div>
            )}

            {/* Depth Level Indicator */}
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                depth === 0
                  ? "bg-blue-100 text-blue-800"
                  : depth === 1
                  ? "bg-indigo-100 text-indigo-800"
                  : depth === 2
                  ? "bg-purple-100 text-purple-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              L{node.level}
            </span>

            {/* Name & Slug */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-gray-900 truncate">{node.name}</span>
                {node.isSystem && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                    SYSTEM
                  </span>
                )}
                {mappedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-0.5">
                    <Hash className="w-3 h-3" />
                    {mappedCount} HSN
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                <code>{node.code}</code>
                <span>/</span>
                <span>{node.slug}</span>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <Tooltip content="Add Child Subcategory">
              <Link
                href={`/admin/categories/create?parentId=${node.id}`}
                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                aria-label="Add child subcategory"
              >
                <Plus className="w-4 h-4" />
              </Link>
            </Tooltip>

            <Tooltip content="Map HSN Codes">
              <button
                type="button"
                onClick={() => onOpenMapHsn(node)}
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <Hash className="w-4 h-4" />
              </button>
            </Tooltip>

            <Tooltip content="Move / Reparent">
              <button
                type="button"
                onClick={() => onOpenMove(node)}
                className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </Tooltip>

            <Tooltip content="Edit Category">
              <Link
                href={`/admin/categories/${node.id}/edit`}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer inline-flex items-center justify-center"
                aria-label="Edit category"
              >
                <Pencil className="w-4 h-4" />
              </Link>
            </Tooltip>

            {!node.isSystem && (
              <Tooltip content="Delete">
                <button
                  type="button"
                  onClick={() => onDeleteCategory(node)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Children Render */}
        {hasChildren && isExpanded && (
          <div className="relative pl-2 border-l border-gray-200 ml-4">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tree Action Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs text-gray-500 font-medium">
          Flipkart-Style Interactive Category Tree •{" "}
          <span className="font-bold text-gray-900">{totalNodes} total nodes</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-2xs transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-2xs transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Tree Canvas */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs min-h-[400px]">
        {isTreeLoading ? (
          <div className="py-20 text-center text-gray-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
            <span className="text-xs font-medium">Loading Category Hierarchy Tree...</span>
          </div>
        ) : tree.length === 0 ? (
          <div className="py-16 text-center text-gray-400 flex flex-col items-center gap-3">
            <FolderTree className="w-12 h-12 text-gray-300" />
            <div className="text-sm font-extrabold text-gray-700">No product categories found</div>
            <p className="text-xs text-gray-400 max-w-sm">
              Click &quot;Seed Baseline Taxonomy&quot; to auto-populate Ceramic &amp; Tiles and complementary industrial masters.
            </p>
            <button
              type="button"
              onClick={onSeedBaseline}
              className="mt-2 px-4 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl shadow-xs hover:bg-brand-700 cursor-pointer"
            >
              Seed Ceramic &amp; Tiles Baseline
            </button>
          </div>
        ) : (
          <div className="space-y-1">{tree.map((root) => renderTreeNode(root, 0))}</div>
        )}
      </div>
    </div>
  );
};
