import React from "react";
import { AdminTransactionsView } from "@/features/subscriptions/components/admin/AdminTransactionsView";

export default function AdminSuccessfulPaymentsPage() {
  return (
    <AdminTransactionsView
      title="Successful Payments"
      description="Captured and server-verified Razorpay subscription payments with issued tax invoices."
      fixedStatus="CAPTURED"
    />
  );
}
