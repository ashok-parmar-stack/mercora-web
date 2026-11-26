"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button, Select, Textarea } from "@/components/common";
import { Business } from "../../types/business.types";
import {
  AdminVerificationStatus,
  changeAdminBusinessStatus,
} from "../../api/admin-business-api";
import { useUIStore } from "@/lib/store/ui-store";

export interface BusinessVerificationModalProps {
  business: Business | null;
  onClose: () => void;
  onUpdated: () => void;
}

export function BusinessVerificationModal({
  business,
  onClose,
  onUpdated,
}: BusinessVerificationModalProps) {
  const addToast = useUIStore((s) => s.addToast);
  const [status, setStatus] = useState<AdminVerificationStatus>("Verified");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (business) {
      setStatus((business.tier as AdminVerificationStatus) || "Verified");
      setReason("");
      setError(null);
    }
  }, [business]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    if (status === "Unverified" && !reason.trim()) {
      setError("Please provide a reason when marking a business as Unverified.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await changeAdminBusinessStatus(business.id, status);
      addToast(
        "success",
        "Verification Updated",
        `${business.name} status changed to ${status}.`
      );
      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to update verification status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={Boolean(business)}
      onClose={onClose}
      title="Update Verification Status"
      description={business ? `Review and update status for ${business.name}` : ""}
      maxWidth="md"
    >
      <form onSubmit={handleConfirm} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Select
          label="Verification Tier / Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as AdminVerificationStatus)}
        >
          <option value="Verified">Verified</option>
          <option value="Premium">Premium</option>
          <option value="Standard">Standard</option>
          <option value="Unverified">Unverified (Pending / Rejected)</option>
        </Select>

        {status === "Unverified" && (
          <Textarea
            label="Reason *"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Specify why this business is unverified or rejected..."
            rows={3}
          />
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Confirm Status
          </Button>
        </div>
      </form>
    </Modal>
  );
}
