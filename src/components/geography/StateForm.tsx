"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, ShieldAlert, ArrowLeft, Save } from 'lucide-react';
import { CreateStateInput, Country } from '@mercora/shared-types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { fetchCountries } from '../../lib/geography-api';
import { VALIDATION_MESSAGES } from '../../lib/validation/messages';

const stateSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED('State name')),
  localName: z.string().optional(),
  code: z.string().min(1, VALIDATION_MESSAGES.REQUIRED('State code (e.g. IN-MH, US-CA)')).toUpperCase(),
  countryId: z.string().min(1, VALIDATION_MESSAGES.SELECT_OPTION('country')),
  type: z.string().default('STATE'),
  censusCode: z.string().optional(),
  source: z.string().default('MANUAL'),
  status: z.string().default('ACTIVE'),
});

type StateFormValues = z.input<typeof stateSchema>;

export interface StateFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<CreateStateInput & { id?: string }>;
  onSubmit: (formData: CreateStateInput) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  cancelHref?: string;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export const StateForm: React.FC<StateFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
  error = null,
  cancelHref = '/admin/states',
  onCancel,
  title,
  subtitle,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<StateFormValues>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      name: '',
      localName: '',
      code: '',
      countryId: '',
      type: 'STATE',
      censusCode: '',
      source: 'MANUAL',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    setLoadingCountries(true);
    fetchCountries({ limit: 1000 })
      .then((res) => {
        setCountries(res.items || []);
        if (!watch('countryId') && res.items?.length > 0 && !initialData?.countryId) {
          setValue('countryId', res.items[0].id);
        }
      })
      .catch((err) => console.error('Failed to load countries in state form:', err))
      .finally(() => setLoadingCountries(false));
  }, []);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        localName: initialData.localName || '',
        code: initialData.code || '',
        countryId: initialData.countryId || '',
        type: initialData.type || 'STATE',
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

  const handleValidSubmit: SubmitHandler<StateFormValues> = async (data) => {
    await onSubmit(data as CreateStateInput);
  };

  const defaultTitle =
    mode === 'create' ? 'Create State / Province Record' : `Edit State: ${watch('name') || 'Record'}`;
  const defaultSubtitle =
    mode === 'create'
      ? 'Add a new administrative state, province, or union territory linked to a sovereign country.'
      : 'Update administrative details, code mappings, or operational status for this state.';

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-gray-900">{title || defaultTitle}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle || defaultSubtitle}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
            {mode === 'create' ? 'New State' : watch('code') || 'State'}
          </span>
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
                label="State / Province Name *"
                placeholder="e.g. Maharashtra, California, Bavaria"
                {...register('name')}
                error={errors.name?.message}
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Official / Local Script Name (Optional)"
                placeholder="e.g. महाराष्ट्र, Bayern"
                {...register('localName')}
                error={errors.localName?.message}
              />
            </div>

            <Select
              label="Parent Country *"
              {...register('countryId')}
              error={errors.countryId?.message}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name} ({country.iso2Code})
                </option>
              ))}
            </Select>

            <Select
              label="Administrative Type *"
              {...register('type')}
              error={errors.type?.message}
            >
              <option value="STATE">State</option>
              <option value="UNION_TERRITORY">Union Territory</option>
              <option value="PROVINCE">Province</option>
              <option value="REGION">Region</option>
              <option value="DEPARTMENT">Department</option>
            </Select>

            <Input
              label="State Code / ISO Subcode *"
              placeholder="e.g. IN-MH, US-CA, DE-BY"
              {...register('code', {
                onChange: (e) => setValue('code', e.target.value.toUpperCase()),
              })}
              error={errors.code?.message}
            />

            <Input
              label="Census / LGD Code (Optional)"
              placeholder="e.g. 27"
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
              <label className="text-xs font-bold text-gray-700">State Operational Status</label>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleStatus}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      isActive ? 'bg-emerald-500' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    title={isActive ? 'Click to deactivate' : 'Click to activate'}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span
                    onClick={toggleStatus}
                    className={`text-xs font-extrabold cursor-pointer select-none ${
                      isActive ? 'text-emerald-700' : 'text-gray-500'
                    }`}
                  >
                    {isActive ? 'Active Status' : 'Inactive Status'}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                  {isActive
                    ? 'State is active and available across catalog, address, and shipping workflows.'
                    : 'State is inactive and hidden from selection dropdowns.'}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-100 pt-6 flex items-center justify-between gap-3">
            {onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel &amp; Return</span>
              </button>
            ) : (
              <Link
                href={cancelHref}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel &amp; Return</span>
              </Link>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {mode === 'create' ? 'Create State' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
