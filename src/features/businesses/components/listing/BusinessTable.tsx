"use client";

import React from "react";
import Link from "next/link";
import { Download, Building2, ExternalLink } from "lucide-react";
import { Business } from "../../types/business.types";
import { BusinessBadge } from "../shared/BusinessBadge";

export interface BusinessTableProps {
  businesses: Business[];
  onSelect?: (business: Business) => void;
}

export function BusinessTable({ businesses, onSelect }: BusinessTableProps) {
  const handleExportCsv = () => {
    if (!businesses.length) return;
    const headers = ["Name", "Category", "BusinessType", "City", "State", "ProductsCount", "Verified", "EstablishedYear", "Phone", "Email"];
    const rows = businesses.map((b) => [
      `"${b.name.replace(/"/g, '""')}"`,
      `"${b.category}"`,
      `"${b.businessType}"`,
      `"${b.city}"`,
      `"${b.state}"`,
      b.products?.length || 0,
      b.isVerified ? "Yes" : "No",
      b.establishedYear,
      `"${b.phone}"`,
      `"${b.email}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `b2b_businesses_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Structured Directory Comparison
        </span>
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Business</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4 text-center">Products</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-4 text-center">Est.</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {businesses.map((business) => (
              <tr
                key={business.id}
                onClick={() => onSelect && onSelect(business)}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                {/* Business Logo & Name */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {business.logoUrl ? (
                        <img src={business.logoUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Building2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
                        {business.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {business.city}, {business.state}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                  {business.category}
                </td>

                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {business.businessType}
                  </span>
                </td>

                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                  {business.city}, {business.state}
                </td>

                <td className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                  {business.products?.length || 0}
                </td>

                <td className="py-3 px-4">
                  <BusinessBadge isVerified={business.isVerified} tier={business.tier} size="sm" />
                </td>

                <td className="py-3 px-4 text-center text-slate-500 dark:text-slate-400">
                  {business.establishedYear}
                </td>

                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/businesses/${business.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
