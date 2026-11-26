"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, Send, CheckCircle2, XCircle } from "lucide-react";
import {
  BulkAction,
  DataTable,
  DeleteConfirmDialog,
  ErrorState,
  LoadingState,
  PageHeader,
  StatusConfirmDialog,
  Tooltip,
} from "@/components/common";
import { useAbortableFetch } from "@/lib/hooks/useAbortableFetch";
import { useTableState } from "@/lib/hooks/useTableState";
import { adminV1Client, extractErrorMessage } from "@/lib/http/client";
import { useUIStore } from "../../../lib/store/ui-store";
import { EmailTemplate, emailTemplateColumns } from "./email-template-columns";

export default function EmailTemplatesPage() {
  const { search, setSearch } = useTableState({ defaultPageSize: 10 });
  const [data, setData] = useState<EmailTemplate[]>([]);
  const [deletingTemplate, setDeletingTemplate] = useState<EmailTemplate | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{
    ids: string[];
    targetStatus: "ACTIVE" | "INACTIVE";
  } | null>(null);

  const addToast = useUIStore((s) => s.addToast);
  const clearSelection = useUIStore((s) => s.clearSelection);

  const { isLoading: loading, error, load: loadTemplates } = useAbortableFetch(
    async (signal) => {
      const res = await adminV1Client.get<{ data?: EmailTemplate[] }>(
        "/email-templates",
        { signal }
      );
      setData(res.data?.data || []);
    },
    []
  );

  const filtered = data.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q)
    );
  });

  const renderActions = (t: EmailTemplate) => (
    <div className="flex items-center gap-1">
      <Tooltip content="Send Test Email">
        <button
          onClick={() => addToast("success", "Test Dispatched", `Test email sent for ${t.name}`)}
          className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
          aria-label="Send test email"
        >
          <Send className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip content="Edit Template">
        <button
          onClick={() => addToast("info", "Edit Template", `Editing ${t.name}`)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Edit template"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip content="Delete Template">
        <button
          onClick={() => setDeletingTemplate(t)}
          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
          aria-label="Delete template"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );

  const bulkActions: BulkAction<EmailTemplate>[] = [
    {
      label: "Activate Selected",
      variant: "primary",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      onClick: async (selectedIds) => {
        setBulkStatusConfirm({ ids: selectedIds, targetStatus: "ACTIVE" });
      },
    },
    {
      label: "Deactivate Selected",
      variant: "secondary",
      icon: <XCircle className="w-3.5 h-3.5" />,
      onClick: async (selectedIds) => {
        setBulkStatusConfirm({ ids: selectedIds, targetStatus: "INACTIVE" });
      },
    },
    {
      label: "Delete Selected",
      variant: "danger",
      icon: <Trash2 className="w-3.5 h-3.5" />,
      onClick: async (selectedIds) => {
        setBulkDeletingIds(selectedIds);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Email Templates"
        description="Configure transactional notification messages and customized localization templates."
        actionButton={{
          label: "New Template",
          onClick: () => addToast("info", "Template Editor", "Opening template editor..."),
          icon: <Plus className="w-4 h-4" />,
        }}
      />

      {loading ? (
        <LoadingState message="Loading email templates..." />
      ) : error ? (
        <ErrorState
          title="Unable to Load Templates"
          message={error}
          onRetry={loadTemplates}
        />
      ) : (
        <DataTable<EmailTemplate>
          tableKey="email-templates-table"
          data={filtered}
          columns={emailTemplateColumns}
          keyExtractor={(t) => t.id}
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search templates by code, subject, or name..."
          renderActions={renderActions}
          bulkActions={bulkActions}
          emptyTitle="No Email Templates Found"
          emptyDescription={search ? `No templates match "${search}".` : "No system notification templates are currently defined."}
        />
      )}

      <DeleteConfirmDialog
        isOpen={Boolean(deletingTemplate)}
        onClose={() => setDeletingTemplate(null)}
        entityName={deletingTemplate?.name}
        entityType="email template"
        onConfirm={async () => {
          if (deletingTemplate) {
            try {
              await adminV1Client.delete(`/email-templates/${deletingTemplate.id}`);
              setData((prev) => prev.filter((item) => item.id !== deletingTemplate.id));
              addToast("success", "Template Deleted", `${deletingTemplate.name} removed.`);
            } catch (err: any) {
              addToast("error", "Delete Failed", extractErrorMessage(err, "Could not delete template."));
            } finally {
              setDeletingTemplate(null);
            }
          }
        }}
      />

      <DeleteConfirmDialog
        isOpen={Boolean(bulkDeletingIds && bulkDeletingIds.length > 0)}
        onClose={() => setBulkDeletingIds(null)}
        isBulk={true}
        count={bulkDeletingIds?.length || 0}
        entityType="email template"
        onConfirm={async () => {
          if (bulkDeletingIds) {
            try {
              await adminV1Client.post("/email-templates/bulk-delete", { ids: bulkDeletingIds });
              setData((prev) => prev.filter((d) => !bulkDeletingIds.includes(d.id)));
              clearSelection("email-templates-table");
              addToast("success", "Bulk Action", `Deleted ${bulkDeletingIds.length} email templates.`);
            } catch (err: any) {
              addToast("error", "Bulk Delete Failed", extractErrorMessage(err, "Could not delete templates."));
            } finally {
              setBulkDeletingIds(null);
            }
          }
        }}
      />

      <StatusConfirmDialog
        isOpen={Boolean(bulkStatusConfirm)}
        onClose={() => setBulkStatusConfirm(null)}
        isBulk={true}
        count={bulkStatusConfirm?.ids.length || 0}
        entityType="email template"
        targetStatus={bulkStatusConfirm?.targetStatus || "ACTIVE"}
        onConfirm={async () => {
          if (bulkStatusConfirm) {
            try {
              await adminV1Client.patch("/email-templates/bulk-status", {
                ids: bulkStatusConfirm.ids,
                status: bulkStatusConfirm.targetStatus,
              });
              setData((prev) =>
                prev.map((t) =>
                  bulkStatusConfirm.ids.includes(t.id)
                    ? { ...t, status: bulkStatusConfirm.targetStatus }
                    : t
                )
              );
              clearSelection("email-templates-table");
              addToast("success", "Status Updated", `Updated status for ${bulkStatusConfirm.ids.length} email templates.`);
            } catch (err: any) {
              addToast("error", "Update Failed", extractErrorMessage(err, "Could not update template status."));
            } finally {
              setBulkStatusConfirm(null);
            }
          }
        }}
      />
    </div>
  );
}
