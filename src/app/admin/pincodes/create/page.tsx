"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus, Sparkles } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Input,
  PageHeader,
  Select,
} from "@/components/common";
import {
  createPincode,
  lookupIndiaPostExternal,
} from "@/features/pincodes/api/pincode-api";
import { useUIStore } from "@/lib/store/ui-store";

export default function CreatePincodePage() {
  const router = useRouter();
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
      const po = await lookupIndiaPostExternal(pincode);
      if (po) {
        setPostOfficeName(po.Name || "");
        setDistrict(po.District || "");
        setState(po.State || "");
        setBranchType(po.BranchType || "Sub Post Office");
        setDeliveryStatus(po.DeliveryStatus === "Delivery" ? "Delivery" : "Non-Delivery");
      }
    } catch (err: any) {
      setError(err?.message || "Unable to connect to India Post API. You can fill details manually.");
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
      const data = await createPincode({
        pincode: pincode.trim(),
        postOfficeName: postOfficeName.trim(),
        district: district.trim(),
        state: state.trim(),
        branchType,
        deliveryStatus,
        source: "MANUAL_ENTRY",
      });
      if (data.success) {
        addToast("success", "PIN Code Added", data.message || `Added ${pincode.trim()}`);
        router.push("/admin/pincodes");
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
    <div className="flex flex-col gap-6 max-w-3xl">
      <PageHeader
        title="Add Postal PIN Code"
        description="Register postal master records in the Mercora directory."
        backHref="/admin/pincodes"
      />

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex-1">
                <Input
                  label="PIN Code (6 Digits) *"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="e.g. 380015"
                  maxLength={6}
                  required
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleFetchGovt}
                isLoading={isFetchingGovt}
                leftIcon={<Sparkles className="w-4 h-4 text-primary" />}
              >
                Auto-fill India Post
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Post Office Name *"
                value={postOfficeName}
                onChange={(e) => setPostOfficeName(e.target.value)}
                placeholder="e.g. Navrangpura S.O"
                required
              />
              <Input
                label="District *"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Ahmedabad"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="State *"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Gujarat"
                required
              />
              <Select
                label="Branch Type"
                value={branchType}
                onChange={(e) => setBranchType(e.target.value)}
              >
                <option value="Sub Post Office">Sub Post Office</option>
                <option value="Head Post Office">Head Post Office</option>
                <option value="Branch Post Office">Branch Post Office</option>
              </Select>
              <Select
                label="Delivery Status"
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value as "Delivery" | "Non-Delivery")}
              >
                <option value="Delivery">Delivery</option>
                <option value="Non-Delivery">Non-Delivery</option>
              </Select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" asChild>
                <Link href="/admin/pincodes">Cancel</Link>
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Save PIN Code
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
