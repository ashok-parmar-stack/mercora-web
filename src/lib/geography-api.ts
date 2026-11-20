import {
  Country,
  CountryQueryParams,
  CreateCountryInput,
  UpdateCountryInput,
  PaginatedCountriesResponse,
  State,
  StateQueryParams,
  CreateStateInput,
  UpdateStateInput,
  PaginatedStatesResponse,
  District,
  DistrictQueryParams,
  CreateDistrictInput,
  UpdateDistrictInput,
  PaginatedDistrictsResponse,
  SubDistrict,
  SubDistrictQueryParams,
  CreateSubDistrictInput,
  UpdateSubDistrictInput,
  PaginatedSubDistrictsResponse,
  GeographicDashboardMetrics,
} from '@mercora/shared-types';
import axios from 'axios';
import { AbortableRequestOptions, isAbortError } from './api-abort';

const API_BASE =
  typeof window !== 'undefined'
    ? '/api'
    : process.env.INTERNAL_BACKEND_URL
      ? `${process.env.INTERNAL_BACKEND_URL.replace(/\/+$/, '')}/api`
      : (process.env.NEXT_PUBLIC_API_URL && /^https?:\/\//i.test(process.env.NEXT_PUBLIC_API_URL))
        ? process.env.NEXT_PUBLIC_API_URL
        : 'http://127.0.0.1:5001/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// 1. COUNTRIES
// ==========================================

export async function fetchCountries(
  params: CountryQueryParams = {},
  options?: AbortableRequestOptions,
): Promise<PaginatedCountriesResponse> {
  try {
    const res = await apiClient.get('/v1/admin/countries', {
      params,
      signal: options?.signal,
    });
    if (res.data?.data && Array.isArray(res.data.data.items)) {
      return res.data.data;
    }
    throw new Error(res.data?.message || `Failed to fetch countries (${res.status})`);
  } catch (err) {
    if (isAbortError(err)) throw err;
    console.error('[geography-api] fetchCountries error:', err);
    throw err;
  }
}

export async function fetchCountry(
  idOrCode: string,
  options?: AbortableRequestOptions,
): Promise<Country> {
  try {
    const res = await apiClient.get(`/v1/admin/countries/${encodeURIComponent(idOrCode)}`, {
      signal: options?.signal,
    });
    if (res.data?.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || `Failed to fetch country (${res.status})`);
  } catch (err) {
    if (isAbortError(err)) throw err;
    console.error('[geography-api] fetchCountry error:', err);
    throw err;
  }
}

export async function createCountry(payload: CreateCountryInput): Promise<Country> {
  const res = await apiClient.post('/v1/admin/countries', payload);
  if (res.data?.data) return res.data.data;
  throw new Error(res.data?.message || `Failed to create country (${res.status})`);
}

export async function updateCountry(idOrCode: string, payload: UpdateCountryInput): Promise<Country> {
  const res = await apiClient.patch(`/v1/admin/countries/${encodeURIComponent(idOrCode)}`, payload);
  if (res.data?.data) return res.data.data;
  throw new Error(res.data?.message || `Failed to update country (${res.status})`);
}

export async function updateCountryStatus(idOrCode: string, status: string): Promise<Country> {
  const res = await apiClient.patch(`/v1/admin/countries/${encodeURIComponent(idOrCode)}/status`, { status });
  if (res.data?.data) return res.data.data;
  throw new Error(res.data?.message || `Failed to update country status (${res.status})`);
}

export async function deleteCountry(idOrCode: string): Promise<void> {
  await apiClient.delete(`/v1/admin/countries/${encodeURIComponent(idOrCode)}`);
}

export async function seedBaselineCountries(): Promise<{ seeded: number; skipped: number; message?: string }> {
  const res = await apiClient.post('/v1/admin/countries/seed-baseline');
  if (res.data?.data) return { ...res.data.data, message: res.data.message };
  throw new Error(res.data?.message || `Failed to verify countries (${res.status})`);
}

// ==========================================
// 2. STATES
// ==========================================

export async function fetchStates(
  params: StateQueryParams = {},
  options?: AbortableRequestOptions,
): Promise<PaginatedStatesResponse> {
  try {
    const res = await apiClient.get('/v1/admin/states', {
      params,
      signal: options?.signal,
    });
    if (res.data?.data && Array.isArray(res.data.data.items)) {
      return res.data.data;
    }
    throw new Error(res.data?.message || `Failed to fetch states (${res.status})`);
  } catch (err) {
    if (isAbortError(err)) throw err;
    console.error('[geography-api] fetchStates error:', err);
    throw err;
  }
}

export async function fetchState(idOrCode: string, options?: AbortableRequestOptions): Promise<State> {
  try {
    const res = await apiClient.get(`/v1/admin/states/${encodeURIComponent(idOrCode)}`, { signal: options?.signal });
    if (res.data?.data) return res.data.data;
    throw new Error(res.data?.message || `Failed to fetch state (${res.status})`);
  } catch (err) {
    if (isAbortError(err)) throw err;
    console.error('[geography-api] fetchState error:', err);
    throw err;
  }
}

export async function createState(payload: CreateStateInput): Promise<State> {
  const res = await apiClient.post('/v1/admin/states', payload);
  if (res.data?.data) return res.data.data;
  throw new Error(res.data?.message || `Failed to create state (${res.status})`);
}

export async function updateState(idOrCode: string, payload: UpdateStateInput): Promise<State> {
  const res = await apiClient.patch(`/v1/admin/states/${encodeURIComponent(idOrCode)}`, payload);
  if (res.data?.data) return res.data.data;
  throw new Error(res.data?.message || `Failed to update state (${res.status})`);
}

export async function updateStateStatus(idOrCode: string, status: string): Promise<State> {
  const res = await apiClient.patch(`/v1/admin/states/${encodeURIComponent(idOrCode)}/status`, { status });
  if (res.data?.data) return res.data.data;
  throw new Error(res.data?.message || `Failed to update state status (${res.status})`);
}

export async function deleteState(idOrCode: string): Promise<void> {
  await apiClient.delete(`/v1/admin/states/${encodeURIComponent(idOrCode)}`);
}

export async function syncLgdStates(): Promise<{ inserted: number; updated: number; skipped: number; total: number; message: string }> {
  const res = await apiClient.post('/v1/admin/geography/sync/lgd-states');
  if (res.data?.data) return { ...res.data.data, message: res.data.message };
  throw new Error(res.data?.message || `Failed to sync LGD states (${res.status})`);
}

export async function syncLgdDistricts(stateCode?: string): Promise<{ inserted: number; updated: number; skipped: number; total: number; message: string }> {
  const res = await apiClient.post('/v1/admin/geography/sync/lgd-districts', {}, {
    params: stateCode ? { stateCode } : undefined,
  });
  if (res.data?.data) return { ...res.data.data, message: res.data.message };
  throw new Error(res.data?.message || `Failed to sync LGD districts (${res.status})`);
}

export async function syncLgdSubDistricts(districtCode?: string): Promise<{ inserted: number; updated: number; skipped: number; total: number; message: string }> {
  const res = await apiClient.post('/v1/admin/geography/sync/lgd-subdistricts', {}, {
    params: districtCode ? { districtCode } : undefined,
  });
  if (res.data?.data) return { ...res.data.data, message: res.data.message };
  throw new Error(res.data?.message || `Failed to sync LGD sub-districts (${res.status})`);
}

export async function syncAllGovernmentGeography(): Promise<{ message: string; country?: any; states: any; districts: any; subDistricts: any }> {
  const res = await apiClient.post('/v1/admin/geography/sync/all');
  if (res.data?.data) return { ...res.data.data, message: res.data.message };
  throw new Error(res.data?.message || `Failed to sync all government pipelines (${res.status})`);
}

export async function resetAndSyncAllGeography(): Promise<{ message: string; country: any; states: any; districts: any; subDistricts: any }> {
  const res = await apiClient.post('/v1/admin/geography/reset-and-sync');
  if (res.data?.data) return { ...res.data.data, message: res.data.message };
  throw new Error(res.data?.message || `Failed to reset and re-sync geography (${res.status})`);
}

export async function seedBaselineStates(): Promise<{ seeded: number; skipped: number; message?: string }> {
  const res = await syncLgdStates();
  return { seeded: res.inserted, skipped: res.skipped, message: res.message };
}

// ==========================================
// 3. DISTRICTS
// ==========================================

export async function fetchDistricts(
  params: DistrictQueryParams = {},
  options?: AbortableRequestOptions,
): Promise<PaginatedDistrictsResponse> {
  try {
    const res = await apiClient.get('/v1/admin/districts', { params, signal: options?.signal });
    if (res.data?.data && Array.isArray(res.data.data.items)) return res.data.data;
    throw new Error(res.data?.message || `Failed to fetch districts (${res.status})`);
  } catch (err) {
    if (isAbortError(err)) throw err;
    console.error('[geography-api] fetchDistricts error:', err);
    throw err;
  }
}

export async function fetchDistrict(idOrCode: string, options?: AbortableRequestOptions): Promise<District> {
  try {
    const res = await apiClient.get(`/v1/admin/districts/${encodeURIComponent(idOrCode)}`, { signal: options?.signal });
    if (res.data?.data) return res.data.data;
    throw new Error(res.data?.message || `Failed to fetch district (${res.status})`);
  } catch (err) {
    if (isAbortError(err)) throw err;
    console.error('[geography-api] fetchDistrict error:', err);
    throw err;
  }
}

export async function createDistrict(payload: CreateDistrictInput): Promise<District> {
  const res = await apiClient.post('/v1/admin/districts', payload);
  if (res.data?.data) return res.data.data;
  throw new Error(res.data?.message || `Failed to create district (${res.status})`);
}

export async function updateDistrict(idOrCode: string, payload: UpdateDistrictInput): Promise<District> {
  const res = await apiClient.patch(`/v1/admin/districts/${encodeURIComponent(idOrCode)}`, payload);
  if (res.data?.data) return res.data.data;
  throw new Error(res.data?.message || `Failed to update district (${res.status})`);
}

export async function updateDistrictStatus(idOrCode: string, status: string): Promise<District> {
  const res = await apiClient.patch(`/v1/admin/districts/${encodeURIComponent(idOrCode)}/status`, { status });
  if (res.data?.data) return res.data.data;
  throw new Error(res.data?.message || `Failed to update district status (${res.status})`);
}

export async function deleteDistrict(idOrCode: string): Promise<void> {
  await apiClient.delete(`/v1/admin/districts/${encodeURIComponent(idOrCode)}`);
}

export async function seedBaselineDistricts(): Promise<{ seeded: number; skipped: number; message?: string }> {
  const res = await syncLgdDistricts();
  return { seeded: res.inserted, skipped: res.skipped, message: res.message };
}

// ==========================================
// 4. SUB-DISTRICTS
// ==========================================

export async function fetchSubDistricts(
  params: SubDistrictQueryParams = {},
  options?: AbortableRequestOptions,
): Promise<PaginatedSubDistrictsResponse> {
  try {
    const res = await apiClient.get('/v1/admin/sub-districts', { params, signal: options?.signal });
    if (res.data?.data && Array.isArray(res.data.data.items)) return res.data.data;
    throw new Error(res.data?.message || `Failed to fetch sub-districts (${res.status})`);
  } catch (err) {
    if (isAbortError(err)) throw err;
    console.error('[geography-api] fetchSubDistricts error:', err);
    throw err;
  }
}

export async function fetchSubDistrict(idOrCode: string, options?: AbortableRequestOptions): Promise<SubDistrict> {
  try {
    const res = await apiClient.get(`/v1/admin/sub-districts/${encodeURIComponent(idOrCode)}`, { signal: options?.signal });
    if (res.data?.data) return res.data.data;
    throw new Error(res.data?.message || `Failed to fetch sub-district (${res.status})`);
  } catch (err) {
    if (isAbortError(err)) throw err;
    console.error('[geography-api] fetchSubDistrict error:', err);
    throw err;
  }
}

export async function createSubDistrict(payload: CreateSubDistrictInput): Promise<SubDistrict> {
  const res = await apiClient.post('/v1/admin/sub-districts', payload);
  if (res.data?.data) return res.data.data;
  throw new Error(res.data?.message || `Failed to create sub-district (${res.status})`);
}

export async function updateSubDistrict(idOrCode: string, payload: UpdateSubDistrictInput): Promise<SubDistrict> {
  const res = await apiClient.patch(`/v1/admin/sub-districts/${encodeURIComponent(idOrCode)}`, payload);
  if (res.data?.data) return res.data.data;
  throw new Error(res.data?.message || `Failed to update sub-district (${res.status})`);
}

export async function updateSubDistrictStatus(idOrCode: string, status: string): Promise<SubDistrict> {
  const res = await apiClient.patch(`/v1/admin/sub-districts/${encodeURIComponent(idOrCode)}/status`, { status });
  if (res.data?.data) return res.data.data;
  throw new Error(res.data?.message || `Failed to update sub-district status (${res.status})`);
}

export async function deleteSubDistrict(idOrCode: string): Promise<void> {
  await apiClient.delete(`/v1/admin/sub-districts/${encodeURIComponent(idOrCode)}`);
}

// ==========================================
// 5. DASHBOARD METRICS
// ==========================================

export async function fetchGeographicDashboardMetrics(): Promise<GeographicDashboardMetrics> {
  try {
    const res = await apiClient.get('/v1/admin/geography/metrics');
    if (res.data?.data) return res.data.data;
  } catch (err) {
    console.warn('[geography-api] Metrics endpoint fallback:', err);
  }

  return {
    countriesCount: 0,
    statesCount: 0,
    districtsCount: 0,
    subDistrictsCount: 0,
    recentImports: [],
  };
}

// ==========================================
// 6. LOCATION DROPDOWNS & CASCADES (Mercora Location Master)
// ==========================================

export async function getLocationCountries(options?: AbortableRequestOptions) {
  const res = await apiClient.get('/locations/countries', { signal: options?.signal });
  return res.data?.data || [];
}

export async function getLocationStates(countryId?: string, search?: string, options?: AbortableRequestOptions) {
  const res = await apiClient.get('/locations/states', {
    params: {
      ...(countryId ? { country_id: countryId } : {}),
      ...(search ? { search } : {}),
    },
    signal: options?.signal,
  });
  return res.data?.data || [];
}

export async function getLocationDistricts(stateId?: string, search?: string, options?: AbortableRequestOptions) {
  const res = await apiClient.get('/locations/districts', {
    params: {
      ...(stateId ? { state_id: stateId } : {}),
      ...(search ? { search } : {}),
    },
    signal: options?.signal,
  });
  return res.data?.data || [];
}

export async function getLocationSubDistricts(districtId?: string, search?: string, options?: AbortableRequestOptions) {
  const res = await apiClient.get('/locations/sub-districts', {
    params: {
      ...(districtId ? { district_id: districtId } : {}),
      ...(search ? { search } : {}),
    },
    signal: options?.signal,
  });
  return res.data?.data || [];
}
