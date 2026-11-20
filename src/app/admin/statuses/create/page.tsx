"use client";

import React from "react";
import { PageHeader } from "../../../../components/layout/PageHeader";
import { StatusForm } from "../../../../components/status/StatusForm";

export default function CreateStatusPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Create Status"
        description="Register a new lifecycle status record for a specific domain type."
        backHref="/admin/statuses"
      />

      <StatusForm
        mode="create"
        onSubmit={async (_data) => {
          // Status create endpoint
        }}
      />
    </div>
  );
}
