import { adminV1Client, apiHttpClient, v1HttpClient } from "@/lib/http/client";
import type {
  AdminPaymentAnalytics,
  BillingDetails,
  BusinessSubscriptionOverview,
  CheckoutOrderPayload,
  GenerateSystemPlansResult,
  InvoiceRecord,
  PaymentDetailRecord,
  PaymentRecord,
  PaymentSettingsData,
  PlanFeatureGroup,
  PlanLimits,
  RefundRecord,
  SubscriptionPlan,
  SubscriptionRecord,
  SystemPlanTemplate,
  VerifyPaymentResponse,
} from "../types";

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ── Public & Business APIs ───────────────────────────────────────────────────

export async function fetchActivePlans(signal?: AbortSignal): Promise<SubscriptionPlan[]> {
  const res = await v1HttpClient.get<{ data: SubscriptionPlan[] }>("/subscription-plans", {
    signal,
  });
  return res.data?.data || [];
}

export async function fetchPlanById(
  id: string,
  signal?: AbortSignal
): Promise<SubscriptionPlan> {
  const res = await v1HttpClient.get<{ data: SubscriptionPlan }>(
    `/subscription-plans/${encodeURIComponent(id)}`,
    { signal }
  );
  return res.data.data;
}

export async function fetchOwnedBusinesses(signal?: AbortSignal) {
  const res = await apiHttpClient.get<{ data: Array<Record<string, any>> }>(
    "/customer/businesses",
    { signal }
  );
  return res.data?.data || [];
}

export async function fetchBusinessEnquiries(businessId: string, signal?: AbortSignal) {
  const res = await apiHttpClient.get<{
    success: boolean;
    total: number;
    quota?: {
      allowed: boolean;
      used: number;
      limit: number;
      remaining: number;
      leadInboxAccess: boolean;
    };
    data: Array<{
      id: string;
      businessId: string;
      businessName: string;
      senderName: string;
      senderEmail: string | null;
      senderPhone: string;
      companyName?: string | null;
      message: string;
      status: string;
      source?: string;
      createdAt: string;
      lockedByPlanQuota?: boolean;
    }>;
  }>(`/customer/businesses/${encodeURIComponent(businessId)}/enquiries`, { signal });
  return res.data;
}

export async function fetchCurrentSubscription(
  businessId?: string,
  signal?: AbortSignal
): Promise<BusinessSubscriptionOverview> {
  const res = await v1HttpClient.get<{ data: BusinessSubscriptionOverview }>(
    "/subscriptions/current",
    { params: businessId ? { businessId } : undefined, signal }
  );
  return res.data.data;
}

export async function fetchSubscriptionHistory(
  params?: { businessId?: string; page?: number; limit?: number },
  signal?: AbortSignal
): Promise<PaginatedResponse<SubscriptionRecord>> {
  const res = await v1HttpClient.get<PaginatedResponse<SubscriptionRecord>>(
    "/subscriptions/history",
    { params, signal }
  );
  return res.data;
}

export async function checkoutSubscription(payload: {
  planId: string;
  businessId?: string;
  billingDetails?: BillingDetails;
  idempotencyKey?: string;
}): Promise<CheckoutOrderPayload> {
  const res = await v1HttpClient.post<{ data: CheckoutOrderPayload }>(
    "/subscriptions/checkout",
    payload
  );
  return res.data.data;
}

export async function renewSubscription(payload: {
  planId?: string;
  businessId?: string;
  billingDetails?: BillingDetails;
  idempotencyKey?: string;
}): Promise<CheckoutOrderPayload> {
  const res = await v1HttpClient.post<{ data: CheckoutOrderPayload }>(
    "/subscriptions/renew",
    payload
  );
  return res.data.data;
}

export async function upgradeSubscription(payload: {
  targetPlanId: string;
  businessId?: string;
  billingDetails?: BillingDetails;
  idempotencyKey?: string;
}): Promise<CheckoutOrderPayload> {
  const res = await v1HttpClient.post<{ data: CheckoutOrderPayload }>(
    "/subscriptions/upgrade",
    payload
  );
  return res.data.data;
}

export async function downgradeSubscription(payload: {
  targetPlanId: string;
  businessId?: string;
}) {
  const res = await v1HttpClient.post<{ data: Record<string, any> }>(
    "/subscriptions/downgrade",
    payload
  );
  return res.data.data;
}

export async function cancelSubscription(payload: {
  businessId?: string;
  cancelAtPeriodEnd?: boolean;
  reason?: string;
}) {
  const res = await v1HttpClient.post<{ data: Record<string, any> }>(
    "/subscriptions/cancel",
    payload
  );
  return res.data.data;
}

