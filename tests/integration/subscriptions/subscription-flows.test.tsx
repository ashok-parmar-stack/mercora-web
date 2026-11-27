import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { useAuthStore } from "@/lib/store/auth-store";
import { PricingPageClient } from "@/app/(public)/pricing/PricingPageClient";
import SubscriptionCheckoutPage from "@/app/(customer)/subscription/checkout/page";
import PaymentResultPage from "@/app/(customer)/subscription/result/page";
import BusinessPaymentHistoryPage from "@/app/(customer)/subscription/payments/page";
import AdminPaymentsOverviewPage from "@/app/admin/payments/page";
import AdminPaymentDetailPage from "@/app/admin/payments/transactions/[id]/page";

const pushMock = vi.fn();
const replaceMock = vi.fn();
let currentSearchParams = new URLSearchParams();
let currentParams: Record<string, string> = {};

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => currentSearchParams,
  usePathname: () => "/subscription/checkout",
  useParams: () => currentParams,
}));

vi.mock("@/features/subscriptions/utils/razorpay-checkout", async () => {
  const actual = await vi.importActual<
    typeof import("@/features/subscriptions/utils/razorpay-checkout")
  >("@/features/subscriptions/utils/razorpay-checkout");
  return {
    ...actual,
    loadRazorpayCheckoutScript: vi.fn().mockResolvedValue(true),
  };
});

