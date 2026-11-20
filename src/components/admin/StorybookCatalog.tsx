"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Checkbox } from "../ui/Checkbox";
import { RoleGuard } from "../ui/RoleGuard";
import { useRole } from "../ui/RoleContext";
import { useUIStore } from "../../lib/store/ui-store";
import { DataTable, Column, BulkAction } from "../data-table/DataTable";
import { DeleteConfirmDialog, StatusConfirmDialog } from "../common/ConfirmDialog";
import {
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  Trash2,
  Sparkles,
  Palette,
  CheckSquare,
  Layers,
  Bell,
  SlidersHorizontal,
  Sun,
  Moon,
} from "lucide-react";

interface SampleItem {
  id: string;
  code: string;
  name: string;
  category: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  updatedAt: string;
}

const SAMPLE_DATA: SampleItem[] = [
  { id: "s-1", code: "TMPL_INVITE", name: "Enterprise User Invitation", category: "AUTH", status: "ACTIVE", updatedAt: "2026-09-29" },
  { id: "s-2", code: "TMPL_RESET", name: "Security Password Reset", category: "SECURITY", status: "ACTIVE", updatedAt: "2026-09-28" },
  { id: "s-3", code: "TMPL_DIGEST", name: "Daily Trade Intelligence Digest", category: "NOTIFICATION", status: "ACTIVE", updatedAt: "2026-09-27" },
  { id: "s-4", code: "TMPL_KYC_VERIFY", name: "KYC Onboarding Verification", category: "COMPLIANCE", status: "PENDING", updatedAt: "2026-09-26" },
  { id: "s-5", code: "TMPL_ORDER_CONFIRM", name: "B2B Export Order Confirmation", category: "ORDERS", status: "ACTIVE", updatedAt: "2026-09-25" },
];

