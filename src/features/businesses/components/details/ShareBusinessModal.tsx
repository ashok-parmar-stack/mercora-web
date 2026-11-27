"use client";

import React, { useState, useEffect } from "react";
import { Check, Copy, Mail, MessageCircle, Share2 } from "lucide-react";
import { Modal } from "@/components/common";
import { Button } from "@/components/common";
import { useUIStore } from "@/lib/store/ui-store";
import { APP_MESSAGES } from "@/config/messages";

export interface ShareBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessSummary?: string;
}

export function ShareBusinessModal({
  isOpen,
  onClose,
  businessName,
  businessSummary,
}: ShareBusinessModalProps) {
  const addToast = useUIStore((s) => s.addToast);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
      setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    }
  }, [isOpen]);

  const shareText = businessSummary
    ? `${businessName} — ${businessSummary}`
    : `Check out ${businessName} on Mercora`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareText}\n${shareUrl}`);

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    addToast("success", "Link Copied", APP_MESSAGES.success.linkCopied);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title: businessName,
        text: shareText,
        url: shareUrl,
      });
      onClose();
    } catch {
      // User cancelled native share sheet
    }
  };

  const channels = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}`,
      icon: MessageCircle,
      tone: "bg-emerald-500/10 text-emerald-700 border-emerald-200 hover:bg-emerald-500/20",
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Share2,
      tone: "bg-sky-500/10 text-sky-700 border-sky-200 hover:bg-sky-500/20",
    },
    {
      label: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodedUrl}`,
      icon: Share2,
      tone: "bg-slate-500/10 text-slate-700 border-slate-200 hover:bg-slate-500/20",
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(businessName)}&body=${encodedText}`,
      icon: Mail,
      tone: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Share ${businessName}`}
      description="Share this verified business profile across your network."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <a
                key={ch.label}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-colors ${ch.tone}`}
              >
                <Icon className="w-4 h-4" />
                <span>{ch.label}</span>
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl border border-border bg-surface-hover/50">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-xs text-text-secondary outline-none px-2 truncate"
            aria-label="Shareable profile URL"
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        {canNativeShare && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleNativeShare}
            leftIcon={<Share2 className="w-4 h-4 text-primary" />}
          >
            Share via Device Apps
          </Button>
        )}
      </div>
    </Modal>
  );
}
