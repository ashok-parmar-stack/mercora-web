"use client";

import React from "react";
import { Phone, Mail, Globe, MapPin, Send } from "lucide-react";
import { Business } from "../../types/business.types";
import { APP_HEADERS } from "@/config/headers.config";

export interface BusinessContactPanelProps {
  business: Business;
  onOpenInquiry?: () => void;
}

export function BusinessContactPanel({ business, onOpenInquiry }: BusinessContactPanelProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {APP_HEADERS.businessDetails.sections.contactInfo}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Verified primary communication channels.
        </p>
      </div>

      <div className="space-y-3.5 text-xs">
        {/* Phone */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
          <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 flex-shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone / Mobile</span>
            <a
              href={`tel:${business.phone}`}
              className="font-bold text-slate-900 dark:text-white hover:text-red-600 transition-colors"
            >
              {business.phone}
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
          <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 flex-shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Business Email</span>
            <a
              href={`mailto:${business.email}`}
              className="font-bold text-slate-900 dark:text-white hover:text-red-600 transition-colors truncate block"
            >
              {business.email}
            </a>
          </div>
        </div>

        {/* Website */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
          <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 flex-shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Website</span>
            <a
              href={business.website.startsWith("http") ? business.website : `https://${business.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-900 dark:text-white hover:text-red-600 transition-colors truncate block"
            >
              {business.website}
            </a>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
          <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Address</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
              {business.address} - {business.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* Inquiry Trigger */}
      <button
        type="button"
        onClick={onOpenInquiry}
        className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all shadow-md shadow-red-600/30 cursor-pointer"
      >
        <Send className="w-4 h-4" />
        <span>Send Inquiry to Supplier</span>
      </button>
    </div>
  );
}