export const StorybookCatalog: React.FC = () => {
  const { activePersona } = useRole();
  const addToast = useUIStore((s) => s.addToast);

  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [btnLoading, setBtnLoading] = useState(false);
  const [inputValue, setInputValue] = useState("admin@mercora.com");
  const [inputError, setInputError] = useState("");
  const [demoRole, setDemoRole] = useState("SUPER_ADMIN");
  const [demoStatus, setDemoStatus] = useState("ACTIVE");

  // Checkbox demo states
  const [chk1, setChk1] = useState(true);
  const [chk2, setChk2] = useState(false);
  const [chk3, setChk3] = useState(true);

  // Table demo state
  const [tableData, setTableData] = useState<SampleItem[]>(SAMPLE_DATA);
  const [tableSearch, setTableSearch] = useState("");
  const [sampleDeleteConfirm, setSampleDeleteConfirm] = useState<SampleItem | null>(null);
  const [sampleBulkDelete, setSampleBulkDelete] = useState<string[] | null>(null);
  const [sampleBulkStatus, setSampleBulkStatus] = useState<{ ids: string[]; targetStatus: string } | null>(null);

  const filteredData = tableData.filter(
    (item) =>
      item.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      item.code.toLowerCase().includes(tableSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const sampleColumns: Column<SampleItem>[] = [
    {
      key: "name",
      header: "Template Name & Code",
      sortable: true,
      render: (item) => (
        <div>
          <div className="font-bold text-gray-900">{item.name}</div>
          <div className="font-mono text-[11px] text-gray-400 uppercase">{item.code}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (item) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
          {item.category}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${item.status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : item.status === "PENDING"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${item.status === "ACTIVE" ? "bg-emerald-500" : item.status === "PENDING" ? "bg-amber-500" : "bg-gray-400"
              }`}
          />
          {item.status}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Last Modified",
      sortable: true,
      render: (item) => <span className="font-mono text-xs text-gray-500">{item.updatedAt}</span>,
    },
  ];

  const sampleBulkActions: BulkAction<SampleItem>[] = [
    {
      label: "Activate Selected",
      variant: "primary",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      onClick: async (selectedIds) => {
        setSampleBulkStatus({ ids: selectedIds, targetStatus: "ACTIVE" });
      },
    },
    {
      label: "Deactivate Selected",
      variant: "secondary",
      icon: <XCircle className="w-3.5 h-3.5" />,
      onClick: async (selectedIds) => {
        setSampleBulkStatus({ ids: selectedIds, targetStatus: "INACTIVE" });
      },
    },
    {
      label: "Delete Selected",
      variant: "danger",
      icon: <Trash2 className="w-3.5 h-3.5" />,
      onClick: async (selectedIds) => {
        setSampleBulkDelete(selectedIds);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-brand-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-800">
        <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          Component Design System & Theme Catalog
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Mercora Admin Design System
        </h2>
        <p className="text-gray-300 text-sm mt-2 max-w-3xl leading-relaxed">
          Consistent, theme-aware UI tokens, branded checkboxes, interactive multi-select tables,
          confirmation dialogs, and global notification toasts.
        </p>
      </div>

      {/* ── 1. Color Palette Tokens ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand-600" />
            <CardTitle>1. Brand Color System & Design Tokens</CardTitle>
          </div>
          <CardDescription>
            The primary brand crimson palette (`#ee3135`), dark ink surfaces, and semantic indicators.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Brand Red Spectrum
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="flex flex-col p-3 rounded-xl bg-brand-50 border border-brand-200">
                <span className="text-xs font-bold text-brand-900">brand-50</span>
                <span className="text-[10px] font-mono text-brand-700">#fff3f4</span>
                <span className="text-[10px] text-gray-500 mt-1">Row Selection / Tint</span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-brand-100 border border-brand-200">
                <span className="text-xs font-bold text-brand-900">brand-100</span>
                <span className="text-[10px] font-mono text-brand-700">#ffe4e6</span>
                <span className="text-[10px] text-gray-500 mt-1">Light Border</span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-brand-500 text-white shadow-sm">
                <span className="text-xs font-bold">brand-500</span>
                <span className="text-[10px] font-mono text-brand-100">#ee3135</span>
                <span className="text-[10px] text-brand-100 mt-1">Primary Red Accent</span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-brand-600 text-white shadow-sm">
                <span className="text-xs font-bold">brand-600</span>
                <span className="text-[10px] font-mono text-brand-100">#d92c30</span>
                <span className="text-[10px] text-brand-100 mt-1">Button Hover / Check</span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-brand-700 text-white shadow-sm">
                <span className="text-xs font-bold">brand-700</span>
                <span className="text-[10px] font-mono text-brand-100">#b82029</span>
                <span className="text-[10px] text-brand-100 mt-1">Active Elements</span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-gray-900 text-white shadow-sm">
                <span className="text-xs font-bold">brand-dark</span>
                <span className="text-[10px] font-mono text-gray-400">#14161a</span>
                <span className="text-[10px] text-gray-400 mt-1">Sidebar / Text</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Semantic Status Tokens
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs font-bold text-emerald-800">Success</div>
                <div className="text-[10px] font-mono text-emerald-600">ACTIVE / APPROVED</div>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <div className="text-xs font-bold text-rose-800">Danger / Error</div>
                <div className="text-[10px] font-mono text-rose-600">INACTIVE / DELETED</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-xs font-bold text-amber-800">Warning / Pending</div>
                <div className="text-[10px] font-mono text-amber-600">PENDING / SUSPENDED</div>
              </div>
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
                <div className="text-xs font-bold text-sky-800">Info / Accent</div>
                <div className="text-[10px] font-mono text-sky-600">PROCESSING / SYNC</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Dynamic Theme Surfaces (Adapts on Theme Toggle)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <div className="text-xs font-bold text-[var(--text-primary)]">--background</div>
                <div className="text-[10px] text-[var(--text-muted)]">Base Page Canvas</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-xs font-bold text-[var(--text-primary)]">--surface</div>
                <div className="text-[10px] text-[var(--text-muted)]">Card & Panel Layer</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
                <div className="text-xs font-bold text-[var(--text-primary)]">--surface-raised</div>
                <div className="text-[10px] text-[var(--text-muted)]">Modal / Popover Layer</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)]">
                <div className="text-xs font-bold text-[var(--text-primary)]">--surface-hover</div>
                <div className="text-[10px] text-[var(--text-muted)]">Hover Interactive Tint</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Themed Checkboxes & Form Controls ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-brand-600" />
            <CardTitle>2. Themed Checkboxes & Form Inputs</CardTitle>
          </div>
          <CardDescription>
            All checkboxes and interactive controls automatically adhere to the Mercora brand red accent color.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Themed Checkbox Variants & States
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-3">
                <div className="text-xs font-bold text-[var(--text-primary)]">Interactive Controls</div>
                <Checkbox
                  label="Selected State"
                  description="Uses theme brand crimson (#ee3135)"
                  checked={chk1}
                  onChange={(e) => setChk1(e.target.checked)}
                />
                <Checkbox
                  label="Unchecked State"
                  description="Clean slate border with hover focus"
                  checked={chk2}
                  onChange={(e) => setChk2(e.target.checked)}
                />
                <Checkbox
                  label="Indeterminate State"
                  description="Used for parent select-all headers"
                  checked={chk3}
                  indeterminate={true}
                  onChange={(e) => setChk3(e.target.checked)}
                />
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-3">
                <div className="text-xs font-bold text-[var(--text-primary)]">Disabled Controls</div>
                <Checkbox
                  label="Disabled (Checked)"
                  description="Locked state for unauthorized actions"
                  checked={true}
                  disabled
                />
                <Checkbox
                  label="Disabled (Unchecked)"
                  description="Inactive without interaction"
                  checked={false}
                  disabled
                />
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-3">
                <div className="text-xs font-bold text-[var(--text-primary)]">Native Input & Focus Ring</div>
                <label className="flex items-center gap-2.5 text-xs font-semibold text-[var(--text-primary)] cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-gray-300 accent-brand-600 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                  <span>Native Input with `accent-brand-600`</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs font-semibold text-[var(--text-primary)] cursor-pointer">
                  <input
                    type="radio"
                    name="demo-radio"
                    defaultChecked
                    className="w-4 h-4 rounded-full border-gray-300 accent-brand-600 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                  <span>Native Radio with `accent-brand-600`</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Standard Inputs & Dropdowns
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="User Email Address"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helperText="We will send an automated invitation to this address."
              />
              <Input
                label="Validation Error State"
                value={inputError}
                onChange={(e) => setInputError(e.target.value)}
                error={!inputError ? "This field cannot be left blank." : undefined}
                placeholder="Type to resolve error..."
              />
              <Select
                label="Role Assignment"
                value={demoRole}
                onChange={(e) => setDemoRole(e.target.value)}
                options={[
                  { value: "SUPER_ADMIN", label: "Super Administrator (Master)" },
                  { value: "COMPANY_ADMIN", label: "Company Administrator" },
                  { value: "BUYER", label: "Standard Buyer" },
                  { value: "STAFF", label: "Operations Staff" },
                ]}
              />
              <Select
                label="Status Lifecycle"
                value={demoStatus}
                onChange={(e) => setDemoStatus(e.target.value)}
                options={[
                  { value: "ACTIVE", label: "ACTIVE - Fully Verified" },
                  { value: "INACTIVE", label: "INACTIVE - Soft Disabled" },
                  { value: "PENDING", label: "PENDING - Awaiting Verification" },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 3. Interactive Data Table with Themed Multi-Select & Bulk Actions ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <CardTitle>3. Standardized Multi-Select Data Table</CardTitle>
          </div>
          <CardDescription>
            Live demonstration of row selection, branded checkboxes, count pill, bulk action bar,
            column visibility picker, and row highlights.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <DataTable<SampleItem>
            tableKey="storybook-sample-table"
            data={filteredData}
            columns={sampleColumns}
            keyExtractor={(item) => item.id}
            searchQuery={tableSearch}
            onSearchChange={setTableSearch}
            searchPlaceholder="Search sample templates..."
            bulkActions={sampleBulkActions}
            defaultSortKey="name"
            defaultSortDir="asc"
            renderActions={(item) => (
              <button
                type="button"
                onClick={() => setSampleDeleteConfirm(item)}
                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          />
        </CardContent>
      </Card>

      {/* ── 4. Global Toast Notifications & Confirmation Modals ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-600" />
            <CardTitle>4. Global Toast Notifications & Confirmation Dialogs</CardTitle>
          </div>
          <CardDescription>
            Test global toast triggers and standardized confirmation modals with no browser `alert()` popups.
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
                onClick={() =>
                  addToast("success", "Action Completed", "Record has been updated successfully.")
                }
              >
                <CheckCircle className="w-4 h-4 text-emerald-600 mr-1.5" />
                Trigger Success Toast
              </Button>
              <Button
                variant="outline"
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
                onClick={() =>
                  addToast("error", "Action Failed", "Could not complete operation due to server validation.")
                }
              >
                <XCircle className="w-4 h-4 text-rose-600 mr-1.5" />
                Trigger Error Toast
              </Button>
              <Button
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() =>
                  addToast("warning", "Attention Required", "Record has pending dependencies.")
                }
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 mr-1.5" />
                Trigger Warning Toast
              </Button>
              <Button
                variant="outline"
                className="border-sky-200 text-sky-700 hover:bg-sky-50"
                onClick={() =>
                  addToast("info", "Background Sync", "Icegate sync completed in the background.")
                }
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
            <div className="flex flex-wrap gap-3">
              <Button
                variant="danger"
                onClick={() =>
                  setSampleDeleteConfirm({
                    id: "sample-item",
                    code: "TMPL_CUSTOM",
                    name: "Sample Email Template",
                    category: "DEMO",
                    status: "ACTIVE",
                    updatedAt: "2026-09-29",
                  })
                }
              >
                Open Delete Confirmation Modal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 5. Buttons Showcase ── */}
      <Card>
        <CardHeader>
          <CardTitle>5. Button Variations & Interactive States</CardTitle>
          <CardDescription>Different style variants, sizes, loading states, and icon integrations.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Variants</div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary">Primary Brand</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sizes</div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="sm" variant="primary">Small (sm)</Button>
              <Button size="md" variant="primary">Medium (md)</Button>
              <Button size="lg" variant="primary">Large (lg)</Button>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Interactive States</div>
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
          </div>
        </CardContent>
      </Card>

      {/* ── 6. Badges Showcase ── */}
      <Card>
        <CardHeader>
          <CardTitle>6. Badges & Indicators</CardTitle>
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

      {/* ── 7. Role-Wise Security Guard Demo ── */}
      <Card className="border-brand-100 bg-brand-50/20">
        <CardHeader>
          <CardTitle className="text-brand-900">7. Role-Wise Security Guard Demo</CardTitle>
          <CardDescription>
            Current Active Role in View: <span className="font-bold text-brand-700">{activePersona.roleName} ({activePersona.roleCode})</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Action Restricted to Super Admin:
            </div>
            <div className="flex gap-3 items-center">
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

      {/* ── Modal Instances ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(sampleDeleteConfirm)}
        onClose={() => setSampleDeleteConfirm(null)}
        entityName={sampleDeleteConfirm?.name}
        entityType="sample template"
        onConfirm={async () => {
          if (sampleDeleteConfirm) {
            setTableData((prev) => prev.filter((d) => d.id !== sampleDeleteConfirm.id));
            addToast("success", "Template Deleted", `${sampleDeleteConfirm.name} has been removed.`);
            setSampleDeleteConfirm(null);
          }
        }}
      />

      <DeleteConfirmDialog
        isOpen={Boolean(sampleBulkDelete && sampleBulkDelete.length > 0)}
        onClose={() => setSampleBulkDelete(null)}
        isBulk={true}
        count={sampleBulkDelete?.length || 0}
        entityType="sample template"
        onConfirm={async () => {
          if (sampleBulkDelete) {
            setTableData((prev) => prev.filter((d) => !sampleBulkDelete.includes(d.id)));
            addToast("success", "Bulk Delete Completed", `Successfully removed ${sampleBulkDelete.length} templates.`);
            setSampleBulkDelete(null);
          }
        }}
      />

      <StatusConfirmDialog
        isOpen={Boolean(sampleBulkStatus)}
        onClose={() => setSampleBulkStatus(null)}
        isBulk={true}
        count={sampleBulkStatus?.ids.length || 0}
        entityType="sample template"
        targetStatus={sampleBulkStatus?.targetStatus || "ACTIVE"}
        onConfirm={async () => {
          if (sampleBulkStatus) {
            setTableData((prev) =>
              prev.map((item) =>
                sampleBulkStatus.ids.includes(item.id)
                  ? { ...item, status: sampleBulkStatus.targetStatus as any }
                  : item
              )
            );
            addToast(
              "success",
              "Status Updated",
              `Updated status to ${sampleBulkStatus.targetStatus} for ${sampleBulkStatus.ids.length} records.`
            );
            setSampleBulkStatus(null);
          }
        }}
      />
    </div>
  );
};
