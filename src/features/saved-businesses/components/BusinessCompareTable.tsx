"use client";

import React from "react";
import Link from "next/link";
import { GitCompare, Mail, Star, X, ExternalLink } from "lucide-react";
import { Business } from "../../businesses/types/business.types";
import { BusinessBadge } from "../../businesses/components/shared/BusinessBadge";
import { Button } from "@/components/common";

export interface BusinessCompareTableProps {
  businesses: Business[];
  onRemoveFromCompare: (businessId: string) => void;
  onContact?: (business: Business) => void;
  onClose: () => void;
}

export function BusinessCompareTable({
  businesses,
  onRemoveFromCompare,
  onContact,
  onClose,
}: BusinessCompareTableProps) {
  if (businesses.length < 2) return null;

  const rows: Array<{
    label: string;
    render: (b: Business) => React.ReactNode;
  }> = [
    {
      label: "Verification",
      render: (b) => (
        <BusinessBadge isVerified={b.isVerified === true} tier={b.tier} size="sm" />
      ),
    },
    {
      label: "Business Type",
      render: (b) => <span className="font-semibold text-primary">{b.businessType}</span>,
    },
    {
      label: "Industry Sector",
      render: (b) => <span>{b.category}</span>,
    },
    {
      label: "Location",
      render: (b) => <span>{[b.city, b.state].filter(Boolean).join(", ")}</span>,
    },
    {
      label: "Rating & Reviews",
      render: (b) => (
        <span className="inline-flex items-center gap-1 font-semibold text-text-primary">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{b.rating}</span>
          <span className="text-text-muted font-normal">({b.reviewCount})</span>
        </span>
      ),
    },
    {
      label: "Established",
      render: (b) => <span>{b.establishedYear}</span>,
    },
    {
      label: "Company Size",
      render: (b) => <span>{b.employeeCount} Employees</span>,
    },
    {
      label: "Products Listed",
      render: (b) => (
        <span className="font-semibold text-text-primary">
          {b.products?.length || 0}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-surface rounded-3xl border border-border shadow-xs overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-background-secondary/50">
        <div className="flex items-center gap-2.5">
          <GitCompare className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-base font-extrabold text-text-primary">
              Compare Saved Businesses ({businesses.length})
            </h2>
            <p className="text-xs text-text-muted">
              Side-by-side comparison across verification, location, capacity, and ratings.
            </p>
          </div>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Close Comparison
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="py-4 px-5 font-bold text-text-muted uppercase tracking-wider w-44">
                Attribute
              </th>
              {businesses.map((b) => (
                <th key={b.id} className="py-4 px-5 min-w-[220px] align-top">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/businesses/${b.slug}`}
                      className="font-extrabold text-sm text-text-primary hover:text-primary transition-colors line-clamp-2"
                    >
                      {b.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => onRemoveFromCompare(b.id)}
                      aria-label={`Remove ${b.name} from comparison`}
                      className="p-1 rounded-lg text-text-muted hover:text-destructive hover:bg-surface-hover transition-colors cursor-pointer shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.label} className="hover:bg-surface-hover/40 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-text-secondary">
                  {row.label}
                </td>
                {businesses.map((b) => (
                  <td key={`${row.label}-${b.id}`} className="py-3.5 px-5 text-text-secondary">
                    {row.render(b)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="py-4 px-5 font-semibold text-text-secondary">Actions</td>
              {businesses.map((b) => (
                <td key={`actions-${b.id}`} className="py-4 px-5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/businesses/${b.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-primary hover:bg-surface-hover transition-colors"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    {onContact && (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => onContact(b)}
                        leftIcon={<Mail className="w-3.5 h-3.5" />}
                      >
                        Contact
                      </Button>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
