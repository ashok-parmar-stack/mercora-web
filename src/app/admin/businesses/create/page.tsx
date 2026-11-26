"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminBusiness } from "@/features/businesses/api/admin-business-api";
import { AdminBusinessForm } from "@/features/businesses/components/admin/AdminBusinessForm";
import { useUIStore } from "@/lib/store/ui-store";
import { useTaxonomyStore } from "@/lib/store/taxonomy-store";

export default function AdminCreateBusinessPage() {
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (payload: Record<string, unknown>) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await createAdminBusiness(payload);
      useTaxonomyStore.getState().invalidateTaxonomy();
      addToast("success", "Business Created", `${String(payload.name)} has been added.`);
      router.push("/admin/businesses");
    } catch (err: any) {
      setError(err?.message || "Failed to create business.");
      setIsSubmitting(false);
    }
  };

  return (
    <AdminBusinessForm
      mode="create"
      isSubmitting={isSubmitting}
      error={error}
      cancelHref="/admin/businesses"
      onSubmit={handleSubmit}
    />
  );
}
