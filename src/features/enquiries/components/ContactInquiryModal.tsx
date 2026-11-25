"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitEnquiry } from "../../businesses/api/business-api";
import { APP_MESSAGES } from "@/config/messages";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export interface ContactInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
  productName?: string;
}

export function ContactInquiryModal({
  isOpen,
  onClose,
  businessId,
  businessName,
  productName,
}: ContactInquiryModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requirement, setRequirement] = useState(
    productName ? `Inquiring about quotation and technical specs for ${productName}.` : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitEnquiry({
        businessId,
        businessName,
        name,
        phone,
        email,
        requirement,
        productName,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } catch {
      // Handled gracefully
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-6 sm:p-8">
        <DialogHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Send Business Inquiry
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Contacting verified supplier: <strong className="text-red-600 font-bold">{businessName}</strong>
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Inquiry Sent Successfully!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {APP_MESSAGES.success.inquirySubmitted}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-2">
            {productName && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-300 font-semibold">
                Product of interest: {productName}
              </div>
            )}

            <Input
              label="Your Full Name *"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Mobile Number *"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@company.com"
              />
            </div>

            <Textarea
              label="Requirement Details *"
              required
              rows={4}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder={APP_MESSAGES.placeholders.inquiryMessage}
            />

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Submit Inquiry
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
