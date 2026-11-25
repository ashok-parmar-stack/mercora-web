"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button, Input, Select } from "@/components/common";

interface AddPermissionOverrideCardProps {
  permissions: Array<{ id: string; name: string }>;
  availableActions: string[];
  selectedPermId: string;
  selectedAction: string;
  selectedEffect: "ALLOW" | "DENY";
  overrideReason: string;
  onPermChange: (id: string) => void;
  onActionChange: (action: string) => void;
  onEffectChange: (effect: "ALLOW" | "DENY") => void;
  onReasonChange: (reason: string) => void;
  onAdd: () => void;
}

export function AddPermissionOverrideCard({
  permissions,
  availableActions,
  selectedPermId,
  selectedAction,
  selectedEffect,
  overrideReason,
  onPermChange,
  onActionChange,
  onEffectChange,
  onReasonChange,
  onAdd,
}: AddPermissionOverrideCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col gap-4">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-600" />
          Add Permission Override
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Specify a target module and action to grant or revoke explicitly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select
          label="Permission Module *"
          value={selectedPermId}
          onChange={(e) => {
            onPermChange(e.target.value);
            onActionChange("VIEW");
          }}
        >
          <option value="">Select module...</option>
          {permissions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>

        <Select
          label="Action *"
          value={selectedAction}
          onChange={(e) => onActionChange(e.target.value)}
        >
          {availableActions.map((act) => (
            <option key={act} value={act}>
              {act}
            </option>
          ))}
        </Select>

        <Select
          label="Override Effect *"
          value={selectedEffect}
          onChange={(e) => onEffectChange(e.target.value as "ALLOW" | "DENY")}
        >
          <option value="ALLOW">ALLOW (Explicit Grant)</option>
          <option value="DENY">DENY (Explicit Revoke)</option>
        </Select>
      </div>

      <Input
        label="Audit Reason / Justification"
        placeholder="e.g. Special authorization from security officer..."
        value={overrideReason}
        onChange={(e) => onReasonChange(e.target.value)}
      />

      <div className="flex justify-end pt-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={onAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Apply Override Rule
        </Button>
      </div>
    </div>
  );
}
