import React from "react";
import { Boxes, FolderTree, Layers, Tag } from "lucide-react";

export interface CategoryStats {
  total: number;
  roots: number;
  maxLevel: number;
  systemCount: number;
}

interface CategoryStatsCardsProps {
  stats: CategoryStats;
}

export const CategoryStatsCards: React.FC<CategoryStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Total Categories</div>
          <div className="text-xl font-black text-gray-900 mt-1">{stats.total}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Boxes className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Root Categories</div>
          <div className="text-xl font-black text-indigo-600 mt-1">{stats.roots}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <FolderTree className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Tree Max Depth</div>
          <div className="text-xl font-black text-purple-600 mt-1">Level {stats.maxLevel}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
          <Layers className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">System Core Categories</div>
          <div className="text-xl font-black text-emerald-600 mt-1">{stats.systemCount}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Tag className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
