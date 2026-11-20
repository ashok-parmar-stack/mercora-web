"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/admin/categories/${encodeURIComponent(params.id as string)}/edit`);
    }
  }, [params, router]);

  return null;
}
