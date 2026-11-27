"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Building2, Lock, Crown, Inbox, Send } from "lucide-react";
import { CustomerSubHeader } from "@/components/layout/CustomerSubHeader";
import { EmptyState, Badge, Button, Select, Skeleton } from "@/components/common";
import { APP_MESSAGES } from "@/config/messages";
import { PAGE_METADATA } from "@/config/page-metadata";
import { extractErrorMessage } from "@/lib/http/client";
import {
  fetchBusinessEnquiries,
  fetchOwnedBusinesses,
} from "@/features/subscriptions/api/subscription-api";

interface StoredEnquiry {
  id: string;
  businessName: string;
  date: string;
  product: string;
  status: string;
  statusColor?: string;
}

export default function CustomerEnquiriesPage() {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [enquiries, setEnquiries] = useState<StoredEnquiry[]>([]);

  const [businesses, setBusinesses] = useState<Array<Record<string, any>>>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [receivedLeads, setReceivedLeads] = useState<Array<Record<string, any>>>([]);
  const [leadQuota, setLeadQuota] = useState<{
    allowed: boolean;
    used: number;
    limit: number;
    remaining: number;
    leadInboxAccess: boolean;
  } | null>(null);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mercora_user_enquiries");
      if (stored) {
        setEnquiries(JSON.parse(stored));
      }
    } catch {
      // Local storage unavailable
    }

    const ctrl = new AbortController();
    fetchOwnedBusinesses(ctrl.signal)
      .then((list) => {
        setBusinesses(list);
        if (list.length > 0 && !selectedBusinessId) {
          setSelectedBusinessId(list[0].id);
        }
      })
      .catch(() => {});

    return () => ctrl.abort();
  }, [selectedBusinessId]);

  useEffect(() => {
    if (activeTab !== "received" || !selectedBusinessId) return;
    const ctrl = new AbortController();
    setLoadingLeads(true);
    setLeadError(null);

    fetchBusinessEnquiries(selectedBusinessId, ctrl.signal)
      .then((res) => {
        setReceivedLeads(res.data || []);
        setLeadQuota(res.quota || null);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setLeadError(extractErrorMessage(err));
        }
      })
      .finally(() => setLoadingLeads(false));

    return () => ctrl.abort();
  }, [activeTab, selectedBusinessId]);

  return (
    <>
      <CustomerSubHeader
        icon={<MessageSquare className="w-5 h-5 text-primary" />}
        title={PAGE_METADATA.enquiries.title}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={activeTab === "sent" ? "primary" : "outline"}
              onClick={() => setActiveTab("sent")}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Sent RFQs ({enquiries.length})</span>
            </Button>
            <Button
              size="sm"
              variant={activeTab === "received" ? "primary" : "outline"}
              onClick={() => setActiveTab("received")}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Received Business Leads</span>
            </Button>
          </div>

          {businesses.length > 1 && activeTab === "received" && (
            <div className="w-60">
              <Select
                value={selectedBusinessId}
                onChange={(e) => setSelectedBusinessId(e.target.value)}
                options={businesses.map((b) => ({ value: b.id, label: b.name }))}
              />
            </div>
          )}
        </div>

        {activeTab === "sent" ? (
          enquiries.length === 0 ? (
            <EmptyState
              title={APP_MESSAGES.empty.noEnquiries.title}
              description={APP_MESSAGES.empty.noEnquiries.description}
              actionLabel={APP_MESSAGES.empty.noEnquiries.actionLabel}
              onAction={() => {
                window.location.href = "/businesses";
              }}
            />
          ) : (
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
              <div className="p-4 border-b border-border bg-surface-hover/40">
                <span className="text-xs font-bold uppercase text-text-muted tracking-wider">
                  Submitted Inquiries ({enquiries.length})
                </span>
              </div>

              <div className="divide-y divide-border">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-text-secondary">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-bold text-text-primary text-sm">
                          {enq.businessName}
                        </h2>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {enq.product}
                        </p>
                        <span className="text-[11px] text-text-muted">
                          Submitted: {enq.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="brand" size="sm">
                        {enq.status}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/businesses/${enq.businessName.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          View Supplier
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : businesses.length === 0 ? (
          <EmptyState
            title="No owned business profile found"
            description="Claim or register your business profile to receive buyer RFQs and unlock subscription lead entitlements."
            actionLabel="View Subscription Plans"
            onAction={() => {
              window.location.href = "/pricing";
            }}
          />
        ) : loadingLeads ? (
          <Skeleton className="h-64 rounded-2xl" />
        ) : leadError ? (
          <div className="p-6 rounded-2xl bg-surface border border-border text-sm text-destructive space-y-3">
            <p>{leadError}</p>
            <Button size="sm" variant="primary" asChild>
              <Link href="/subscription">Manage Subscription</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {leadQuota && (
              <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-text-secondary">
                  <span className="font-bold text-text-primary">Monthly Lead Inbox Quota:</span>{" "}
                  {leadQuota.limit < 0
                    ? `Unlimited leads (${leadQuota.used} received this month)`
                    : `${leadQuota.used} / ${leadQuota.limit} leads unlocked this month`}
                </div>
                {(!leadQuota.leadInboxAccess ||
                  (leadQuota.limit >= 0 && leadQuota.used >= leadQuota.limit)) && (
                  <Button size="sm" variant="primary" asChild>
                    <Link href="/subscription">
                      <Crown className="w-3.5 h-3.5" />
                      <span>Upgrade Plan to Unlock All Leads</span>
                    </Link>
                  </Button>
                )}
              </div>
            )}

            {receivedLeads.length === 0 ? (
              <EmptyState
                title="No buyer leads received yet"
                description="Buyer enquiries submitted on your verified listing will appear here."
              />
            ) : (
              <div className="bg-surface rounded-2xl border border-border overflow-hidden divide-y divide-border">
                {receivedLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-text-primary">
                          {lead.senderName}
                        </h3>
                        {lead.companyName && (
                          <span className="text-xs text-text-muted">({lead.companyName})</span>
                        )}
                        {lead.lockedByPlanQuota && (
                          <Badge variant="warning" size="sm">
                            <Lock className="w-3 h-3" /> Quota Locked
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary">{lead.message}</p>
                      <p className="text-xs text-text-muted">
                        Phone: {lead.senderPhone || "—"} • Email: {lead.senderEmail || "Locked"} •{" "}
                        {new Date(lead.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                    {lead.lockedByPlanQuota ? (
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/subscription">Unlock with Upgrade</Link>
                      </Button>
                    ) : (
                      <Badge variant="success" size="sm">
                        {lead.status || "NEW"}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
