"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Globe, ShieldAlert, ArrowLeft, Save } from 'lucide-react';
import { CreateCountryInput } from '@mercora/shared-types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { VALIDATION_MESSAGES } from '../../lib/validation/messages';

const countrySchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED('Common Country Name')),
  officialName: z.string().optional(),
  iso2Code: z.string().length(2, VALIDATION_MESSAGES.REQUIRED('ISO2 code (e.g. IN, AE, US)')).toUpperCase(),
  iso3Code: z.string().length(3, VALIDATION_MESSAGES.REQUIRED('ISO3 code (e.g. IND, ARE, USA)')).toUpperCase(),
  numericCode: z.string().optional(),
  phoneCode: z.string().optional(),
  currencyCode: z.string().optional(),
  source: z.string().default('MANUAL'),
  status: z.string().default('ACTIVE'),
});

type CountryFormValues = z.input<typeof countrySchema>;

export interface CountryFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<CreateCountryInput & { id?: string }>;
  onSubmit: (formData: CreateCountryInput) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  cancelHref?: string;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export const CountryForm: React.FC<CountryFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
  error = null,
  cancelHref = '/admin/countries',
  onCancel,
  title,
  subtitle,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: '',
      officialName: '',
      iso2Code: '',
      iso3Code: '',
      numericCode: '',
      phoneCode: '',
      currencyCode: '',
      source: 'MANUAL',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        officialName: initialData.officialName || '',
        iso2Code: initialData.iso2Code || '',
        iso3Code: initialData.iso3Code || '',
        numericCode: initialData.numericCode || '',
        phoneCode: initialData.phoneCode || '',
        currencyCode: initialData.currencyCode || '',
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

  const handleValidSubmit: SubmitHandler<CountryFormValues> = async (data) => {
    await onSubmit(data as CreateCountryInput);
  };

  const defaultTitle =
    mode === 'create' ? 'Create Country Master Record' : `Edit Country: ${watch('name') || 'Master Record'}`;
  const defaultSubtitle =
    mode === 'create'
      ? 'Define a new ISO-3166 country entity, dialing code, currency, and operational status.'
      : 'Update ISO codes, currency, authority source, and active status for this country.';

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-gray-900">{title || defaultTitle}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle || defaultSubtitle}</p>
          </div>
            <Badge variant="brand" size="sm">
              {mode === 'create' ? 'New Country' : watch('iso2Code') || 'Country'}
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
              label="Common Country Name *"
              placeholder="e.g. India, United States, Germany"
              {...register('name')}
              error={errors.name?.message}
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Official Diplomatic Name (Optional)"
              placeholder="e.g. Republic of India, Federal Republic of Germany"
              {...register('officialName')}
              error={errors.officialName?.message}
            />
          </div>

          <Input
            label="ISO2 Alpha-2 Code *"
            placeholder="e.g. IN, US, DE"
            maxLength={2}
            {...register('iso2Code', {
              onChange: (e) => setValue('iso2Code', e.target.value.toUpperCase()),
            })}
            error={errors.iso2Code?.message}
          />

          <Input
            label="ISO3 Alpha-3 Code *"
            placeholder="e.g. IND, USA, DEU"
            maxLength={3}
            {...register('iso3Code', {
              onChange: (e) => setValue('iso3Code', e.target.value.toUpperCase()),
            })}
            error={errors.iso3Code?.message}
          />

          <Input
            label="Numeric Code (UN M.49)"
            placeholder="e.g. 356, 840, 276"
            {...register('numericCode')}
            error={errors.numericCode?.message}
          />

          <Input
            label="International Dialing Code"
            placeholder="e.g. +91, +1, +49"
            {...register('phoneCode')}
            error={errors.phoneCode?.message}
          />

          <Input
            label="Currency Code (ISO 4217)"
            placeholder="e.g. INR, USD, EUR"
            maxLength={3}
            {...register('currencyCode', {
              onChange: (e) => setValue('currencyCode', e.target.value.toUpperCase()),
            })}
            error={errors.currencyCode?.message}
          />

          <Select
            label="Data Source Registry"
            {...register('source')}
            error={errors.source?.message}
          >
            <option value="MANUAL">MANUAL (Admin Managed)</option>
            <option value="ISO">ISO Standard</option>
            <option value="UN">United Nations</option>
          </Select>

          {/* Status Section */}
          <div className="sm:col-span-2 flex flex-col gap-2 p-4 rounded-xl border border-gray-100 bg-gray-50/60">
            <label className="text-xs font-bold text-gray-700">Country Operational Status</label>
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
                  ? 'Country is publicly selectable in company forms, addresses, and shipping'
                  : 'Country is disabled from selection while preserving existing address references'}
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
          {mode === 'create' ? 'Create Country' : 'Save Changes'}
        </Button>
    </div>
        </form >
      </div >
    </div >
  );
};
