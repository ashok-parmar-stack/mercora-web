"use client";

import React, { useState } from "react";
import { X, Plus, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button, Input } from "@/components/common";

interface AddPincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPincodeModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPincodeModalProps) {
  const [pincode, setPincode] = useState("");
  const [postOfficeName, setPostOfficeName] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [branchType, setBranchType] = useState("Sub Post Office");
  const [deliveryStatus, setDeliveryStatus] = useState<"Delivery" | "Non-Delivery">("Delivery");
  const [isFetchingGovt, setIsFetchingGovt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Live Government Lookup to Autofill
  const handleFetchGovt = async () => {
    if (!/^\d{6}$/.test(pincode.trim())) {
      setError("Please enter a valid 6-digit PIN code first.");
      return;
    }

    setIsFetchingGovt(true);
    setError(null);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode.trim()}`);
      const data = await res.json();
      const first = Array.isArray(data) ? data[0] : null;

      if (first && first.Status === "Success" && first.PostOffice && first.PostOffice.length > 0) {
        const po = first.PostOffice[0];
        setPostOfficeName(po.Name || "");
        setDistrict(po.District || "");
        setState(po.State || "");
        setBranchType(po.BranchType || "Sub Post Office");
        setDeliveryStatus(po.DeliveryStatus === "Delivery" ? "Delivery" : "Non-Delivery");
      } else {
        setError(first?.Message || "No records found on India Post. You can enter details manually.");
      }
    } catch {
      setError("Unable to connect to India Post API. You can fill details manually.");
    } finally {
      setIsFetchingGovt(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^\d{6}$/.test(pincode.trim())) {
      setError("Valid 6-digit PIN code is required.");
      return;
    }
    if (!postOfficeName.trim() || !district.trim() || !state.trim()) {
      setError("Post Office, District, and State are required fields.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/pincodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pincode: pincode.trim(),
          postOfficeName: postOfficeName.trim(),
          district: district.trim(),
          state: state.trim(),
          branchType,
          deliveryStatus,
          source: "MANUAL_ENTRY",
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || "Failed to save PIN code.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to save PIN code record.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-surface border border-border shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Add Postal PIN Code</h3>
              <p className="text-[11px] text-text-muted">Register postal master records in master directory</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">
              PIN Code (6 Digits) *
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 380001"
                required
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFetchGovt}
                isLoading={isFetchingGovt}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-primary" />}
                className="shrink-0 text-xs"
              >
                Autofill from Govt
              </Button>
            </div>
          </div>

          <Input
            label="Post Office Name *"
            value={postOfficeName}
            onChange={(e) => setPostOfficeName(e.target.value)}
            placeholder="e.g. Ahmedabad G.P.O."
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="District *"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Ahmedabad"
              required
            />
            <Input
              label="State *"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Gujarat"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-primary">Branch Type</label>
              <select
                value={branchType}
                onChange={(e) => setBranchType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-text-primary"
              >
                <option value="Head Post Office">Head Post Office</option>
                <option value="Sub Post Office">Sub Post Office</option>
                <option value="Branch Post Office">Branch Post Office</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-primary">Delivery Status</label>
              <select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-text-primary"
              >
                <option value="Delivery">Delivery Hub</option>
                <option value="Non-Delivery">Non-Delivery Hub</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
              Save PIN Code
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
