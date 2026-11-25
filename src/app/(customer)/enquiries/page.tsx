"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Building2 } from "lucide-react";
import { CustomerSubHeader } from "@/components/layout/CustomerSubHeader";
import { EmptyState, Badge, Button } from "@/components/common";
import { APP_MESSAGES } from "@/config/messages";
import { PAGE_METADATA } from "@/config/page-metadata";

interface StoredEnquiry {
  id: string;
  businessName: string;
  date: string;
  product: string;
  status: string;
  statusColor?: string;
}

export default function CustomerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<StoredEnquiry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mercora_user_enquiries");
      if (stored) {
        setEnquiries(JSON.parse(stored));
      }
    } catch {
      // Local storage unavailable
    }
  }, []);

  return (
    <>
      <CustomerSubHeader
        icon={<MessageSquare className="w-5 h-5 text-primary" />}
        title={PAGE_METADATA.enquiries.title}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {enquiries.length === 0 ? (
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
        )}
      </main>
    </>
  );
}
