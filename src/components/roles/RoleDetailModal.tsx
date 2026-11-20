"use client";

import React from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Role } from "../../lib/admin-types";

export interface RoleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onEdit: (role: Role) => void;
  onManagePermissions: (role: Role) => void;
}

export const RoleDetailModal: React.FC<RoleDetailModalProps> = ({
  isOpen,
  onClose,
  role,
  onEdit,
  onManagePermissions,
}) => {
  if (!role) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Role Specification: ${role.name}`}
      description="Inspect system metadata, priority configuration, and permission links."
      maxWidth="md"
    >
      <div className="flex flex-col gap-4 mt-2 text-sm">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Semantic Code</span>
            <code className="bg-white px-2 py-0.5 border border-gray-200 rounded text-xs font-mono font-bold text-gray-900">
              {role.code}
            </code>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">System Role</span>
            <Badge variant={role.isSystem ? "purple" : "neutral"} size="sm">
              {role.isSystem ? "Built-in System" : "Custom Defined"}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Priority Weight</span>
            <span className="font-extrabold text-gray-900">{role.priority || 10}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</span>
            <Badge variant={role.deletedAt ? "danger" : "success"} dot size="sm">
              {role.deletedAt ? "SOFT DELETED" : "ACTIVE"}
            </Badge>
          </div>
        </div>

        {role.description && (
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Description
            </div>
            <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200 leading-relaxed">
              {role.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div>
            Created: <strong className="text-gray-800">{new Date(role.createdAt).toLocaleDateString('en-US')}</strong>
          </div>
          <div>
            Updated: <strong className="text-gray-800">{new Date(role.updatedAt).toLocaleDateString('en-US')}</strong>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onManagePermissions(role);
            }}
          >
            Manage Permissions
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(role);
            }}
          >
            Edit Role
          </Button>
        </div>
      </div>
    </Modal>
  );
};
