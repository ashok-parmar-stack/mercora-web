"use client";

import React from "react";
import { User, Mail, Building, AlertCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/common";
import { COUNTRY_CODES, INTEREST_AREAS, FormErrors } from "./demo-modal.types";

interface DemoRequestFormProps {
  fullName: string;
  email: string;
  company: string;
  countryCode: string;
  phoneNumber: string;
  interest: string;
  isSubmitting: boolean;
  errors: FormErrors;
  onFullNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onCompanyChange: (val: string) => void;
  onCountryCodeChange: (val: string) => void;
  onPhoneNumberChange: (val: string) => void;
  onInterestChange: (val: string) => void;
  onBlur: (field: keyof FormErrors) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function DemoRequestForm({
  fullName,
  email,
  company,
  countryCode,
  phoneNumber,
  interest,
  isSubmitting,
  errors,
  onFullNameChange,
  onEmailChange,
  onCompanyChange,
  onCountryCodeChange,
  onPhoneNumberChange,
  onInterestChange,
  onBlur,
  onSubmit,
}: DemoRequestFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {/* Row 1: Name & Work Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold mb-1.5 text-text-primary"
          >
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
            <input
              id="fullName"
              type="text"
              placeholder="e.g. Vikram Sharma"
              value={fullName}
              onBlur={() => onBlur("fullName")}
              onChange={(e) => onFullNameChange(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none bg-[var(--background)] text-text-primary border ${
                errors.fullName
                  ? "border-status-error bg-status-error-bg/20 ring-2 ring-status-error/20"
                  : "border-border focus:border-brand-wine"
              }`}
            />
          </div>
          {errors.fullName && (
            <div className="flex items-center gap-1.5 mt-1.5 text-2xs font-semibold text-status-error animate-in fade-in duration-150">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.fullName}</span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold mb-1.5 text-text-primary"
          >
            Work Email *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
            <input
              id="email"
              type="email"
              placeholder="vikram@enterprise.com"
              value={email}
              onBlur={() => onBlur("email")}
              onChange={(e) => onEmailChange(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none bg-[var(--background)] text-text-primary border ${
                errors.email
                  ? "border-status-error bg-status-error-bg/20 ring-2 ring-status-error/20"
                  : "border-border focus:border-brand-wine"
              }`}
            />
          </div>
          {errors.email && (
            <div className="flex items-center gap-1.5 mt-1.5 text-2xs font-semibold text-status-error animate-in fade-in duration-150">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
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
            className="block text-xs font-semibold mb-1.5 text-text-primary"
          >
            Company / Trade Firm *
          </label>
          <div className="relative">
            <Building className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
            <input
              id="company"
              type="text"
              placeholder="Acme Global Logistics"
              value={company}
              onBlur={() => onBlur("company")}
              onChange={(e) => onCompanyChange(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none bg-[var(--background)] text-text-primary border ${
                errors.company
                  ? "border-status-error bg-status-error-bg/20 ring-2 ring-status-error/20"
                  : "border-border focus:border-brand-wine"
              }`}
            />
          </div>
          {errors.company && (
            <div className="flex items-center gap-1.5 mt-1.5 text-2xs font-semibold text-status-error animate-in fade-in duration-150">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.company}</span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-xs font-semibold mb-1.5 text-text-primary"
          >
            Phone Number
          </label>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => onCountryCodeChange(e.target.value)}
              aria-label="Country Calling Code"
              className="w-28 px-2 py-2.5 rounded-lg text-xs font-medium focus:outline-none bg-[var(--background)] text-text-primary border border-border"
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
              onBlur={() => onBlur("phoneNumber")}
              onChange={(e) => onPhoneNumberChange(e.target.value)}
              className={`flex-1 px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none bg-[var(--background)] text-text-primary border ${
                errors.phoneNumber
                  ? "border-status-error bg-status-error-bg/20 ring-2 ring-status-error/20"
                  : "border-border focus:border-brand-wine"
              }`}
            />
          </div>
          {errors.phoneNumber && (
            <div className="flex items-center gap-1.5 mt-1.5 text-2xs font-semibold text-status-error animate-in fade-in duration-150">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.phoneNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Primary Module of Interest */}
      <div>
        <label className="block text-xs font-semibold mb-2 text-text-primary">
          Primary Module of Interest
        </label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_AREAS.map((item) => {
            const isSelected = interest === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onInterestChange(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-brand-wine text-white border-brand-wine shadow-2xs"
                    : "bg-[var(--background)] text-text-primary border-border hover:bg-surface-hover"
                }`}
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
        <p className="text-center text-[11px] text-text-muted mt-2 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
          <span>No credit card required · Instant access to live sandbox · NDA protected</span>
        </p>
      </div>
    </form>
  );
}
