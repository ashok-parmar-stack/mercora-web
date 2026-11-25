"use client";

import React, { useState } from "react";
import { Sparkles, AlertCircle, Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button, Input, Select } from "@/components/common";
import { useUIStore } from "@/lib/store/ui-store";

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
  const addToast = useUIStore((s) => s.addToast);
  const [pincode, setPincode] = useState("");
  const [postOfficeName, setPostOfficeName] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [branchType, setBranchType] = useState("Sub Post Office");
  const [deliveryStatus, setDeliveryStatus] = useState<"Delivery" | "Non-Delivery">("Delivery");
  const [isFetchingGovt, setIsFetchingGovt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        addToast("success", "PIN Code Added", data.message || `Added ${pincode.trim()}`);
        setPincode("");
        setPostOfficeName("");
        setDistrict("");
        setState("");
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Postal PIN Code"
      description="Register postal master records in the master directory."
      maxWidth="lg"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="text-[13px] font-medium text-foreground block mb-1.5">
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
              size="md"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Select
            label="Branch Type"
            value={branchType}
            onChange={(e) => setBranchType(e.target.value)}
            options={[
              { value: "Head Post Office", label: "Head Post Office" },
              { value: "Sub Post Office", label: "Sub Post Office" },
              { value: "Branch Post Office", label: "Branch Post Office" },
            ]}
          />

          <Select
            label="Delivery Status"
            value={deliveryStatus}
            onChange={(e) => setDeliveryStatus(e.target.value as "Delivery" | "Non-Delivery")}
            options={[
              { value: "Delivery", label: "Delivery Hub" },
              { value: "Non-Delivery", label: "Non-Delivery Hub" },
            ]}
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isSaving}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Save PIN Code
          </Button>
        </div>
      </form>
    </Modal>
  );
}
