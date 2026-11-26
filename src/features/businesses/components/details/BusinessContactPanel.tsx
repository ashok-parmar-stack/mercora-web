"use client";

import React from "react";
import { Phone, Mail, Globe, MapPin, Send } from "lucide-react";
import { Business } from "../../types/business.types";
import { Button } from "@/components/common";
import { APP_HEADERS } from "@/config/headers.config";

export interface BusinessContactPanelProps {
  business: Business;
  onOpenInquiry?: () => void;
}

export function BusinessContactPanel({ business, onOpenInquiry }: BusinessContactPanelProps) {
  return (
    <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-6">
      <div>
        <h3 className="text-base font-bold text-text-primary">
          {APP_HEADERS.businessDetails.sections.contactInfo}
        </h3>
        <p className="text-xs text-text-muted mt-0.5">
          Verified primary communication channels.
        </p>
      </div>

      <div className="space-y-3.5 text-xs">
        {/* Phone */}
        {business.phone && (
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-hover/70 border border-border">
            <div className="p-2 rounded-xl bg-primary-soft text-primary flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Phone / Mobile</span>
              <a
                href={`tel:${business.phone}`}
                className="font-bold text-text-primary hover:text-primary transition-colors truncate block"
              >
                {business.phone}
              </a>
            </div>
          </div>
        )}

        {/* Email */}
        {business.email && (
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-hover/70 border border-border">
            <div className="p-2 rounded-xl bg-primary-soft text-primary flex-shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Business Email</span>
              <a
                href={`mailto:${business.email}`}
                className="font-bold text-text-primary hover:text-primary transition-colors truncate block"
              >
                {business.email}
              </a>
            </div>
          </div>
        )}

        {/* Website */}
        {business.website && (
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-hover/70 border border-border">
            <div className="p-2 rounded-xl bg-primary-soft text-primary flex-shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Official Website</span>
              <a
                href={business.website.startsWith("http") ? business.website : `https://${business.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-text-primary hover:text-primary transition-colors truncate block"
              >
                {business.website}
              </a>
            </div>
          </div>
        )}

        {/* Address */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-hover/70 border border-border">
          <div className="p-2 rounded-xl bg-primary-soft text-primary flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-text-muted uppercase block">Address</span>
            <p className="font-semibold text-text-primary leading-snug">
              {[business.address, business.city, business.state, business.pincode]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>

      {onOpenInquiry && (
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onOpenInquiry}
          className="w-full"
          leftIcon={<Send className="w-4 h-4" />}
        >
          Send Direct Inquiry
        </Button>
      )}
    </div>
  );
}
