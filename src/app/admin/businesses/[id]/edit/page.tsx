"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ErrorState, LoadingState } from "@/components/common";
import { Business } from "@/features/businesses/types/business.types";
import {
  fetchAdminBusinessByIdOrSlug,
  updateAdminBusiness,
} from "@/features/businesses/api/admin-business-api";
import { AdminBusinessForm } from "@/features/businesses/components/admin/AdminBusinessForm";
import { useUIStore } from "@/lib/store/ui-store";

export default function AdminEditBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);
  const businessId = decodeURIComponent(String(params?.id || ""));

  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchAdminBusinessByIdOrSlug(businessId)
      .then((data) => {
        if (!data) setError("Business not found.");
        else setBusiness(data);
      })
      .catch((err: any) => setError(err?.message || "Failed to load business."))
      .finally(() => setIsLoading(false));
  }, [businessId]);

  if (isLoading) return <LoadingState message="Loading business..." />;
  if (!business && error) {
    return (
      <ErrorState
        title="Business Not Found"
        message={error}
        onRetry={() => router.push("/admin/businesses")}
      />
    );
  }

  const handleSubmit = async (payload: Record<string, unknown>) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await updateAdminBusiness(business?.id || businessId, payload);
      addToast("success", "Business Updated", `${String(payload.name || business?.name)} updated.`);
      router.push(`/admin/businesses/${encodeURIComponent(business?.slug || businessId)}`);
    } catch (err: any) {
      setError(err?.message || "Failed to update business.");
      setIsSubmitting(false);
    }
  };

  return (
    <AdminBusinessForm
      mode="edit"
      initialData={business}
      isSubmitting={isSubmitting}
      error={error}
      cancelHref={`/admin/businesses/${encodeURIComponent(business?.slug || businessId)}`}
      onSubmit={handleSubmit}
    />
  );
}
