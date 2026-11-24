"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";
import { PAGE_METADATA } from "@/config/page-metadata";
import { MESSAGES } from "@/config/messages";
import { Input, Button } from "@/components/common";

export default function CustomerProfilePage() {
  const { savedCount } = useSavedBusinesses();
  const [name, setName] = useState("Rajesh Sharma");
  const [company, setCompany] = useState("Sharma Builders & Infra Ltd");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("rajesh@sharmabuilders.com");
  const [city, setCity] = useState("Ahmedabad, Gujarat");
  const [gstin, setGstin] = useState("24AABCS9988P1Z0");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      <Header savedCount={savedCount} />

      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h1 className="text-base font-bold text-text-primary">
              {PAGE_METADATA.profile.title}
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
          {savedSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{MESSAGES.common.saveSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Company / Organization"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Phone Number"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label="Business Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="City & State"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                label="GSTIN Number"
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
