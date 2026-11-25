"use client";

import React, { useState } from "react";
import { RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button, Input } from "@/components/common";
import { useUIStore } from "@/lib/store/ui-store";

interface SyncIndiaPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SyncIndiaPostModal({
  isOpen,
  onClose,
  onSuccess,
}: SyncIndiaPostModalProps) {
  const addToast = useUIStore((s) => s.addToast);
  const [pincode, setPincode] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResultMessage(null);

    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setError("Please enter a valid 6-digit Indian PIN code (e.g. 380001, 110001).");
      return;
    }

    setIsSyncing(true);
    try {
      const res = await fetch(`/api/pincodes?syncPincode=${cleanPin}`);
      const data = await res.json();

      if (data.success) {
        const msg = data.message || `Synchronized ${cleanPin} from India Post.`;
        setResultMessage(msg);
        addToast("success", "India Post Synced", msg);
        setTimeout(() => {
          setPincode("");
          setResultMessage(null);
          onSuccess();
          onClose();
        }, 900);
      } else {
        setError(data.message || "Failed to sync PIN code from India Post.");
      }
    } catch (err: any) {
      setError(err?.message || "Network error while connecting to India Post directory.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sync with India Post Official API"
      description="Direct government directory lookup & ingestion by PIN code."
      maxWidth="md"
    >
      <form onSubmit={handleSync} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resultMessage && (
          <div className="p-3 rounded-xl bg-status-success-bg border border-status-success/30 text-status-success text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{resultMessage}</span>
          </div>
        )}

        <Input
          label="Postal PIN Code (6 Digits)"
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          placeholder="e.g. 380001, 400001, 110001"
          required
          autoFocus
        />

        <div className="p-3 rounded-xl bg-background border border-border text-[11px] text-text-muted space-y-1">
          <div className="font-semibold text-text-primary">Official Sync Specs:</div>
          <div>• Connects to Ministry of Communications postal directory.</div>
          <div>• Resolves Head &amp; Sub Post Offices, Talukas, and Districts.</div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isSyncing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isSyncing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />}
          >
            Sync Official Records
          </Button>
        </div>
      </form>
    </Modal>
  );
}
