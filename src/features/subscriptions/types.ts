export type BillingInterval =
  | "MONTHLY"
  | "QUARTERLY"
  | "SIX_MONTHS"
  | "YEARLY"
  | "CUSTOM";

export type SubscriptionStatus =
  | "PENDING"
  | "ACTIVE"
  | "PAST_DUE"
  | "EXPIRED"
  | "CANCELLED";

export type PaymentStatus =
  | "CREATED"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface PlanLimits {
  maxBusinessListings: number;
  maxProducts: number;
  maxEnquiriesPerMonth: number;
  maxContacts: number;
  featuredListing: boolean;
  verifiedPriority: boolean;
  leadInboxAccess: boolean;
  analyticsAccess: boolean;
  prioritySupport: boolean;
}

export interface PlanFeatureGroup {
  key: string;
  title: string;
  included: boolean;
  items: string[];
}

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  label: string | null;
  isPopular: boolean;
  originalPrice?: number | null;
  originalPriceMinor?: number | null;
  price: number;
  priceMinor: number;
  currency: string;
  billingInterval: BillingInterval | string;
  durationDays: number;
  gstRateBps: number;
  taxMinor: number;
  totalPriceMinor: number;
  totalPrice: number;
  features: string[];
  featureGroups?: PlanFeatureGroup[];
  limits: PlanLimits;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  activeSubscribersCount?: number;
  totalSubscriptionsCount?: number;
}

export interface SystemPlanTemplate {
  code: string;
  name: string;
  description: string | null;
  label: string | null;
  isPopular: boolean;
  originalPrice: number | null;
  originalPriceMinor: number | null;
  price: number;
  priceMinor: number;
  currency: string;
  billingInterval: BillingInterval | string;
  durationDays: number;
  gstRateBps: number;
  taxMinor: number;
  totalPriceMinor: number;
  totalPrice: number;
  features: string[];
  featureGroups: PlanFeatureGroup[];
  limits: PlanLimits;
  displayOrder: number;
}

export interface GenerateSystemPlansResult {
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
  plans: SubscriptionPlan[];
}

export interface PlanSnapshot extends PlanLimits {
  planId: string;
  code: string;
  name: string;
  description?: string | null;
  label?: string | null;
  priceMinor: number;
  originalPriceMinor?: number | null;
  currency: string;
  billingInterval: string;
  durationDays: number;
  gstRateBps: number;
  features: string[];
  featureGroups?: PlanFeatureGroup[];
  limits: PlanLimits;
  capturedAt: string;
}

export interface BusinessEntitlementSnapshot {
  businessId: string;
  businessName: string;
  hasActiveSubscription: boolean;
  isInGracePeriod: boolean;
  subscriptionId: string | null;
  subscriptionStatus: string;
  planId: string | null;
  planCode: string | null;
  planName: string;
  startsAt: string | null;
  expiresAt: string | null;
  limits: PlanLimits;
  usage: {
    businessListingsUsed: number;
    productsUsed: number;
    contactsUsed: number;
    enquiriesThisMonthUsed: number;
  };
  remaining: {
    businessListings: number;
    products: number;
    contacts: number;
    enquiriesThisMonth: number;
  };
}

export interface BillingDetails {
  billingName?: string;
  gstin?: string;
  state?: string;
  address?: string;
}

export interface SubscriptionRecord {
  id: string;
  businessId?: string | null;
  businessName?: string | null;
  businessCity?: string | null;
  businessState?: string | null;
  billingDetails?: BillingDetails | null;
  userId?: string;
  userName?: string | null;
  userEmail?: string | null;
  planId: string;
  planSnapshot: PlanSnapshot;
  status: SubscriptionStatus | string;
  subtotalMinor: number;
  taxMinor: number;
  amountMinor: number;
  currency: string;
  startsAt: string | null;
  expiresAt: string | null;
  graceUntil?: string | null;
  cancelAtPeriodEnd: boolean;
  cancelledAt: string | null;
  cancellationReason?: string | null;
  scheduledPlanId?: string | null;
  scheduledPlanSnapshot?: PlanSnapshot | null;
  scheduledChangeAt?: string | null;
  remainingDays?: number;
  remainingHours?: number;
  isExpired?: boolean;
  isExpiringSoon?: boolean;
  createdAt: string;
}

export interface BusinessSubscriptionOverview {
  hasBusiness: boolean;
  businesses: Array<{
    id: string;
    name: string;
    slug: string;
    city: string;
    state: string;
    verificationStatus: string;
  }>;
  selectedBusiness: {
    id: string;
    name: string;
    slug: string;
    city: string;
    state: string;
    gstin?: string | null;
    verificationStatus: string;
  } | null;
  subscription: SubscriptionRecord | null;
  entitlements: BusinessEntitlementSnapshot | null;
  actions: {
    canPurchase: boolean;
    canRenew: boolean;
    canUpgrade: boolean;
    canDowngrade: boolean;
    canCancel: boolean;
  };
}

