"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDistrict } from '../../../../lib/geography-api';
import { CreateDistrictInput } from '@mercora/shared-types';
import { DistrictForm } from '../../../../components/geography/DistrictForm';

export default function CreateDistrictPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: CreateDistrictInput) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await createDistrict(formData);
      router.push('/admin/districts');
    } catch (err: any) {
      setError(err?.message || 'Failed to create district.');
      setIsSubmitting(false);
    }
  };

  return (
    <DistrictForm
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      cancelHref="/admin/districts"
    />
  );
}
