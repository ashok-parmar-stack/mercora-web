"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Badge, Tooltip } from "@/components/common";

export interface UserPermissionOverrideItem {
  id: string;
  permissionId: string;
  permissionName: string;
  actionCode: string;
  effect: "ALLOW" | "DENY";
  reason?: string;
}

export function UserPermissionOverridesList({
  overrides,
  onRemove,
}: {
  overrides: UserPermissionOverrideItem[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-extrabold text-sm text-gray-900">
            Active UBAC Overrides ({overrides.length})
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Explicit access rules configured specifically for this user.
          </p>
        </div>
      </div>

      {overrides.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-xs">
          No user-specific overrides configured. This user inherits all standard permissions from their role.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {overrides.map((ovr) => (
            <div
              key={ovr.id}
              className="p-3 rounded-lg border border-gray-200 bg-gray-50/50 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Badge variant={ovr.effect === "ALLOW" ? "success" : "danger"} size="sm">
                  {ovr.effect}
                </Badge>
                <div>
                  <div className="font-extrabold text-xs text-gray-900 flex items-center gap-1.5">
                    <span>{ovr.permissionName}</span>
                    <span className="text-gray-400">→</span>
                    <code className="text-[11px] font-mono bg-white border border-gray-200 px-1 py-0.5 rounded text-gray-700">
                      {ovr.actionCode}
                    </code>
                  </div>
                  {ovr.reason && (
                    <div className="text-[11px] text-gray-500 mt-0.5">{ovr.reason}</div>
                  )}
                </div>
              </div>

              <Tooltip content="Remove Override">
                <button
                  type="button"
                  onClick={() => onRemove(ovr.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  aria-label="Remove override"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
