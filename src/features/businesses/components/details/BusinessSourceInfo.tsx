import React from "react";
import { ShieldCheck, Calendar, Database, Navigation } from "lucide-react";
import { Business } from "../../types/business.types";
import { Button } from "@/components/common";
import { APP_HEADERS } from "@/config/headers.config";
import { formatLocalDate } from "@/lib/date";

export interface BusinessSourceInfoProps {
  business: Business;
}

export function BusinessSourceInfo({ business }: BusinessSourceInfoProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${business.name}, ${business.city}, ${business.state}`
  )}`;

  const formattedUpdatedAt =
    business.lastUpdated ||
    (business.updatedAt
      ? formatLocalDate(business.updatedAt, { fallback: "Verified Record" })
      : "Verified Record");

  const sourceName = business.source || "Mercora Verified Directory";
  const recordId = business.sourceId || business.id;

  return (
    <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-status-success-bg text-status-success flex items-center justify-center flex-shrink-0 border border-status-success-border">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <span>{APP_HEADERS.businessDetails.sections.verificationSource}</span>
            {business.isVerified !== false && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-status-success-bg text-status-success border border-status-success-border">
                {business.tier || "Verified"}
              </span>
            )}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <span>Last Updated: {formattedUpdatedAt}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-text-muted" />
              <span>
                Source: <strong className="text-text-primary font-semibold">{sourceName}</strong> (ID: {recordId})
              </span>
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="md"
        asChild
        className="flex-shrink-0"
      >
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          <span>{APP_HEADERS.businessDetails.actions.getDirections}</span>
        </a>
      </Button>
    </div>
  );
}
