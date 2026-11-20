"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { fetchState, updateState } from '../../../../../lib/geography-api';
import { State, CreateStateInput } from '@mercora/shared-types';
import { StateForm } from '../../../../../components/geography/StateForm';

export default function EditStatePage() {
  const router = useRouter();
  const params = useParams();
  const stateId = params?.id as string;

  const [state, setState] = useState<State | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!stateId) return;
    setLoading(true);
    fetchState(stateId)
      .then((s) => {
        setState(s);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch state details');
      })
      .finally(() => setLoading(false));
  }, [stateId]);

  const handleSubmit = async (formData: CreateStateInput) => {
    if (!stateId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await updateState(stateId, formData);
      router.push('/admin/states');
    } catch (err: any) {
      setError(err?.message || 'Failed to update state.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-600" />
        <span className="text-xs font-semibold">Loading state details...</span>
      </div>
    );
  }

  const isAct = state?.status?.isActive ?? (state?.status?.code?.toUpperCase() !== 'INACTIVE');

  return (
    <StateForm
      mode="edit"
      initialData={{
        name: state?.name || '',
        localName: state?.localName || '',
        code: state?.code || '',
        countryId: state?.countryId || '',
        type: state?.type || 'STATE',
        censusCode: state?.censusCode || '',
        source: state?.source || 'MANUAL',
        status: state?.status?.code || (isAct ? 'ACTIVE' : 'INACTIVE'),
      }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      cancelHref="/admin/states"
      title={`Edit State: ${state?.name || stateId}`}
    />
  );
}