export interface CheckoutOrderPayload {
  reused: boolean;
  subscriptionId: string;
  paymentId: string;
  gateway: string;
  keyId: string;
  orderId: string;
  currency: string;
  subtotalMinor: number;
  taxMinor: number;
  amountMinor: number;
  prorationCreditMinor: number;
  subtotal: number;
  taxAmount: number;
  amount: number;
  paymentType: string;
  plan: {
    id: string;
    code: string;
    name: string;
    billingInterval: string;
    durationDays: number;
  };
  business: {
    id: string | null;
    name: string;
    email?: string;
    phone?: string;
    state?: string;
    gstin?: string | null;
  };
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export interface VerifyPaymentResponse {
  verified: boolean;
  alreadyCompleted: boolean;
  pendingCapture?: boolean;
  paymentStatus: PaymentStatus | string;
  paymentId: string;
  gatewayPaymentId?: string | null;
  subscriptionId: string;
  subscriptionStatus?: string;
  startsAt?: string | null;
  expiresAt?: string | null;
  invoiceId?: string | null;
  invoiceNumber?: string | null;
  message?: string;
}

export interface PaymentRecord {
  id: string;
  businessId?: string | null;
  businessName: string | null;
  userId: string;
  userEmail: string | null;
  subscriptionId: string;
  planId: string | null;
  planName: string | null;
  billingInterval: string | null;
  gateway: string;
  paymentType: string;
  gatewayOrderId: string | null;
  gatewayPaymentId: string | null;
  signatureVerified: boolean;
  amountMinor: number;
  refundedAmountMinor: number;
  amount: number;
  refundedAmount: number;
  currency: string;
  paymentStatus: PaymentStatus | string;
  paymentMethod: string | null;
  paymentMethodDetails: Record<string, any> | null;
  failureCode: string | null;
  failureReason: string | null;
  invoiceId: string | null;
  invoiceNumber: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  businessId?: string | null;
  businessName: string | null;
  userId: string;
  subscriptionId: string;
  paymentId: string;
  gatewayPaymentId: string | null;
  gatewayOrderId: string | null;
  planName: string | null;
  billingInterval: string | null;
  subtotalMinor: number;
  taxMinor: number;
  cgstMinor: number;
  sgstMinor: number;
  igstMinor: number;
  totalMinor: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: string;
  sellerDetails: Record<string, any>;
  billingDetails: Record<string, any>;
  lineItems: Array<Record<string, any>>;
  invoiceDate: string;
  documentReference: string | null;
  createdAt: string;
}

export interface RefundRecord {
  id: string;
  paymentId: string;
  subscriptionId: string;
  businessId?: string | null;
  businessName: string | null;
  planName: string | null;
  gateway: string;
  gatewayRefundId: string | null;
  gatewayPaymentId?: string | null;
  amountMinor: number;
  amount: number;
  currency: string;
  status: string;
  reason: string;
  initiatedBy: string | null;
  refundedAt: string | null;
  createdAt: string;
}

export interface PaymentDetailRecord extends PaymentRecord {
  business?: Record<string, any> | null;
  user?: Record<string, any> | null;
  subscription?: Record<string, any> | null;
  invoice?: InvoiceRecord | null;
  attempts?: Array<{
    id: string;
    attemptNumber: number;
    status: string;
    gatewayOrderId: string | null;
    gatewayPaymentId: string | null;
    failureReason: string | null;
    createdAt: string;
  }>;
  refunds?: RefundRecord[];
}

export interface AdminPaymentAnalytics {
  kpis: {
    totalRevenueMinor: number;
    totalRevenue: number;
    netRevenueMinor: number;
    netRevenue: number;
    totalRefundedMinor: number;
    totalRefunded: number;
    totalRefundsCount: number;
    successfulTransactions: number;
    pendingTransactions: number;
    failedTransactions: number;
    activeSubscriptions: number;
    pastDueSubscriptions: number;
    expiredSubscriptions: number;
    cancelledSubscriptions: number;
    expiringSubscriptions: number;
  };
  charts: {
    monthlyRevenue: Array<{
      month: string;
      revenueMinor: number;
      revenue: number;
      refundMinor: number;
      refund: number;
    }>;
    transactionOutcomes: Array<{
      month: string;
      successful: number;
      pending: number;
      failed: number;
    }>;
    planDistribution: Array<{
      planName: string;
      planCode: string;
      activeCount: number;
      totalCount: number;
      revenueMinor: number;
      revenue: number;
    }>;
    subscriptionTrends: Array<{
      month: string;
      newSubscriptions: number;
      renewals: number;
      expirations: number;
    }>;
    refundTrend: Array<{
      month: string;
      count: number;
      amountMinor: number;
      amount: number;
    }>;
  };
}

export interface PaymentSettingsData {
  settings: {
    id: string;
    activeGateway: string;
    razorpayEnabled: boolean;
    defaultCurrency: string;
    defaultGstRateBps: number;
    gracePeriodDays: number;
    expiringReminderDays: number;
    upgradePolicy: "IMMEDIATE" | "END_OF_PERIOD";
    downgradePolicy: "END_OF_PERIOD" | "IMMEDIATE";
    refundRevokesAccess: boolean;
    schedulerEnabled: boolean;
    schedulerIntervalMs: number;
    reconcilePendingMinutes: number;
    invoicePrefix: string;
    companyLegalName: string;
    companyGstin: string;
    companyState: string;
    companyAddress: string;
    sacCode: string;
  };
  gateways: Array<{
    gateway: string;
    enabled: boolean;
    configured: boolean;
    mode: "test" | "live" | "unconfigured";
    maskedKeyId: string | null;
  }>;
  razorpayMode: "test" | "live" | "unconfigured";
}
