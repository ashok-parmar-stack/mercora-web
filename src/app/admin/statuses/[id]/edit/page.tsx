"use client";

import React from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "../../../../../components/layout/PageHeader";
import { StatusForm } from "../../../../../components/status/StatusForm";
import { useStatuses } from "../../../../../lib/hooks/useStatuses";

export default function EditStatusPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const { statuses, isLoading } = useStatuses();

  const status = statuses.find((s) => s.id === id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Loading Status..." backHref="/admin/statuses" />
        <div className="p-12 text-center text-sm text-gray-500 bg-white border border-gray-200 rounded-xl">
          Loading status details...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit Status: ${status?.name || id}`}
        description="Update status metadata and sort configuration."
        backHref="/admin/statuses"
      />

      <StatusForm
        mode="edit"
        initialStatus={status}
        onSubmit={async (_data) => {
          // Status update endpoint
        }}
      />
    </div>
  );
}
