import React from "react";
import { AdminTransactionsView } from "@/features/subscriptions/components/admin/AdminTransactionsView";

export default function AdminAllTransactionsPage() {
  return (
    <AdminTransactionsView
      title="All Payment Transactions"
      description="Filter, inspect, reconcile, refund, and export every Razorpay subscription payment."
    />
  );
}
