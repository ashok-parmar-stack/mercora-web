import React from "react";
import { ShieldCheck, Calendar, Database, Navigation } from "lucide-react";
import { Business } from "../../types/business.types";
import { APP_HEADERS } from "@/config/headers.config";

export interface BusinessSourceInfoProps {
  business: Business;
}

export function BusinessSourceInfo({ business }: BusinessSourceInfoProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${business.name}, ${business.city}, ${business.state}`
  )}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{APP_HEADERS.businessDetails.sections.verificationSource}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              Verified
            </span>
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Last Updated: {business.lastUpdated}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Source: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{business.source}</strong> (ID: {business.sourceId})</span>
            </span>
          </div>
        </div>
      </div>

      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all shadow-sm flex-shrink-0"
      >
        <Navigation className="w-4 h-4" />
        <span>{APP_HEADERS.businessDetails.actions.getDirections}</span>
      </a>
    </div>
  );
}
