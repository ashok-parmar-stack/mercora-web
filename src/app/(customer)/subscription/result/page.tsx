"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { CustomerSubHeader } from "@/components/layout/CustomerSubHeader";
import {
  Badge,
  Button,
  Card,
  CardContent,
  ErrorState,
  LoadingState,
} from "@/components/common";
import { useAbortableFetch } from "@/lib/hooks/useAbortableFetch";
import { useUIStore } from "@/lib/store/ui-store";
import { extractErrorMessage } from "@/lib/http/client";
import {
  downloadInvoicePdf,
  fetchPaymentStatus,
} from "@/features/subscriptions/api/subscription-api";
import {
  formatInrMinor,
  formatSubscriptionDate,
} from "@/features/subscriptions/utils/razorpay-checkout";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const addToast = useUIStore((s) => s.addToast);

  const paymentId = searchParams.get("paymentId") || "";
  const outcomeHint = searchParams.get("outcome") || "";
  const alreadyCompletedHint = searchParams.get("alreadyCompleted") === "1";
  const reasonHint = searchParams.get("reason") || "";

  const [statusData, setStatusData] = useState<Record<string, any> | null>(null);
  const [downloading, setDownloading] = useState(false);

  const { isLoading, error, load } = useAbortableFetch(async (signal) => {
    if (!paymentId) return;
    const data = await fetchPaymentStatus(paymentId, signal);
    setStatusData(data);
  }, [paymentId]);

  const handleDownloadInvoice = async () => {
    if (!statusData?.invoiceId) return;
    setDownloading(true);
    try {
      await downloadInvoicePdf(statusData.invoiceId, statusData.invoiceNumber);
    } catch (err) {
      addToast("error", "Download Failed", extractErrorMessage(err));
    } finally {
      setDownloading(false);
    }
  };

  if (!paymentId) {
    return (
      <>
        <CustomerSubHeader
          icon={<CheckCircle2 className="w-5 h-5 text-primary" />}
          title="Payment Result"
          backHref="/subscription"
          backLabel="Subscription"
        />
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12">
          <ErrorState
            title="Payment Reference Missing"
            message="No payment identifier was provided to verify."
          />
        </main>
      </>
    );
  }

  const backendStatus = String(statusData?.paymentStatus || "").toUpperCase();
  const isSuccess =
    backendStatus === "CAPTURED" ||
    backendStatus === "REFUNDED" ||
    backendStatus === "PARTIALLY_REFUNDED";
  const isFailed = backendStatus === "FAILED" || (!isSuccess && outcomeHint === "failed");
  const isCancelled = !isSuccess && !isFailed && outcomeHint === "cancelled";
  const isPending = !isSuccess && !isFailed && !isCancelled;

  return (
    <>
      <CustomerSubHeader
        icon={<CheckCircle2 className="w-5 h-5 text-primary" />}
        title="Payment Verification & Result"
        backHref="/subscription"
        backLabel="Subscription"
      />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-10">
        {isLoading ? (
          <Card className="border border-border">
            <CardContent className="p-10 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
              <h2 className="text-lg font-bold text-text-primary">
                Payment Verification in Progress
              </h2>
              <p className="text-xs text-text-muted">
                Confirming payment status directly with Mercora backend...
              </p>
            </CardContent>
          </Card>
        ) : error ? (
          <ErrorState
            title="Unable to Fetch Payment Status"
            message={error}
            onRetry={load}
          />
        ) : (
          <Card className="border border-border shadow-xs">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-3">
                {isSuccess ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <Badge variant="success" size="sm">
                      {alreadyCompletedHint ? "Already Completed Payment" : "Payment Successful"}
                    </Badge>
                    <h2 className="text-2xl font-black text-text-primary">
                      {alreadyCompletedHint
                        ? "Payment Already Confirmed"
                        : "Subscription Activated!"}
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Confirmed via server verification for{" "}
                      <strong>{statusData?.planName || "your plan"}</strong>.
                    </p>
                  </>
                ) : isFailed ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-destructive flex items-center justify-center mx-auto">
                      <XCircle className="w-8 h-8" />
                    </div>
                    <Badge variant="danger" size="sm">
                      Payment Failed
                    </Badge>
                    <h2 className="text-2xl font-black text-text-primary">
                      Payment Could Not Be Completed
                    </h2>
                    <p className="text-xs text-text-secondary">
                      {statusData?.failureReason ||
                        reasonHint ||
                        "The transaction was declined by the payment gateway or bank."}
                    </p>
                  </>
                ) : isCancelled ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <Badge variant="warning" size="sm">
                      Payment Cancelled
                    </Badge>
                    <h2 className="text-2xl font-black text-text-primary">
                      Checkout Was Cancelled
                    </h2>
                    <p className="text-xs text-text-secondary">
                      You closed Razorpay Checkout before completing payment. Your order remains
                      pending if you wish to resume.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto">
                      <Clock className="w-8 h-8" />
                    </div>
                    <Badge variant="info" size="sm">
                      Payment Pending ({backendStatus || "PENDING"})
                    </Badge>
                    <h2 className="text-2xl font-black text-text-primary">
                      Awaiting Bank Confirmation
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Your payment has not yet been confirmed as captured. Once Razorpay confirms
                      capture via verification or webhook, your subscription will activate
                      automatically.
                    </p>
                  </>
                )}
              </div>

              {statusData && (
                <div className="rounded-2xl border border-border bg-background-secondary/70 p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Payment ID</span>
                    <span className="font-mono text-text-primary">{statusData.paymentId}</span>
                  </div>
                  {statusData.gatewayPaymentId && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Razorpay Reference</span>
                      <span className="font-mono text-text-primary">
                        {statusData.gatewayPaymentId}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-text-muted">Amount</span>
                    <strong className="font-data text-text-primary">
                      {formatInrMinor(statusData.amountMinor)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Subscription Status</span>
                    <strong className="text-text-primary">
                      {statusData.subscriptionStatus || "—"}
                    </strong>
                  </div>
                  {statusData.expiresAt && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Valid Until</span>
                      <span className="text-text-primary">
                        {formatSubscriptionDate(statusData.expiresAt)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {isSuccess && statusData?.invoiceId && (
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    isLoading={downloading}
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={handleDownloadInvoice}
                  >
                    Download Invoice ({statusData.invoiceNumber})
                  </Button>
                )}

                {isPending && (
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                    onClick={load}
                  >
                    Refresh Backend Status
                  </Button>
                )}

                {(isFailed || isCancelled) && statusData?.subscriptionId && (
                  <Button variant="outline" size="md" asChild>
                    <Link
                      href={`/subscription/checkout?subscriptionId=${encodeURIComponent(
                        statusData.subscriptionId
                      )}&mode=retry`}
                    >
                      Retry Payment
                    </Link>
                  </Button>
                )}

                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  asChild
                >
                  <Link href="/subscription">Go to My Subscription</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading payment result..." />}>
      <PaymentResultContent />
    </Suspense>
  );
}
