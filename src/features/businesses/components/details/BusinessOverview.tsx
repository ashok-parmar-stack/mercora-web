import React from "react";
import { Business } from "../../types/business.types";
import { APP_HEADERS } from "@/config/headers.config";

export interface BusinessOverviewProps {
  business: Business;
}

export function BusinessOverview({ business }: BusinessOverviewProps) {
  const specs = [
    { label: "Business Type", value: business.businessType },
    { label: "Industry", value: business.industry },
    { label: "Establishment", value: String(business.establishedYear) },
    { label: "Company Size", value: `${business.employeeCount} Employees` },
    { label: "Ownership", value: business.ownershipType || "Private Limited" },
    { label: "Annual Turnover", value: business.annualTurnover || "₹10 - 50 Cr" },
    { label: "GSTIN", value: business.gstin },
    { label: "CIN", value: business.cin },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Text */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          {APP_HEADERS.businessDetails.sections.overview}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {business.fullOverview || business.description}
        </p>
      </div>

      {/* Specifications Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">
          {APP_HEADERS.businessDetails.sections.businessDetails}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
            >
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {item.label}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
