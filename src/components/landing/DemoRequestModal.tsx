"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";
import axios from "axios";
import { DemoRequestModalProps, FormErrors } from "./demo-modal/demo-modal.types";
import { DemoSuccessView } from "./demo-modal/DemoSuccessView";
import { DemoRequestForm } from "./demo-modal/DemoRequestForm";

export function DemoRequestModal({
  isOpen,
  onClose,
  initialInterest = "Full Enterprise B2B Suite",
}: DemoRequestModalProps) {
  const addToast = useUIStore((s) => s.addToast);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [interest, setInterest] = useState(initialInterest);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leadId, setLeadId] = useState<string>("");

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const errs: FormErrors = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = "Full name must be at least 2 characters.";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = "Please enter a valid work email address.";
    }
    if (!company.trim() || company.trim().length < 2) {
      errs.company = "Company name must be at least 2 characters.";
    }
    if (phoneNumber.trim()) {
      const digits = phoneNumber.replace(/[\s\-()]/g, "");
      if (!/^\d{6,15}$/.test(digits)) {
        errs.phoneNumber = "Please enter a valid telephone number (6-15 digits).";
      }
    }
    return errs;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setTimeout(() => {
        setIsSubmitted(false);
        setErrors({});
        setLeadId("");
      }, 300);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      addToast(
        "error",
        "Please Complete Required Fields",
        validationErrors.email || validationErrors.fullName || validationErrors.company || "Review highlighted inputs."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/demo-request", {
        fullName: fullName.trim(),
        email: email.trim(),
        company: company.trim(),
        countryCode,
        phoneNumber: phoneNumber.trim(),
        interest,
      });

      if (res.data?.success) {
        setLeadId(res.data.leadId || "");
        setIsSubmitted(true);
        addToast(
          "success",
          "Demo Request Confirmed",
          `Lead ID: ${res.data.leadId}. Specialist will contact ${email} within 4 hours.`
        );
      } else {
        addToast("error", "Submission Failed", res.data?.message || "Please check your inputs.");
      }
    } catch (err: any) {
      const serverMsg =
        err.response?.data?.message || "Failed to submit demo request. Please check your inputs.";
      addToast("error", "Validation Error", serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative transition-all bg-surface border border-border text-text-primary"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-[var(--background)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-brand-blush text-brand-wine border border-brand-rose/30 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-headline" className="text-lg font-bold tracking-tight text-text-primary">
                Request Enterprise Demo
              </h2>
              <p className="text-xs text-text-muted">
                Experience Mercora tailored to your trade data workflows
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <DemoSuccessView
              fullName={fullName}
              email={email}
              company={company}
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              interest={interest}
              leadId={leadId}
              onClose={onClose}
            />
          ) : (
            <DemoRequestForm
              fullName={fullName}
              email={email}
              company={company}
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              interest={interest}
              isSubmitting={isSubmitting}
              errors={errors}
              onFullNameChange={(val) => {
                setFullName(val);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              onEmailChange={(val) => {
                setEmail(val);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              onCompanyChange={(val) => {
                setCompany(val);
                if (errors.company) setErrors((prev) => ({ ...prev, company: undefined }));
              }}
              onCountryCodeChange={setCountryCode}
              onPhoneNumberChange={(val) => {
                setPhoneNumber(val);
                if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
              }}
              onInterestChange={setInterest}
              onBlur={() => setErrors(validate())}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DemoRequestModal;
