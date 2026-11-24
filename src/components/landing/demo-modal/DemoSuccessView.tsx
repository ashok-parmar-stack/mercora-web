"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/common";

interface DemoSuccessViewProps {
  fullName: string;
  email: string;
  company: string;
  countryCode: string;
  phoneNumber: string;
  interest: string;
  leadId: string;
  onClose: () => void;
}

export function DemoSuccessView({
  fullName,
  email,
  company,
  countryCode,
  phoneNumber,
  interest,
  leadId,
  onClose,
}: DemoSuccessViewProps) {
  return (
    <div className="py-8 text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-status-success-bg text-status-success border-2 border-status-success shadow-xs">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-text-primary">
        Demo Request Confirmed!
      </h3>
      <p className="text-sm max-w-md mx-auto mb-6 leading-relaxed text-text-secondary">
        Thank you, <strong className="text-text-primary">{fullName}</strong>. A Mercora Trade
        Architecture specialist will contact you at{" "}
        <span className="font-semibold text-brand-wine">{email}</span> within 4 business hours to schedule your
        live interactive walkthrough.
      </p>

      <div className="w-full max-w-sm p-4 rounded-xl mb-6 text-left text-xs space-y-1.5 bg-[var(--background)] border border-border">
        {leadId && (
          <div className="flex justify-between border-b border-border pb-1.5 mb-1.5">
            <span className="text-text-muted">Tracking Ref:</span>
            <span className="font-mono font-bold text-brand-wine">{leadId}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-text-muted">Organization:</span>
          <span className="font-semibold text-text-primary">{company}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Primary Module:</span>
          <span className="font-semibold text-brand-wine">{interest}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Contact Number:</span>
          <span className="font-semibold text-text-primary">{countryCode} {phoneNumber || "N/A"}</span>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        size="md"
        onClick={onClose}
        className="px-8 py-2.5 font-bold text-sm shadow-sm"
      >
        Done &amp; Return to Platform
      </Button>
    </div>
  );
}
