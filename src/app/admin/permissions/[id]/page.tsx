"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PermissionDetailPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/admin/permissions/${encodeURIComponent(params.id as string)}/edit`);
    }
  }, [params, router]);

  return null;
}
