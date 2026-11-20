"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, ArrowLeft, Building2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/common/EmptyState";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";
import { APP_MESSAGES } from "@/config/messages";
import { PAGE_METADATA } from "@/config/page-metadata";

interface StoredEnquiry {
  id: string;
  businessName: string;
  date: string;
  product: string;
  status: string;
  statusColor: string;
}

export default function CustomerEnquiriesPage() {
  const { savedCount } = useSavedBusinesses();
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header savedCount={savedCount} />

      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              {PAGE_METADATA.enquiries.title}
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>
        </div>
      </div>

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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Submitted Inquiries ({enquiries.length})
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                        {enq.businessName}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {enq.product}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        Submitted: {enq.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${enq.statusColor}`}>
                      {enq.status}
                    </span>
                    <Link
                      href={`/businesses/${enq.businessName.toLowerCase().replace(/\s+/g, "-")}`}
                      className="px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg border border-red-500/30 transition-colors"
                    >
                      View Supplier
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