export async function createPaymentOrder(payload: {
  subscriptionId?: string;
  planId?: string;
  businessId?: string;
  billingDetails?: BillingDetails;
  idempotencyKey?: string;
}): Promise<CheckoutOrderPayload> {
  const res = await v1HttpClient.post<{ data: CheckoutOrderPayload }>(
    "/payments/create-order",
    payload
  );
  return res.data.data;
}

export async function verifyRazorpayPayment(payload: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<VerifyPaymentResponse> {
  const res = await v1HttpClient.post<{ data: VerifyPaymentResponse }>(
    "/payments/verify",
    payload
  );
  return res.data.data;
}

export async function fetchBusinessPayments(
  params?: {
    businessId?: string;
    status?: string;
    method?: string;
    search?: string;
    page?: number;
    limit?: number;
  },
  signal?: AbortSignal
): Promise<PaginatedResponse<PaymentRecord>> {
  const res = await v1HttpClient.get<PaginatedResponse<PaymentRecord>>("/payments", {
    params,
    signal,
  });
  return res.data;
}

export async function fetchPaymentDetails(
  id: string,
  signal?: AbortSignal
): Promise<PaymentDetailRecord> {
  const res = await v1HttpClient.get<{ data: PaymentDetailRecord }>(
    `/payments/${encodeURIComponent(id)}`,
    { signal }
  );
  return res.data.data;
}

export async function fetchPaymentStatus(id: string, signal?: AbortSignal) {
  const res = await v1HttpClient.get<{ data: Record<string, any> }>(
    `/payments/${encodeURIComponent(id)}/status`,
    { signal }
  );
  return res.data.data;
}

export async function fetchInvoices(
  params?: { page?: number; limit?: number },
  signal?: AbortSignal
): Promise<PaginatedResponse<InvoiceRecord>> {
  const res = await v1HttpClient.get<PaginatedResponse<InvoiceRecord>>("/invoices", {
    params,
    signal,
  });
  return res.data;
}

export async function downloadInvoicePdf(invoiceId: string, invoiceNumber?: string) {
  const res = await v1HttpClient.get<Blob>(
    `/invoices/${encodeURIComponent(invoiceId)}/download`,
    { responseType: "blob" }
  );
  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(invoiceNumber || invoiceId).replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Admin APIs ───────────────────────────────────────────────────────────────

export async function fetchAdminPlans(signal?: AbortSignal): Promise<SubscriptionPlan[]> {
  const res = await adminV1Client.get<{ data: SubscriptionPlan[] }>(
    "/subscription-plans",
    { signal }
  );
  return res.data?.data || [];
}

export async function fetchAdminPlanSubscribers(
  planId: string,
  params?: { page?: number; limit?: number },
  signal?: AbortSignal
) {
  const res = await adminV1Client.get<{
    plan: SubscriptionPlan;
    data: Array<Record<string, any>>;
    meta: { total: number; page: number; limit: number; totalPages: number };
  }>(`/subscription-plans/${encodeURIComponent(planId)}/subscribers`, { params, signal });
  return res.data;
}

export async function createAdminPlan(payload: {
  code: string;
  name: string;
  description?: string;
  label?: string;
  isPopular?: boolean;
  originalPrice?: number;
  originalPriceMinor?: number;
  price?: number;
  priceMinor?: number;
  currency?: string;
  billingInterval: string;
  durationDays: number;
  gstRateBps?: number;
  features: string[];
  featureGroups?: PlanFeatureGroup[];
  limits: PlanLimits;
  isActive?: boolean;
  displayOrder?: number;
}): Promise<SubscriptionPlan> {
  const res = await adminV1Client.post<{ data: SubscriptionPlan }>(
    "/subscription-plans",
    payload
  );
  return res.data.data;
}

export async function updateAdminPlan(
  id: string,
  payload: Partial<{
    name: string;
    description: string;
    label: string;
    isPopular: boolean;
    originalPrice: number;
    originalPriceMinor: number;
    price: number;
    priceMinor: number;
    billingInterval: string;
    durationDays: number;
    gstRateBps: number;
    features: string[];
    featureGroups: PlanFeatureGroup[];
    limits: PlanLimits;
    isActive: boolean;
    displayOrder: number;
  }>
): Promise<SubscriptionPlan> {
  const res = await adminV1Client.patch<{ data: SubscriptionPlan }>(
    `/subscription-plans/${encodeURIComponent(id)}`,
    payload
  );
  return res.data.data;
}

export async function fetchAdminSystemPlanTemplates(
  signal?: AbortSignal
): Promise<SystemPlanTemplate[]> {
  const res = await adminV1Client.get<{ data: SystemPlanTemplate[] }>(
    "/subscription-plans/system-templates",
    { signal }
  );
  return res.data?.data || [];
}

export async function generateAdminSystemPlans(payload?: {
  codes?: string[];
  syncFeatureGroups?: boolean;
}): Promise<GenerateSystemPlansResult> {
  const res = await adminV1Client.post<{ data: GenerateSystemPlansResult }>(
    "/subscription-plans/generate-system-plans",
    payload || {}
  );
  return res.data.data;
}

export async function fetchAdminPaymentAnalytics(
  months = 12,
  signal?: AbortSignal
): Promise<AdminPaymentAnalytics> {
  const res = await adminV1Client.get<{ data: AdminPaymentAnalytics }>(
    "/payment-analytics",
    { params: { months }, signal }
  );
  return res.data.data;
}

export async function fetchAdminPayments(
  params?: {
    status?: string;
    method?: string;
    gateway?: string;
    businessId?: string;
    planId?: string;
    search?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  },
  signal?: AbortSignal
): Promise<PaginatedResponse<PaymentRecord>> {
  const res = await adminV1Client.get<PaginatedResponse<PaymentRecord>>("/payments", {
    params,
    signal,
  });
  return res.data;
}

export async function fetchAdminPaymentDetails(
  id: string,
  signal?: AbortSignal
): Promise<PaymentDetailRecord> {
  const res = await adminV1Client.get<{ data: PaymentDetailRecord }>(
    `/payments/${encodeURIComponent(id)}`,
    { signal }
  );
  return res.data.data;
}

export async function exportAdminPaymentsCsv(params?: Record<string, any>) {
  const res = await adminV1Client.get<Blob>("/payments/export", {
    params,
    responseType: "blob",
  });
  const blob = new Blob([res.data], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mercora-payments-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function initiateAdminRefund(
  paymentId: string,
  payload: { amountMinor?: number; amount?: number; reason: string; speed?: "normal" | "optimum" }
): Promise<RefundRecord> {
  const res = await adminV1Client.post<{ data: RefundRecord }>(
    `/payments/${encodeURIComponent(paymentId)}/refund`,
    payload
  );
  return res.data.data;
}

export async function fetchAdminRefunds(
  params?: { status?: string; search?: string; page?: number; limit?: number },
  signal?: AbortSignal
): Promise<PaginatedResponse<RefundRecord>> {
  const res = await adminV1Client.get<PaginatedResponse<RefundRecord>>("/refunds", {
    params,
    signal,
  });
  return res.data;
}

export async function fetchAdminInvoices(
  params?: { search?: string; status?: string; businessId?: string; page?: number; limit?: number },
  signal?: AbortSignal
): Promise<PaginatedResponse<InvoiceRecord>> {
  const res = await adminV1Client.get<PaginatedResponse<InvoiceRecord>>("/invoices", {
    params,
    signal,
  });
  return res.data;
}

export async function fetchAdminSubscriptions(
  params?: {
    status?: string;
    planId?: string;
    businessId?: string;
    search?: string;
    expiringWithinDays?: number;
    page?: number;
    limit?: number;
  },
  signal?: AbortSignal
): Promise<PaginatedResponse<SubscriptionRecord>> {
  const res = await adminV1Client.get<PaginatedResponse<SubscriptionRecord>>(
    "/subscriptions",
    { params, signal }
  );
  return res.data;
}

export async function updateAdminSubscription(
  id: string,
  payload: { status?: string; extendDays?: number; cancelAtPeriodEnd?: boolean; reason?: string }
) {
  const res = await adminV1Client.patch<{ data: SubscriptionRecord }>(
    `/subscriptions/${encodeURIComponent(id)}`,
    payload
  );
  return res.data.data;
}

export async function runAdminSubscriptionMaintenance() {
  const res = await adminV1Client.post<{ data: Record<string, any> }>(
    "/subscriptions/run-maintenance"
  );
  return res.data.data;
}

export async function fetchAdminPaymentSettings(
  signal?: AbortSignal
): Promise<PaymentSettingsData> {
  const res = await adminV1Client.get<{ data: PaymentSettingsData }>(
    "/payment-settings",
    { signal }
  );
  return res.data.data;
}

export async function updateAdminPaymentSettings(
  payload: Partial<PaymentSettingsData["settings"]>
): Promise<PaymentSettingsData> {
  const res = await adminV1Client.patch<{ data: PaymentSettingsData }>(
    "/payment-settings",
    payload
  );
  return res.data.data;
}