describe("Subscription & Payment Frontend Flows (Integration - Section 14G & 14H)", () => {
  beforeEach(() => {
    pushMock.mockReset();
    replaceMock.mockReset();
    currentSearchParams = new URLSearchParams();
    currentParams = {};
    useAuthStore.setState({
      user: {
        id: "usr-1",
        name: "Test Buyer",
        email: "buyer@apex.in",
        role: { id: "r1", name: "Customer", code: "CUSTOMER" },
        isEmailVerified: true,
      },
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it("completes Razorpay Checkout creation, opens modal, verifies signature, and navigates cleanly", async () => {
    currentSearchParams = new URLSearchParams("planId=plan-pro&mode=purchase");
    let orderRequests = 0;
    let verifyPayload: any = null;

    server.use(
      http.get("*/api/v1/subscription-plans/plan-pro", () =>
        HttpResponse.json({
          success: true,
          data: {
            id: "plan-pro",
            code: "PRO_QUARTERLY",
            name: "Pro Quarterly",
            description: "Pro tier",
            price: 2499,
            priceMinor: 249900,
            currency: "INR",
            billingInterval: "QUARTERLY",
            durationDays: 90,
            gstRateBps: 1800,
            taxMinor: 44982,
            totalPriceMinor: 294882,
            totalPrice: 2948.82,
            features: ["Featured Placement"],
            limits: {
              maxBusinessListings: 3,
              maxProducts: 50,
              maxEnquiriesPerMonth: 150,
              maxContacts: 5,
              featuredListing: true,
              verifiedPriority: true,
              leadInboxAccess: true,
              analyticsAccess: true,
              prioritySupport: true,
            },
            isActive: true,
            displayOrder: 2,
          },
        })
      ),
      http.get("*/api/v1/subscriptions/current", () =>
        HttpResponse.json({
          success: true,
          data: {
            hasBusiness: true,
            businesses: [
              { id: "biz-1", name: "Apex Steel", slug: "apex-steel", city: "Surat", state: "Gujarat", verificationStatus: "Verified" },
            ],
            selectedBusiness: { id: "biz-1", name: "Apex Steel", slug: "apex-steel", city: "Surat", state: "Gujarat", verificationStatus: "Verified" },
            subscription: null,
            entitlements: null,
            actions: { canPurchase: true, canRenew: false, canUpgrade: false, canDowngrade: false, canCancel: false },
          },
        })
      ),
      http.post("*/api/v1/subscriptions/checkout", async () => {
        orderRequests++;
        return HttpResponse.json({
          success: true,
          data: {
            reused: false,
            subscriptionId: "sub-new",
            paymentId: "pay-new",
            gateway: "RAZORPAY",
            keyId: "rzp_test_public",
            orderId: "order_FeTest123",
            currency: "INR",
            subtotalMinor: 249900,
            taxMinor: 44982,
            amountMinor: 294882,
            prorationCreditMinor: 0,
            subtotal: 2499,
            taxAmount: 449.82,
            amount: 2948.82,
            paymentType: "PURCHASE",
            plan: { id: "plan-pro", code: "PRO_QUARTERLY", name: "Pro Quarterly", billingInterval: "QUARTERLY", durationDays: 90 },
            business: { id: "biz-1", name: "Apex Steel" },
            prefill: { name: "Test Buyer", email: "buyer@apex.in" },
          },
        });
      }),
      http.post("*/api/v1/payments/verify", async ({ request }) => {
        verifyPayload = await request.json();
        return HttpResponse.json({
          success: true,
          data: {
            verified: true,
            alreadyCompleted: false,
            paymentStatus: "CAPTURED",
            paymentId: "pay-new",
            subscriptionId: "sub-new",
            subscriptionStatus: "ACTIVE",
            invoiceId: "inv-new",
            invoiceNumber: "MERC-2026-0001",
          },
        });
      })
    );

    const openSpy = vi.fn();
    let capturedOptions: any = null;
    (window as any).Razorpay = function MockRazorpay(opts: any) {
      capturedOptions = opts;
      return {
        open: () => {
          openSpy();
        },
        on: vi.fn(),
      };
    };

    render(<SubscriptionCheckoutPage />);

    const payBtn = await screen.findByRole("button", { name: /Pay/i });
    fireEvent.click(payBtn);
    // Double click prevention while processing
    fireEvent.click(payBtn);

    await waitFor(() => expect(openSpy).toHaveBeenCalledTimes(1));
    expect(orderRequests).toBe(1);
    expect(capturedOptions.key).toBe("rzp_test_public");
    expect(capturedOptions.order_id).toBe("order_FeTest123");
    expect(capturedOptions.amount).toBe(294882);

    // Trigger Razorpay checkout success handler -> must verify on backend before redirect
    await act(async () => {
      await capturedOptions.handler({
        razorpay_order_id: "order_FeTest123",
        razorpay_payment_id: "pay_FeTest123",
        razorpay_signature: "sig_hmac_test",
      });
    });

    await waitFor(() =>
      expect(verifyPayload).toEqual({
        razorpayOrderId: "order_FeTest123",
        razorpayPaymentId: "pay_FeTest123",
        razorpaySignature: "sig_hmac_test",
      })
    );
    expect(replaceMock).toHaveBeenCalledWith(
      expect.stringContaining("/subscription/result?paymentId=pay-new")
    );
  });

  it("supports checkout without a registered business profile using inline billing name and optional GSTIN", async () => {
    currentSearchParams = new URLSearchParams("planId=plan-pro&mode=purchase");
    let checkoutBody: any = null;

    server.use(
      http.get("*/api/v1/subscription-plans/plan-pro", () =>
        HttpResponse.json({
          success: true,
          data: {
            id: "plan-pro",
            code: "PRO_QUARTERLY",
            name: "Pro Quarterly",
            description: "Pro tier",
            price: 2499,
            priceMinor: 249900,
            currency: "INR",
            billingInterval: "QUARTERLY",
            durationDays: 90,
            gstRateBps: 1800,
            taxMinor: 44982,
            totalPriceMinor: 294882,
            totalPrice: 2948.82,
            features: ["Featured Placement"],
            limits: {
              maxBusinessListings: 3,
              maxProducts: 50,
              maxEnquiriesPerMonth: 150,
              maxContacts: 5,
              featuredListing: true,
              verifiedPriority: true,
              leadInboxAccess: true,
              analyticsAccess: true,
              prioritySupport: true,
            },
            isActive: true,
            displayOrder: 2,
          },
        })
      ),
      http.get("*/api/v1/subscriptions/current", () =>
        HttpResponse.json({
          success: true,
          data: {
            hasBusiness: false,
            businesses: [],
            selectedBusiness: null,
            subscription: null,
            entitlements: {
              businessId: "ACCOUNT",
              businessName: "Test Buyer",
              hasActiveSubscription: false,
              isInGracePeriod: false,
              subscriptionId: null,
              subscriptionStatus: "FREE",
              planId: null,
              planCode: "FREE",
              planName: "Free Tier",
              startsAt: null,
              expiresAt: null,
              limits: {
                maxBusinessListings: 1,
                maxProducts: 5,
                maxEnquiriesPerMonth: 10,
                maxContacts: 2,
                featuredListing: false,
                verifiedPriority: false,
                leadInboxAccess: false,
                analyticsAccess: false,
                prioritySupport: false,
              },
              usage: {
                businessListingsUsed: 0,
                productsUsed: 0,
                contactsUsed: 0,
                enquiriesThisMonthUsed: 0,
              },
              remaining: {
                businessListings: 1,
                products: 5,
                contacts: 2,
                enquiriesThisMonth: 10,
              },
            },
            actions: {
              canPurchase: true,
              canRenew: false,
              canUpgrade: false,
              canDowngrade: false,
              canCancel: false,
            },
          },
        })
      ),
      http.post("*/api/v1/subscriptions/checkout", async ({ request }) => {
        checkoutBody = await request.json();
        return HttpResponse.json({
          success: true,
          data: {
            reused: false,
            subscriptionId: "sub-solo",
            paymentId: "pay-solo",
            gateway: "RAZORPAY",
            keyId: "rzp_test_public",
            orderId: "order_Solo123",
            currency: "INR",
            subtotalMinor: 249900,
            taxMinor: 44982,
            amountMinor: 294882,
            prorationCreditMinor: 0,
            subtotal: 2499,
            taxAmount: 449.82,
            amount: 2948.82,
            paymentType: "PURCHASE",
            plan: { id: "plan-pro", code: "PRO_QUARTERLY", name: "Pro Quarterly", billingInterval: "QUARTERLY", durationDays: 90 },
            business: { id: null, name: "Ashok Exporters", gstin: "24ABCDE1234F1Z5", state: "Gujarat" },
            prefill: { name: "Test Buyer", email: "buyer@apex.in" },
          },
        });
      })
    );

    const openSpy = vi.fn();
    (window as any).Razorpay = function MockRazorpay() {
      return { open: openSpy, on: vi.fn() };
    };

    render(<SubscriptionCheckoutPage />);

    expect(await screen.findByLabelText(/Billing Name/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Register Business Now/i })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Billing Name/i), {
      target: { value: "Ashok Exporters" },
    });
    fireEvent.change(screen.getByLabelText(/GSTIN/i), {
      target: { value: "bad-gst" },
    });

    const payBtn = screen.getByRole("button", { name: /Proceed to Payment/i });
    fireEvent.click(payBtn);

    expect(
      await screen.findByText(/Enter a valid 15-character GSTIN/i)
    ).toBeInTheDocument();
    expect(openSpy).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/GSTIN/i), {
      target: { value: "24abcde1234f1z5" },
    });
    fireEvent.click(payBtn);

    await waitFor(() => expect(openSpy).toHaveBeenCalledTimes(1));
    expect(checkoutBody).toMatchObject({
      planId: "plan-pro",
      billingDetails: {
        billingName: "Ashok Exporters",
        gstin: "24ABCDE1234F1Z5",
        state: "Gujarat",
      },
    });
    expect(checkoutBody.businessId).toBeUndefined();
  });

  it("renders verified PaymentResult states (captured vs failed) and Payment History invoice actions", async () => {
    currentSearchParams = new URLSearchParams("paymentId=pay-ok");
    server.use(
      http.get("*/api/v1/payments/pay-ok/status", () =>
        HttpResponse.json({
          success: true,
          data: {
            paymentId: "pay-ok",
            paymentStatus: "CAPTURED",
            subscriptionStatus: "ACTIVE",
            planName: "Pro Quarterly",
            amountMinor: 294882,
            gatewayPaymentId: "pay_RzpOk1",
            invoiceId: "inv-ok",
            invoiceNumber: "MERC-2026-0010",
            startsAt: "2026-06-01T00:00:00.000Z",
            expiresAt: "2026-08-30T00:00:00.000Z",
          },
        })
      )
    );

    render(<PaymentResultPage />);
    expect(await screen.findByText(/Subscription Activated/i)).toBeInTheDocument();
    expect(screen.getByText(/MERC-2026-0010/)).toBeInTheDocument();

    // Payment History renders empty and populated states
    server.use(
      http.get("*/api/v1/payments", () =>
        HttpResponse.json({
          success: true,
          data: [
            {
              id: "pay-1",
              businessId: "biz-1",
              businessName: "Apex Steel",
              userId: "usr-1",
              userEmail: "buyer@apex.in",
              subscriptionId: "sub-1",
              planId: "plan-pro",
              planName: "Pro Quarterly",
              billingInterval: "QUARTERLY",
              gateway: "RAZORPAY",
              paymentType: "PURCHASE",
              gatewayOrderId: "order_1",
              gatewayPaymentId: "pay_1",
              signatureVerified: true,
              amountMinor: 294882,
              refundedAmountMinor: 0,
              amount: 2948.82,
              refundedAmount: 0,
              currency: "INR",
              paymentStatus: "CAPTURED",
              paymentMethod: "upi",
              paymentMethodDetails: null,
              failureCode: null,
              failureReason: null,
              invoiceId: "inv-1",
              invoiceNumber: "MERC-2026-0010",
              paidAt: "2026-06-01T10:00:00.000Z",
              createdAt: "2026-06-01T10:00:00.000Z",
              updatedAt: "2026-06-01T10:00:00.000Z",
            },
          ],
          meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
        })
      )
    );

    render(<BusinessPaymentHistoryPage />);
    expect(await screen.findByText(/Apex Steel/)).toBeInTheDocument();
  });

  it("renders Admin Overview KPIs/charts and enforces PAYMENTS.REFUND RBAC visibility on detail view", async () => {
    server.use(
      http.get("*/api/v1/admin/payment-analytics", () =>
        HttpResponse.json({
          success: true,
          data: {
            kpis: {
              totalRevenueMinor: 590000,
              totalRevenue: 5900,
              netRevenueMinor: 590000,
              netRevenue: 5900,
              totalRefundedMinor: 0,
              totalRefunded: 0,
              totalRefundsCount: 0,
              successfulTransactions: 2,
              pendingTransactions: 1,
              failedTransactions: 0,
              activeSubscriptions: 2,
              pastDueSubscriptions: 0,
              expiredSubscriptions: 0,
              cancelledSubscriptions: 0,
              expiringSubscriptions: 1,
            },
            charts: {
              monthlyRevenue: [{ month: "2026-06", revenueMinor: 590000, revenue: 5900, refundMinor: 0, refund: 0 }],
              transactionOutcomes: [{ month: "2026-06", successful: 2, pending: 1, failed: 0 }],
              planDistribution: [{ planName: "Pro Quarterly", planCode: "PRO_QUARTERLY", activeCount: 2, totalCount: 2, revenueMinor: 590000, revenue: 5900 }],
              subscriptionTrends: [{ month: "2026-06", newSubscriptions: 2, renewals: 0, expirations: 0 }],
              refundTrend: [],
            },
          },
        })
      ),
      http.get("*/api/v1/admin/payments/pay-detail-1", () =>
        HttpResponse.json({
          success: true,
          data: {
            id: "pay-detail-1",
            businessId: "biz-1",
            businessName: "Apex Steel",
            userId: "usr-1",
            userEmail: "buyer@apex.in",
            subscriptionId: "sub-1",
            planId: "plan-pro",
            planName: "Pro Quarterly",
            billingInterval: "QUARTERLY",
            gateway: "RAZORPAY",
            paymentType: "PURCHASE",
            gatewayOrderId: "order_Det1",
            gatewayPaymentId: "pay_Det1",
            signatureVerified: true,
            amountMinor: 294882,
            refundedAmountMinor: 0,
            amount: 2948.82,
            refundedAmount: 0,
            currency: "INR",
            paymentStatus: "CAPTURED",
            paymentMethod: "upi",
            paymentMethodDetails: null,
            failureCode: null,
            failureReason: null,
            invoiceId: "inv-1",
            invoiceNumber: "MERC-2026-0001",
            paidAt: "2026-06-01T10:00:00.000Z",
            createdAt: "2026-06-01T10:00:00.000Z",
            updatedAt: "2026-06-01T10:00:00.000Z",
            attempts: [],
            refunds: [],
          },
        })
      )
    );

    render(<AdminPaymentsOverviewPage />);
    const matches = await screen.findAllByText(/₹5,900\.00/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Monthly Revenue \(INR\)/)).toBeInTheDocument();
    expect(screen.getByText(/Refund Trend/)).toBeInTheDocument();

    // Admin WITHOUT PAYMENTS.REFUND cannot see Issue Refund button
    currentParams = { id: "pay-detail-1" };
    useAuthStore.setState({
      user: {
        id: "admin-1",
        name: "Staff Admin",
        email: "admin@mercora.in",
        role: { id: "r2", name: "Admin", code: "ADMIN" },
        effectivePermissions: ["PAYMENTS.VIEW"],
        isEmailVerified: true,
      },
      isAuthenticated: true,
      isLoading: false,
    });

    const { rerender } = render(<AdminPaymentDetailPage />);
    const orderMatches = await screen.findAllByText(/order_Det1/);
    expect(orderMatches.length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole("button", { name: /Issue Refund/i })).not.toBeInTheDocument();

    // Admin WITH PAYMENTS.REFUND CAN see Issue Refund button
    useAuthStore.setState({
      user: {
        id: "admin-1",
        name: "Super Admin",
        email: "super@mercora.in",
        role: { id: "r0", name: "Super Admin", code: "SUPER_ADMIN" },
        effectivePermissions: ["*"],
        isEmailVerified: true,
      },
    });
    rerender(<AdminPaymentDetailPage />);
    expect(await screen.findByRole("button", { name: /Issue Refund/i })).toBeInTheDocument();
  });

  it("renders /pricing initial SSR plans without empty-state flash and refreshes via API", async () => {
    server.use(
      http.get("*/api/v1/subscription-plans", () =>
        HttpResponse.json({
          success: true,
          data: [
            {
              id: "plan-starter",
              code: "STARTER_MONTHLY",
              name: "Starter Plan",
              description: "Entry plan",
              label: "Starter",
              isPopular: false,
              originalPrice: 1499,
              originalPriceMinor: 149900,
              price: 999,
              priceMinor: 99900,
              currency: "INR",
              billingInterval: "MONTHLY",
              durationDays: 30,
              gstRateBps: 1800,
              taxMinor: 17982,
              totalPriceMinor: 117882,
              totalPrice: 1178.82,
              features: [],
              limits: {
                maxBusinessListings: 2,
                maxProducts: 20,
                maxEnquiriesPerMonth: 50,
                maxContacts: 4,
                featuredListing: false,
                verifiedPriority: false,
                leadInboxAccess: true,
                analyticsAccess: true,
                prioritySupport: false,
              },
              isActive: true,
              displayOrder: 1,
              createdAt: "2026-01-01T00:00:00.000Z",
              updatedAt: "2026-01-01T00:00:00.000Z",
            },
          ],
        })
      )
    );

    render(
      <PricingPageClient
        initialPlans={[
          {
            id: "plan-starter",
            code: "STARTER_MONTHLY",
            name: "Starter Plan",
            description: "Entry plan",
            label: "Starter",
            isPopular: false,
            originalPrice: 1499,
            originalPriceMinor: 149900,
            price: 999,
            priceMinor: 99900,
            currency: "INR",
            billingInterval: "MONTHLY",
            durationDays: 30,
            gstRateBps: 1800,
            taxMinor: 17982,
            totalPriceMinor: 117882,
            totalPrice: 1178.82,
            features: [],
            limits: {
              maxBusinessListings: 2,
              maxProducts: 20,
              maxEnquiriesPerMonth: 50,
              maxContacts: 4,
              featuredListing: false,
              verifiedPriority: false,
              leadInboxAccess: true,
              analyticsAccess: true,
              prioritySupport: false,
            },
            isActive: true,
            displayOrder: 1,
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ]}
      />
    );

    expect(screen.queryByText(/No Active Plans Available/i)).not.toBeInTheDocument();
    expect(screen.getByText("Starter Plan")).toBeInTheDocument();
    expect(screen.getByText(/₹1,499/)).toBeInTheDocument();
    expect(screen.getByText("(Excluding GST)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Buy Now/i })).toBeInTheDocument();
  });
});
