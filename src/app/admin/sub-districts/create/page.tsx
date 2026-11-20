"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSubDistrict } from '../../../../lib/geography-api';
import { CreateSubDistrictInput } from '@mercora/shared-types';
import { SubDistrictForm } from '../../../../components/geography/SubDistrictForm';

export default function CreateSubDistrictPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: CreateSubDistrictInput) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await createSubDistrict(formData);
      router.push('/admin/sub-districts');
    } catch (err: any) {
      setError(err?.message || 'Failed to create subDistrict.');
      setIsSubmitting(false);
    }
  };

  return (
    <SubDistrictForm
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      cancelHref="/admin/sub-districts"
    />
  );
}
