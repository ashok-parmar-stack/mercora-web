"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Download,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  PageHeader,
  Badge,
  Button,
  Input,
  Select,
  Textarea,
  Skeleton,
  ErrorState,
  Modal,
} from "@/components/common";
import { extractErrorMessage } from "@/lib/http/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { hasPermission } from "@/lib/auth-helpers";
import {
  downloadInvoicePdf,
  fetchAdminPaymentDetails,
  initiateAdminRefund,
} from "@/features/subscriptions/api/subscription-api";
import type { PaymentDetailRecord } from "@/features/subscriptions/types";

export default function AdminPaymentDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const user = useAuthStore((s) => s.user);
  const canRefund = hasPermission(user, "PAYMENTS.REFUND");

  const [payment, setPayment] = useState<PaymentDetailRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Refund dialog state
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundAmountInr, setRefundAmountInr] = useState("");
  const [refundSpeed, setRefundSpeed] = useState<"normal" | "optimum">("normal");
  const [refundReason, setRefundReason] = useState("");
  const [refunding, setRefunding] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);

  const loadPayment = useCallback(
    (signal?: AbortSignal) => {
      if (!id) return;
      setLoading(true);
      setError(null);
      fetchAdminPaymentDetails(id, signal)
        .then((res) => setPayment(res))
        .catch((err) => {
          if (err?.name !== "AbortError") setError(extractErrorMessage(err));
        })
        .finally(() => setLoading(false));
    },
    [id]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    loadPayment(ctrl.signal);
    return () => ctrl.abort();
  }, [loadPayment]);

  const remainingRefundableMinor = payment
    ? Math.max(0, (payment.amountMinor || 0) - (payment.refundedAmountMinor || 0))
    : 0;

  const isRefundable =
    Boolean(payment) &&
    remainingRefundableMinor > 0 &&
    (payment?.paymentStatus === "CAPTURED" || payment?.paymentStatus === "PARTIALLY_REFUNDED");

  const handleOpenRefund = () => {
    setRefundError(null);
    setRefundAmountInr((remainingRefundableMinor / 100).toFixed(2));
    setRefundReason("");
    setRefundSpeed("normal");
    setRefundOpen(true);
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payment) return;
    if (!refundReason.trim() || refundReason.trim().length < 3) {
      setRefundError("Please enter a valid audit reason (minimum 3 characters).");
      return;
    }

    const numericInr = Number(refundAmountInr);
    if (Number.isNaN(numericInr) || numericInr <= 0) {
      setRefundError("Refund amount must be greater than ₹0.");
      return;
    }

    setRefunding(true);
    setRefundError(null);
    try {
      await initiateAdminRefund(payment.id, {
        amountMinor: Math.round(numericInr * 100),
        reason: refundReason.trim(),
        speed: refundSpeed,
      });
      setRefundOpen(false);
      loadPayment();
    } catch (err) {
      setRefundError(extractErrorMessage(err));
    } finally {
      setRefunding(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!payment?.invoice) return;
    setDownloading(true);
    try {
      await downloadInvoicePdf(payment.invoice.id, payment.invoice.invoiceNumber);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Transaction Details"
        description={payment?.gatewayOrderId ? `Razorpay Order: ${payment.gatewayOrderId}` : "Gateway & subscription inspection"}
        backHref="/admin/payments/transactions"
        extraActions={
          <div className="flex items-center gap-2">
            {payment?.invoice && (
              <Button
                size="sm"
                variant="outline"
                disabled={downloading}
                onClick={handleDownloadInvoice}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                {downloading ? "Downloading..." : "Invoice PDF"}
              </Button>
            )}
            {canRefund && isRefundable && (
              <Button
                size="sm"
                variant="danger"
                onClick={handleOpenRefund}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Issue Refund
              </Button>
            )}
          </div>
        }
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-60 rounded-2xl" />
        </div>
      ) : error || !payment ? (
        <ErrorState
          title="Unable to inspect transaction"
          message={error || "Transaction record was not found."}
          onRetry={() => loadPayment()}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Core Transaction Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-text-muted">Transaction Amount</span>
                  <div className="text-2xl font-extrabold text-text-primary">
                    ₹{Number(payment.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}{" "}
                    <span className="text-xs font-normal text-text-muted">{payment.currency}</span>
                  </div>
                </div>
                <Badge
                  variant={
                    payment.paymentStatus === "CAPTURED"
                      ? "success"
                      : payment.paymentStatus === "FAILED" || payment.paymentStatus === "REFUNDED"
                      ? "danger"
                      : "warning"
                  }
                >
                  {payment.paymentStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-border">
                <div>
                  <span className="text-text-muted">Mercora Payment ID</span>
                  <p className="font-mono text-text-primary mt-0.5 break-all">{payment.id}</p>
                </div>
                <div>
                  <span className="text-text-muted">Gateway &amp; Method</span>
                  <p className="font-medium text-text-primary mt-0.5">
                    {payment.gateway.toUpperCase()} • {payment.paymentMethod || "Pending / N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Razorpay Order ID</span>
                  <p className="font-mono text-text-primary mt-0.5">
                    {payment.gatewayOrderId || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Razorpay Payment ID</span>
                  <p className="font-mono text-text-primary mt-0.5">
                    {payment.gatewayPaymentId || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">HMAC Signature Verified</span>
                  <p className="mt-0.5 flex items-center gap-1 font-semibold text-text-primary">
                    {payment.signatureVerified ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-status-success" /> Yes (Server Verified)
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-status-warning" /> Pending / Unverified
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Captured At</span>
                  <p className="mt-0.5 text-text-primary">
                    {payment.paidAt ? new Date(payment.paidAt).toLocaleString("en-IN") : "Not captured"}
                  </p>
                </div>
              </div>

              {payment.failureReason && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                  <strong>Gateway Failure ({payment.failureCode || "ERR"}):</strong>{" "}
                  {payment.failureReason}
                </div>
              )}
            </div>

            {/* Payment Attempts Timeline */}
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-text-primary">Gateway Attempts Timeline</h2>
              {(payment.attempts || []).length === 0 ? (
                <p className="text-xs text-text-muted">No gateway attempts logged yet.</p>
              ) : (
                <div className="space-y-3">
                  {(payment.attempts || []).map((att) => (
                    <div
                      key={att.id}
                      className="p-3 rounded-xl border border-border flex flex-wrap items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-text-primary">
                          Attempt #{att.attemptNumber}
                        </span>{" "}
                        <span className="text-text-muted font-mono">
                          ({att.gatewayPaymentId || att.gatewayOrderId || "order init"})
                        </span>
                        {att.failureReason && (
                          <p className="text-destructive mt-0.5">{att.failureReason}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            att.status === "CAPTURED"
                              ? "success"
                              : att.status === "FAILED"
                              ? "danger"
                              : "neutral"
                          }
                          size="sm"
                        >
                          {att.status}
                        </Badge>
                        <span className="text-text-muted">
                          {new Date(att.createdAt).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Refunds History */}
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-text-primary">Refund Ledger</h2>
                <span className="text-xs text-text-muted">
                  Refunded so far: ₹{Number(payment.refundedAmount || 0).toLocaleString("en-IN")}
                </span>
              </div>
              {(payment.refunds || []).length === 0 ? (
                <p className="text-xs text-text-muted">No refunds issued against this payment.</p>
              ) : (
                <div className="space-y-2.5">
                  {(payment.refunds || []).map((rf) => (
                    <div
                      key={rf.id}
                      className="p-3 rounded-xl border border-border flex flex-wrap items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-text-primary">
                          ₹{Number(rf.amount).toLocaleString("en-IN")} •{" "}
                          <span className="font-mono text-text-muted">
                            {rf.gatewayRefundId || rf.id.slice(0, 8)}
                          </span>
                        </p>
                        <p className="text-text-secondary mt-0.5">{rf.reason}</p>
                      </div>
                      <Badge
                        variant={
                          rf.status === "PROCESSED"
                            ? "success"
                            : rf.status === "FAILED"
                            ? "danger"
                            : "warning"
                        }
                        size="sm"
                      >
                        {rf.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Business, Subscription, Invoice */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-2.5 text-xs">
              <h3 className="text-sm font-bold text-text-primary">Business Account</h3>
              <p className="font-semibold text-text-primary">
                {payment.business?.name || payment.businessName || payment.businessId}
              </p>
              <p className="text-text-muted">
                {[payment.business?.city, payment.business?.state].filter(Boolean).join(", ")}
              </p>
              {payment.business?.gstin && (
                <p className="font-mono text-text-secondary">GSTIN: {payment.business.gstin}</p>
              )}
              <p className="text-text-secondary">
                Initiated by: {payment.user?.name || payment.user?.email || payment.userEmail || "—"}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-2.5 text-xs">
              <h3 className="text-sm font-bold text-text-primary">Linked Subscription</h3>
              <p className="font-semibold text-text-primary">
                {payment.subscription?.planSnapshot?.name || payment.planName || "—"}
              </p>
              <div className="flex items-center gap-2">
                <span>Status:</span>
                <Badge variant="neutral" size="sm">
                  {payment.subscription?.status || "—"}
                </Badge>
              </div>
              {payment.subscription?.startsAt && (
                <p className="text-text-muted">
                  Period: {new Date(payment.subscription.startsAt).toLocaleDateString("en-IN")} →{" "}
                  {payment.subscription.expiresAt
                    ? new Date(payment.subscription.expiresAt).toLocaleDateString("en-IN")
                    : "—"}
                </p>
              )}
            </div>

            {payment.invoice && (
              <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary">Tax Invoice</h3>
                  <Badge variant="success" size="sm">
                    <CheckCircle2 className="w-3 h-3" /> {payment.invoice.status}
                  </Badge>
                </div>
                <p className="font-mono font-semibold text-text-primary">
                  {payment.invoice.invoiceNumber}
                </p>
                <div className="space-y-1 text-text-muted">
                  <div>Subtotal: ₹{Number(payment.invoice.subtotal).toLocaleString("en-IN")}</div>
                  <div>GST: ₹{Number(payment.invoice.taxAmount).toLocaleString("en-IN")}</div>
                  <div className="font-semibold text-text-primary">
                    Total: ₹{Number(payment.invoice.totalAmount).toLocaleString("en-IN")}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  disabled={downloading}
                  onClick={handleDownloadInvoice}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download GST Invoice PDF</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Restricted Refund Modal */}
      <Modal
        isOpen={refundOpen}
        onClose={() => setRefundOpen(false)}
        title="Initiate Razorpay Refund"
        description={`Maximum refundable balance: ₹${(remainingRefundableMinor / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
      >
        <form onSubmit={handleRefundSubmit} className="space-y-4 pt-2">
          {refundError && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{refundError}</span>
            </div>
          )}

          <Input
            label="Refund Amount (INR)"
            type="number"
            min="1"
            step="0.01"
            max={(remainingRefundableMinor / 100).toFixed(2)}
            value={refundAmountInr}
            onChange={(e) => setRefundAmountInr(e.target.value)}
            required
          />

          <Select
            label="Razorpay Refund Speed"
            value={refundSpeed}
            onChange={(e) => setRefundSpeed(e.target.value as "normal" | "optimum")}
            options={[
              { value: "normal", label: "Normal (5-7 business days)" },
              { value: "optimum", label: "Optimum (Instant where supported)" },
            ]}
          />

          <Textarea
            label="Refund Reason (Required for Audit Log)"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="e.g., Duplicate payment or customer request approved"
            rows={3}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setRefundOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" disabled={refunding}>
              {refunding ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>Confirm Refund</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
