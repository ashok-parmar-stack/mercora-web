"use client";

import React, { useEffect, useState } from "react";
import { Users, Loader2 } from "lucide-react";
import { Badge, Button, Modal } from "@/components/common";
import { extractErrorMessage } from "@/lib/http/client";
import { formatCurrencyMinor } from "@/lib/format";
import { fetchAdminPlanSubscribers } from "../../api/subscription-api";
import type { SubscriptionPlan } from "../../types";

interface AdminPlanSubscribersModalProps {
  plan: SubscriptionPlan | null;
  onClose: () => void;
}

export function AdminPlanSubscribersModal({ plan, onClose }: AdminPlanSubscribersModalProps) {
  const [subscribers, setSubscribers] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!plan) return;
    setPage(1);
  }, [plan]);

  useEffect(() => {
    if (!plan) return;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    fetchAdminPlanSubscribers(plan.id, { page, limit: 15 }, ctrl.signal)
      .then((res) => {
        setSubscribers(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setError(extractErrorMessage(err));
        }
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [plan, page]);

  return (
    <Modal
      isOpen={Boolean(plan)}
      onClose={onClose}
      title={plan ? `Subscribers — ${plan.name}` : "Plan Subscribers"}
      description="Businesses that have purchased or subscribed to this plan."
      maxWidth="2xl"
    >
      <div className="space-y-4 pt-2">
        {loading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-sm text-text-muted">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Loading subscribed businesses...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-xs">{error}</div>
        ) : subscribers.length === 0 ? (
          <div className="py-10 text-center space-y-2 text-text-muted">
            <Users className="w-8 h-8 mx-auto opacity-50" />
            <p className="text-sm font-medium text-text-primary">No subscribers yet</p>
            <p className="text-xs">No businesses have subscribed to this plan yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border overflow-hidden max-h-[55vh] overflow-y-auto">
            {subscribers.map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-surface"
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {sub.businessName || sub.businessId}
                  </p>
                  <p className="text-xs text-text-muted">
                    {sub.userEmail || sub.userName || "Account owner"} • Snapshot:{" "}
                    {formatCurrencyMinor(sub.amountMinor, sub.currency || plan?.currency)}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="text-right text-text-muted">
                    <div>
                      Expires: {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString("en-IN") : "—"}
                    </div>
                  </div>
                  <Badge
                    variant={
                      sub.status === "ACTIVE"
                        ? "success"
                        : sub.status === "PAST_DUE"
                        ? "warning"
                        : sub.status === "CANCELLED" || sub.status === "EXPIRED"
                        ? "danger"
                        : "neutral"
                    }
                    size="sm"
                  >
                    {sub.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-text-muted">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
