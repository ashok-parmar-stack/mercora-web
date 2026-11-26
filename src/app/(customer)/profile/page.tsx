"use client";

import React, { useState, useEffect } from "react";
import { User, Save, CheckCircle2 } from "lucide-react";
import { CustomerSubHeader } from "@/components/layout/CustomerSubHeader";
import { useAuthStore } from "@/lib/store/auth-store";
import { PAGE_METADATA } from "@/config/page-metadata";
import { MESSAGES } from "@/config/messages";
import { Input, Button } from "@/components/common";
import { v1HttpClient, extractErrorMessage } from "@/lib/http/client";

export default function CustomerProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [gstin, setGstin] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setIsSaving(true);
    try {
      await v1HttpClient.patch("/auth/me", {
        name: name.trim() || undefined,
        phone: phone.trim(),
      });
      if (name.trim()) {
        updateUser({ name: name.trim(), phone: phone.trim() || undefined });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      setSaveError(extractErrorMessage(err, "Failed to update profile."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <CustomerSubHeader
        icon={<User className="w-5 h-5 text-primary" />}
        title={PAGE_METADATA.profile.title}
      />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
          {savedSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{MESSAGES.common.saveSuccess}</span>
            </div>
          )}
          {saveError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs font-medium">
              {saveError}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Company / Organization"
              type="text"
              placeholder="Your registered business entity"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Phone Number"
                type="text"
                placeholder="+91 ..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label="Business Email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="City & State"
                type="text"
                placeholder="e.g. Ahmedabad, Gujarat"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                label="GSTIN Number"
                type="text"
                placeholder="e.g. 24AAB..."
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
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
    </>
  );
}
