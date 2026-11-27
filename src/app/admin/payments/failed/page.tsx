import React from "react";
import { AdminTransactionsView } from "@/features/subscriptions/components/admin/AdminTransactionsView";

export default function AdminFailedPaymentsPage() {
  return (
    <AdminTransactionsView
      title="Failed Payments"
      description="Declined, timed-out, or gateway-rejected payment attempts with sanitized error reasons."
      fixedStatus="FAILED"
    />
  );
}
