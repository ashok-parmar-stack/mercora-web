import React from "react";
import { AdminTransactionsView } from "@/features/subscriptions/components/admin/AdminTransactionsView";

export default function AdminPendingPaymentsPage() {
  return (
    <AdminTransactionsView
      title="Pending Payments"
      description="Awaiting-capture or abandoned Razorpay orders eligible for automatic webhook or background reconciliation."
      fixedStatus="PENDING"
    />
  );
}
