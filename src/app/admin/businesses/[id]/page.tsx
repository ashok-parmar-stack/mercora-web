"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ErrorState, LoadingState } from "@/components/common";
import { Business } from "@/features/businesses/types/business.types";
import { fetchAdminBusinessByIdOrSlug } from "@/features/businesses/api/admin-business-api";
import { AdminBusinessProfileView } from "@/features/businesses/components/admin/AdminBusinessProfileView";

export default function AdminBusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = decodeURIComponent(String(params?.id || ""));

  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBusiness = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminBusinessByIdOrSlug(idOrSlug);
      if (!data) {
        setError("Business profile not found.");
      } else {
        setBusiness(data);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load business profile.");
    } finally {
      setIsLoading(false);
    }
  }, [idOrSlug]);

  useEffect(() => {
    loadBusiness();
  }, [loadBusiness]);

  if (isLoading) return <LoadingState message="Loading business profile..." />;
  if (error || !business) {
    return (
      <ErrorState
        title="Unable to Load Business"
        message={error || "Business not found."}
        onRetry={() => router.push("/admin/businesses")}
      />
    );
  }

  return <AdminBusinessProfileView business={business} onRefresh={loadBusiness} />;
}
