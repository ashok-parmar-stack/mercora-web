import axios from 'axios';
import { SearchQueryParams, SearchResponse, PropertyItem, NFRReport } from '@mercora/shared-types';

const API_BASE = typeof window !== 'undefined'
  ? '/api'
  : process.env.INTERNAL_BACKEND_URL
    ? `${process.env.INTERNAL_BACKEND_URL.replace(/\/+$/, '')}/api`
    : (process.env.NEXT_PUBLIC_API_URL && /^https?:\/\//i.test(process.env.NEXT_PUBLIC_API_URL))
      ? process.env.NEXT_PUBLIC_API_URL
      : 'http://127.0.0.1:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

export async function searchProperties(
  params: SearchQueryParams = {},
  options?: { signal?: AbortSignal },
): Promise<SearchResponse> {
  const res = await apiClient.get<SearchResponse>('/properties/search', {
    params,
    signal: options?.signal,
  });
  return res.data;
}

export async function fetchHealth(): Promise<any> {
  const res = await apiClient.get('/health');
  return res.data;
}

export async function runNfrBenchmark(): Promise<NFRReport> {
  const res = await apiClient.get<NFRReport>('/nfr/benchmark');
  return res.data;
}

export async function toggleSimulatedFault(enable: boolean): Promise<any> {
  const res = await apiClient.post('/nfr/simulate-fault', { enable });
  return res.data;
}

export async function createProperty(payload: any): Promise<PropertyItem> {
  const res = await apiClient.post<PropertyItem>('/properties', payload);
  return res.data;
}
