"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { fetchDistrict, updateDistrict } from '../../../../../lib/geography-api';
import { District, CreateDistrictInput } from '@mercora/shared-types';
import { DistrictForm } from '../../../../../components/geography/DistrictForm';

export default function EditDistrictPage() {
  const router = useRouter();
  const params = useParams();
  const districtId = params?.id as string;

  const [district, setDistrict] = useState<District | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!districtId) return;
    setLoading(true);
    fetchDistrict(districtId)
      .then((s) => {
        setDistrict(s);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch district details');
      })
      .finally(() => setLoading(false));
  }, [districtId]);

  const handleSubmit = async (formData: CreateDistrictInput) => {
    if (!districtId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await updateDistrict(districtId, formData);
      router.push('/admin/districts');
    } catch (err: any) {
      setError(err?.message || 'Failed to update district.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-600" />
        <span className="text-xs font-semibold">Loading district details...</span>
      </div>
    );
  }

  const isAct = district?.status?.isActive ?? (district?.status?.code?.toUpperCase() !== 'INACTIVE');

  return (
    <DistrictForm
      mode="edit"
      initialData={{
        name: district?.name || '',
        localName: district?.localName || '',
        code: district?.code || '',
        stateId: district?.stateId || '',
        type: district?.type || 'DISTRICT',
        censusCode: district?.censusCode || '',
        source: district?.source || 'MANUAL',
        status: district?.status?.code || (isAct ? 'ACTIVE' : 'INACTIVE'),
      }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      cancelHref="/admin/districts"
      title={`Edit District: ${district?.name || districtId}`}
    />
  );
}
