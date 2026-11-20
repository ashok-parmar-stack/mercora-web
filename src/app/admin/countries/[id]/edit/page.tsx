"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { fetchCountry, updateCountry } from '../../../../../lib/geography-api';
import { Country, CreateCountryInput } from '@mercora/shared-types';
import { CountryForm } from '../../../../../components/geography/CountryForm';

export default function EditCountryPage() {
  const router = useRouter();
  const params = useParams();
  const countryId = params?.id as string;

  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!countryId) return;
    setLoading(true);
    fetchCountry(countryId)
      .then((c) => {
        setCountry(c);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch country details');
      })
      .finally(() => setLoading(false));
  }, [countryId]);

  const handleSubmit = async (formData: CreateCountryInput) => {
    if (!countryId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await updateCountry(countryId, formData);
      router.push('/admin/countries');
    } catch (err: any) {
      setError(err?.message || 'Failed to update country.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-600" />
        <span className="text-xs font-semibold">Loading country details...</span>
      </div>
    );
  }

  const isAct = country?.status?.isActive ?? (country?.status?.code?.toUpperCase() !== 'INACTIVE');

  return (
    <CountryForm
      mode="edit"
      initialData={{
        name: country?.name || '',
        officialName: country?.officialName || '',
        iso2Code: country?.iso2Code || '',
        iso3Code: country?.iso3Code || '',
        numericCode: country?.numericCode || '',
        phoneCode: country?.phoneCode || '',
        currencyCode: country?.currencyCode || '',
        source: country?.source || 'MANUAL',
        status: country?.status?.code || (isAct ? 'ACTIVE' : 'INACTIVE'),
      }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      cancelHref="/admin/countries"
      title={`Edit Country: ${country?.name || countryId}`}
    />
  );
}
