"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  Building,
  Mail,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";
import { Button } from "@/components/ui/Button";
import axios from "axios";

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInterest?: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  company?: string;
  phoneNumber?: string;
}

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA / Canada", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
];

const INTEREST_AREAS = [
  "HSN & Customs Tariff Engine",
  "8-Tier Geography Hierarchy",
  "Product Taxonomy & Category Tree",
  "Zero-Trust RBAC & Session Guard",
  "Full Deal OS Suite",
];

export function DemoRequestModal({
  isOpen,
  onClose,
  initialInterest = "Full Deal OS Suite",
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

  // Field-level error validation state
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Individual field validator functions
  const validateFullName = (val: string): string | undefined => {
    if (!val.trim()) return "Full name is required.";
    if (val.trim().length < 2) return "Full name must be at least 2 characters.";
    return undefined;
  };

  const validateEmail = (val: string): string | undefined => {
    const trimmed = val.trim();
    if (!trimmed) return "Work email is required.";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid work email address (e.g. name@company.com).";
    }
    return undefined;
  };

  const validateCompany = (val: string): string | undefined => {
    if (!val.trim()) return "Organization or trading firm name is required.";
    if (val.trim().length < 2) return "Company name must be at least 2 characters.";
    return undefined;
  };

  const validatePhone = (val: string): string | undefined => {
    if (!val.trim()) return undefined; // Optional
    const digitsOnly = val.replace(/[\s\-()]/g, "");
    if (!/^\d{6,15}$/.test(digitsOnly)) {
      return "Please enter a valid telephone number (6-15 digits).";
    }
    return undefined;
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset state when closed
      setTimeout(() => {
        setIsSubmitted(false);
        setErrors({});
        setTouched({});
        setLeadId("");
      }, 300);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let error: string | undefined;
    if (field === "fullName") error = validateFullName(fullName);
    if (field === "email") error = validateEmail(email);
    if (field === "company") error = validateCompany(company);
    if (field === "phoneNumber") error = validatePhone(phoneNumber);

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof FormErrors, value: string) => {
    // Clear error immediately on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateFullName(fullName);
    const emailErr = validateEmail(email);
    const compErr = validateCompany(company);
    const phoneErr = validatePhone(phoneNumber);

    const newErrors: FormErrors = {
      fullName: nameErr,
      email: emailErr,
      company: compErr,
      phoneNumber: phoneErr,
    };

    setErrors(newErrors);
    setTouched({ fullName: true, email: true, company: true, phoneNumber: true });

    if (nameErr || emailErr || compErr || phoneErr) {
      addToast(
        "error",
        "Please Complete Required Fields",
        emailErr || nameErr || compErr || "Review the highlighted inputs."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Connect directly to our real API endpoint
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative transition-all"
        style={{
          background: "var(--theme-card-bg)",
          border: "1px solid var(--theme-glass-border)",
          color: "var(--theme-ink-darkest)",
        }}
      >
        {/* Header Bar */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{
            borderColor: "var(--theme-glass-border)",
            background: "var(--theme-canvas)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--theme-blush)",
                border: "1px solid rgba(238, 49, 53, 0.2)",
                color: "var(--theme-red)",
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="modal-headline"
                className="text-lg font-bold tracking-tight"
                style={{ color: "var(--theme-ink-darkest)" }}
              >
                Request Enterprise Demo
              </h2>
              <p className="text-xs" style={{ color: "var(--theme-gray-500)" }}>
                Experience Mercora Deal OS tailored to your trade data workflows
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {isSubmitted ? (
            /* Success State */
            <div className="py-8 text-center flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "#10b981",
                  border: "2px solid #10b981",
                }}
              >
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--theme-ink-darkest)" }}>
                Demo Request Confirmed!
              </h3>
              <p
                className="text-sm max-w-md mx-auto mb-6 leading-relaxed"
                style={{ color: "var(--theme-gray-600)" }}
              >
                Thank you, <strong style={{ color: "var(--theme-ink-darkest)" }}>{fullName}</strong>. A Mercora Trade
                Architecture specialist will contact you at{" "}
                <span className="font-semibold text-red-600">{email}</span> within 4 business hours to schedule your
                live interactive walkthrough.
              </p>

              <div
                className="w-full max-w-sm p-4 rounded-xl mb-6 text-left text-xs space-y-1.5"
                style={{
                  background: "var(--theme-canvas)",
                  border: "1px solid var(--theme-glass-border)",
                }}
              >
                {leadId && (
                  <div className="flex justify-between border-b pb-1.5 mb-1.5" style={{ borderColor: "var(--theme-glass-border)" }}>
                    <span style={{ color: "var(--theme-gray-500)" }}>Tracking Ref:</span>
                    <span className="font-mono font-bold text-red-600">{leadId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span style={{ color: "var(--theme-gray-500)" }}>Organization:</span>
                  <span className="font-semibold">{company}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--theme-gray-500)" }}>Primary Module:</span>
                  <span className="font-semibold text-red-600">{interest}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--theme-gray-500)" }}>Contact Number:</span>
                  <span className="font-semibold">{countryCode} {phoneNumber || "N/A"}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="btn-red px-8 py-3 rounded-xl font-bold text-sm cursor-pointer"
              >
                Done &amp; Return to Platform
              </button>
            </div>
          ) : (
            /* Lead Capture Form with noValidate to block native browser bubbles */
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Row 1: Name & Work Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "var(--theme-ink-darkest)" }}
                  >
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      id="fullName"
                      type="text"
                      placeholder="e.g. Vikram Sharma"
                      value={fullName}
                      onBlur={() => handleBlur("fullName")}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        handleChange("fullName", e.target.value);
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
                      style={{
                        background: errors.fullName ? "rgba(238, 49, 53, 0.05)" : "var(--theme-canvas)",
                        border: errors.fullName
                          ? "1.5px solid var(--theme-red)"
                          : "1px solid var(--theme-glass-border)",
                        color: "var(--theme-ink-darkest)",
                        boxShadow: errors.fullName ? "0 0 0 3px rgba(238, 49, 53, 0.12)" : "none",
                      }}
                    />
                  </div>
                  {errors.fullName && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-2xs font-semibold text-red-600 animate-in fade-in duration-150">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "var(--theme-ink-darkest)" }}
                  >
                    Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder="vikram@enterprise.com"
                      value={email}
                      onBlur={() => handleBlur("email")}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        handleChange("email", e.target.value);
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
                      style={{
                        background: errors.email ? "rgba(238, 49, 53, 0.05)" : "var(--theme-canvas)",
                        border: errors.email
                          ? "1.5px solid var(--theme-red)"
                          : "1px solid var(--theme-glass-border)",
                        color: "var(--theme-ink-darkest)",
                        boxShadow: errors.email ? "0 0 0 3px rgba(238, 49, 53, 0.12)" : "none",
                      }}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-2xs font-semibold text-red-600 animate-in fade-in duration-150">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Company & Phone with Country Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="company"
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "var(--theme-ink-darkest)" }}
                  >
                    Company / Trade Firm *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      id="company"
                      type="text"
                      placeholder="Acme Global Logistics"
                      value={company}
                      onBlur={() => handleBlur("company")}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        handleChange("company", e.target.value);
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
                      style={{
                        background: errors.company ? "rgba(238, 49, 53, 0.05)" : "var(--theme-canvas)",
                        border: errors.company
                          ? "1.5px solid var(--theme-red)"
                          : "1px solid var(--theme-glass-border)",
                        color: "var(--theme-ink-darkest)",
                        boxShadow: errors.company ? "0 0 0 3px rgba(238, 49, 53, 0.12)" : "none",
                      }}
                    />
                  </div>
                  {errors.company && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-2xs font-semibold text-red-600 animate-in fade-in duration-150">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                      <span>{errors.company}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "var(--theme-ink-darkest)" }}
                  >
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      aria-label="Country Calling Code"
                      className="w-28 px-2 py-2.5 rounded-lg text-xs font-medium focus:outline-none"
                      style={{
                        background: "var(--theme-canvas)",
                        border: "1px solid var(--theme-glass-border)",
                        color: "var(--theme-ink-darkest)",
                      }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      id="phoneNumber"
                      type="tel"
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onBlur={() => handleBlur("phoneNumber")}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        handleChange("phoneNumber", e.target.value);
                      }}
                      className="flex-1 px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
                      style={{
                        background: errors.phoneNumber ? "rgba(238, 49, 53, 0.05)" : "var(--theme-canvas)",
                        border: errors.phoneNumber
                          ? "1.5px solid var(--theme-red)"
                          : "1px solid var(--theme-glass-border)",
                        color: "var(--theme-ink-darkest)",
                        boxShadow: errors.phoneNumber ? "0 0 0 3px rgba(238, 49, 53, 0.12)" : "none",
                      }}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-2xs font-semibold text-red-600 animate-in fade-in duration-150">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                      <span>{errors.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Primary Module of Interest */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--theme-ink-darkest)" }}>
                  Primary Module of Interest
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_AREAS.map((item) => {
                    const isSelected = interest === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setInterest(item)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                        style={{
                          background: isSelected ? "var(--theme-red)" : "var(--theme-canvas)",
                          color: isSelected ? "#ffffff" : "var(--theme-ink-darkest)",
                          border: isSelected
                            ? "1px solid var(--theme-red)"
                            : "1px solid var(--theme-glass-border)",
                        }}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
                >
                  Schedule Live Walkthrough
                </Button>
                <p className="text-center text-3xs sm:text-2xs text-gray-400 mt-2 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>No credit card required · Instant access to live sandbox · NDA protected</span>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
export default DemoRequestModal;
