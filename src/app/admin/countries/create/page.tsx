"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCountry } from '../../../../lib/geography-api';
import { CreateCountryInput } from '@mercora/shared-types';
import { CountryForm } from '../../../../components/geography/CountryForm';

export default function CreateCountryPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: CreateCountryInput) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await createCountry(formData);
      router.push('/admin/countries');
    } catch (err: any) {
      setError(err?.message || 'Failed to create country.');
      setIsSubmitting(false);
    }
  };

  return (
    <CountryForm
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      cancelHref="/admin/countries"
    />
  );
}
