"use client";

import React, { useState } from "react";
import { X, RefreshCw, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button, Input } from "@/components/common";

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
  const [pincode, setPincode] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  if (!isOpen) return null;

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
        setResultMessage(data.message || `Synchronized ${cleanPin} from India Post.`);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-surface border border-border shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Sync with India Post Official API
              </h3>
              <p className="text-[11px] text-text-muted">
                Direct government directory lookup &amp; ingestion
              </p>
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

        {resultMessage && (
          <div className="p-3 rounded-xl bg-status-success-bg border border-status-success/30 text-status-success text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{resultMessage}</span>
          </div>
        )}

        <form onSubmit={handleSync} className="space-y-4">
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

          <div className="p-3 rounded-xl bg-[var(--background)] border border-border text-[11px] text-text-muted space-y-1">
            <div className="font-semibold text-text-primary">Official Sync Specs:</div>
            <div>• Connects to Ministry of Communications postal directory.</div>
            <div>• Resolves Head &amp; Sub Post Offices, Talukas, and Districts.</div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
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
      </div>
    </div>
  );
}
