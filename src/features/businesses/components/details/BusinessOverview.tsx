import React from "react";
import { Business } from "../../types/business.types";
import { APP_HEADERS } from "@/config/headers.config";

export interface BusinessOverviewProps {
  business: Business;
}

export function BusinessOverview({ business }: BusinessOverviewProps) {
  const specs = [
    { label: "Business Type", value: business.businessType },
    { label: "Industry", value: business.industry || business.category },
    { label: "Establishment", value: String(business.establishedYear) },
    { label: "Company Size", value: `${business.employeeCount} Employees` },
    { label: "Ownership", value: business.ownershipType || "Private Limited" },
    ...(business.annualTurnover ? [{ label: "Annual Turnover", value: business.annualTurnover }] : []),
    ...(business.gstin ? [{ label: "GSTIN", value: business.gstin }] : []),
    ...(business.cin ? [{ label: "CIN", value: business.cin }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Overview Text */}
      <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-text-primary mb-3">
          {APP_HEADERS.businessDetails.sections.overview}
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed font-normal">
          {business.fullOverview || business.description}
        </p>
      </div>

      {/* Specifications Grid */}
      <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-text-primary mb-5">
          {APP_HEADERS.businessDetails.sections.businessDetails}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-hover/60 border border-border"
            >
              <span className="text-xs font-semibold text-text-secondary">
                {item.label}
              </span>
              <span className="text-xs font-bold text-text-primary font-mono">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
