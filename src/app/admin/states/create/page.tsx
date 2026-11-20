"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createState } from '../../../../lib/geography-api';
import { CreateStateInput } from '@mercora/shared-types';
import { StateForm } from '../../../../components/geography/StateForm';

export default function CreateStatePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: CreateStateInput) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await createState(formData);
      router.push('/admin/states');
    } catch (err: any) {
      setError(err?.message || 'Failed to create state.');
      setIsSubmitting(false);
    }
  };

  return (
    <StateForm
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      cancelHref="/admin/states"
    />
  );
}
