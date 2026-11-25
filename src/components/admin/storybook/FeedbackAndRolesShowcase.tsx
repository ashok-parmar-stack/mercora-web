"use client";

import React, { useState } from "react";
import { AlertTriangle, Bell, CheckCircle, Info, XCircle } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DeleteConfirmDialog,
} from "@/components/common";
import { RoleGuard } from "@/components/ui/RoleGuard";
import { useRole } from "@/components/ui/RoleContext";
import { useUIStore } from "@/lib/store/ui-store";

export function FeedbackAndRolesShowcase() {
  const { activePersona } = useRole();
  const addToast = useUIStore((s) => s.addToast);
  const [btnLoading, setBtnLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-600" />
            <CardTitle>4. Global Toast Notifications &amp; Confirmation Dialogs</CardTitle>
          </div>
          <CardDescription>
            Test global toast triggers and standardized confirmation modals with no browser alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Trigger Global Toasts
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={() => addToast("success", "Action Completed", "Record has been updated successfully.")}
              >
                <CheckCircle className="w-4 h-4 text-emerald-600 mr-1.5" />
                Trigger Success Toast
              </Button>
              <Button
                variant="outline"
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
                onClick={() => addToast("error", "Action Failed", "Could not complete operation due to server validation.")}
              >
                <XCircle className="w-4 h-4 text-rose-600 mr-1.5" />
                Trigger Error Toast
              </Button>
              <Button
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() => addToast("warning", "Attention Required", "Record has pending dependencies.")}
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 mr-1.5" />
                Trigger Warning Toast
              </Button>
              <Button
                variant="outline"
                className="border-sky-200 text-sky-700 hover:bg-sky-50"
                onClick={() => addToast("info", "Background Sync", "Icegate sync completed in the background.")}
              >
                <Info className="w-4 h-4 text-sky-600 mr-1.5" />
                Trigger Info Toast
              </Button>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Confirmation Modals
            </div>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Open Delete Confirmation Modal
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Button Variations &amp; Interactive States</CardTitle>
          <CardDescription>Different style variants, sizes, loading states, and icon integrations.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="primary">Primary Brand</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Button size="sm" variant="primary">Small (sm)</Button>
            <Button size="md" variant="primary">Medium (md)</Button>
            <Button size="lg" variant="primary">Large (lg)</Button>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Button
              variant="primary"
              isLoading={btnLoading}
              onClick={() => {
                setBtnLoading(true);
                setTimeout(() => setBtnLoading(false), 2000);
              }}
            >
              {btnLoading ? "Processing..." : "Click to Test Loading"}
            </Button>
            <Button variant="outline" disabled>
              Disabled Button
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Badges &amp; Indicators</CardTitle>
          <CardDescription>Semantic color scales, status indicators, and micro dots.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 items-center">
          <Badge variant="success" dot>Active</Badge>
          <Badge variant="danger" dot>Inactive</Badge>
          <Badge variant="warning" dot>Pending</Badge>
          <Badge variant="info" dot>Processing</Badge>
          <Badge variant="purple">Super Admin</Badge>
          <Badge variant="brand">Mercora Core</Badge>
          <Badge variant="neutral">Guest</Badge>
          <Badge size="sm" variant="success">Compact Badge</Badge>
        </CardContent>
      </Card>

      <Card className="border-brand-100 bg-brand-50/20">
        <CardHeader>
          <CardTitle className="text-brand-900">7. Role-Wise Security Guard Demo</CardTitle>
          <CardDescription>
            Current Active Role in View:{" "}
            <span className="font-bold text-brand-700">
              {activePersona.roleName} ({activePersona.roleCode})
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Action Restricted to Super Admin:
            </div>
            <div className="flex gap-3 items-center flex-wrap">
              <RoleGuard requireSuperAdmin disableInsteadOfHide>
                <Button variant="danger" size="sm">
                  Delete System Database Tables
                </Button>
              </RoleGuard>
              <RoleGuard requireCanManageRoles disableInsteadOfHide>
                <Button variant="outline" size="sm">
                  Modify Global RBAC Matrix
                </Button>
              </RoleGuard>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              (Notice how buttons automatically disable with tooltip feedback when switching to non-admin roles).
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        entityName="Sample Email Template"
        entityType="sample template"
        onConfirm={async () => {
          addToast("success", "Template Deleted", "Sample Email Template has been removed.");
          setConfirmOpen(false);
        }}
      />
    </>
  );
}
