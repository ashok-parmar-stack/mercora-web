"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, ShieldAlert, ArrowLeft, Save } from 'lucide-react';
import { CreateDistrictInput, State } from '@mercora/shared-types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { fetchStates } from '../../lib/geography-api';
import { VALIDATION_MESSAGES } from '../../lib/validation/messages';

const districtSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED('District name')),
  localName: z.string().optional(),
  code: z.string().min(1, VALIDATION_MESSAGES.REQUIRED('District code (e.g. 521, PUNE)')).toUpperCase(),
  stateId: z.string().min(1, VALIDATION_MESSAGES.SELECT_OPTION('state')),
  type: z.string().default('DISTRICT'),
  censusCode: z.string().optional(),
  source: z.string().default('MANUAL'),
  status: z.string().default('ACTIVE'),
});

type DistrictFormValues = z.input<typeof districtSchema>;

export interface DistrictFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<CreateDistrictInput & { id?: string }>;
  onSubmit: (formData: CreateDistrictInput) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  cancelHref?: string;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export const DistrictForm: React.FC<DistrictFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
  error = null,
  cancelHref = '/admin/districts',
  onCancel,
  title,
  subtitle,
}) => {
  const [states, setStates] = useState<State[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<DistrictFormValues>({
    resolver: zodResolver(districtSchema),
    defaultValues: {
      name: '',
      localName: '',
      code: '',
      stateId: '',
      type: 'DISTRICT',
      censusCode: '',
      source: 'MANUAL',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    setLoadingStates(true);
    fetchStates({ limit: 1000 })
      .then((res) => {
        setStates(res.items || []);
        if (!watch('stateId') && res.items?.length > 0 && !initialData?.stateId) {
          setValue('stateId', res.items[0].id);
        }
      })
      .catch((err) => console.error('Failed to load states in district form:', err))
      .finally(() => setLoadingStates(false));
  }, []);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        localName: initialData.localName || '',
        code: initialData.code || '',
        stateId: initialData.stateId || '',
        type: initialData.type || 'DISTRICT',
        censusCode: initialData.censusCode || '',
        source: initialData.source || 'MANUAL',
        status: initialData.status || 'ACTIVE',
      });
    }
  }, [initialData, reset]);

  const currentStatus = watch('status');
  const isActive = (currentStatus || 'ACTIVE').toUpperCase() !== 'INACTIVE';

  const toggleStatus = () => {
    setValue('status', isActive ? 'INACTIVE' : 'ACTIVE', { shouldDirty: true });
  };

  const handleValidSubmit: SubmitHandler<DistrictFormValues> = async (data) => {
    await onSubmit(data as CreateDistrictInput);
  };

  const defaultTitle =
    mode === 'create' ? 'Create District Record' : `Edit District: ${watch('name') || 'Record'}`;
  const defaultSubtitle =
    mode === 'create'
      ? 'Add a new administrative district linked to a parent state or province.'
      : 'Update administrative details, census code mappings, or operational status for this district.';

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-gray-900">{title || defaultTitle}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle || defaultSubtitle}</p>
          </div>
            <Badge variant="brand" size="sm">
              {mode === 'create' ? 'New District' : watch('code') || 'District'}
        </Badge>
      </div>

      <form onSubmit={handleSubmit(handleValidSubmit)} className="flex flex-col gap-6" noValidate>
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Input
              label="District Name *"
              placeholder="e.g. Pune, Los Angeles, Munich"
              {...register('name')}
              error={errors.name?.message}
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Official / Local Script Name (Optional)"
              placeholder="e.g. पुणे, München"
              {...register('localName')}
              error={errors.localName?.message}
            />
          </div>

          <Select
            label="Parent State / Province *"
            {...register('stateId')}
            error={errors.stateId?.message}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name} ({state.code})
              </option>
            ))}
          </Select>

          <Select
            label="Administrative Type *"
            {...register('type')}
            error={errors.type?.message}
          >
            <option value="DISTRICT">District</option>
            <option value="UNION_TERRITORY">Union Territory</option>
            <option value="PROVINCE">Province</option>
            <option value="REGION">Region</option>
            <option value="DEPARTMENT">Department</option>
          </Select>

          <Input
            label="District Code *"
            placeholder="e.g. 521, MH-PU, LA"
            {...register('code', {
              onChange: (e) => setValue('code', e.target.value.toUpperCase()),
            })}
            error={errors.code?.message}
          />

          <Input
            label="Census / LGD Code (Optional)"
            placeholder="e.g. 521"
            {...register('censusCode')}
            error={errors.censusCode?.message}
          />

          <Select
            label="Data Source Registry"
            {...register('source')}
            error={errors.source?.message}
          >
            <option value="MANUAL">MANUAL (Admin Managed)</option>
            <option value="LGD">LGD (Government of India)</option>
            <option value="ISO">ISO Standard</option>
          </Select>

          {/* Status Section */}
          <div className="sm:col-span-2 flex flex-col gap-2 p-4 rounded-xl border border-gray-100 bg-gray-50/60">
            <label className="text-xs font-bold text-gray-700">District Operational Status</label>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleStatus}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${isActive ? 'bg-emerald-500' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  title={isActive ? 'Click to deactivate' : 'Click to activate'}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </button>
                <span
                  onClick={toggleStatus}
                  className={`text-xs font-extrabold cursor-pointer select-none ${isActive ? 'text-emerald-700' : 'text-gray-500'
                    }`}
                >
                  {isActive ? 'Active Status' : 'Inactive Status'}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 font-medium">
                {isActive
                  ? 'District is active and available across catalog, address, and logistics workflows.'
                  : 'District is inactive and hidden from selection dropdowns.'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 pt-6 flex items-center justify-between gap-3">
          {onCancel ? (
              <Button
                type="button"
              variant="secondary"
              size="md"
              onClick={onCancel}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel &amp; Return</span>
              </Button>
        ) : (
        <Button variant="secondary" size="md" asChild>
          <Link href={cancelHref}>
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel &amp; Return</span>
          </Link>
        </Button>
            )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {mode === 'create' ? 'Create District' : 'Save Changes'}
        </Button>
    </div>
        </form >
      </div >
    </div >
  );
};
