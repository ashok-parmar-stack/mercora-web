"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { fetchSubDistrict, updateSubDistrict } from '../../../../../lib/geography-api';
import { SubDistrict, CreateSubDistrictInput } from '@mercora/shared-types';
import { SubDistrictForm } from '../../../../../components/geography/SubDistrictForm';

export default function EditSubDistrictPage() {
  const router = useRouter();
  const params = useParams();
  const subDistrictId = params?.id as string;

  const [subDistrict, setSubDistrict] = useState<SubDistrict | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!subDistrictId) return;
    setLoading(true);
    fetchSubDistrict(subDistrictId)
      .then((s) => {
        setSubDistrict(s);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch subDistrict details');
      })
      .finally(() => setLoading(false));
  }, [subDistrictId]);

  const handleSubmit = async (formData: CreateSubDistrictInput) => {
    if (!subDistrictId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await updateSubDistrict(subDistrictId, formData);
      router.push('/admin/sub-districts');
    } catch (err: any) {
      setError(err?.message || 'Failed to update subDistrict.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-600" />
        <span className="text-xs font-semibold">Loading subDistrict details...</span>
      </div>
    );
  }

  const isAct = subDistrict?.status?.isActive ?? (subDistrict?.status?.code?.toUpperCase() !== 'INACTIVE');

  return (
    <SubDistrictForm
      mode="edit"
      initialData={{
        name: subDistrict?.name || '',
        localName: subDistrict?.localName || '',
        code: subDistrict?.code || '',
        districtId: subDistrict?.districtId || '',
        type: subDistrict?.type || 'SUB_DISTRICT',
        censusCode: subDistrict?.censusCode || '',
        source: subDistrict?.source || 'MANUAL',
        status: subDistrict?.status?.code || (isAct ? 'ACTIVE' : 'INACTIVE'),
      }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      cancelHref="/admin/sub-districts"
      title={`Edit SubDistrict: ${subDistrict?.name || subDistrictId}`}
    />
  );
}
