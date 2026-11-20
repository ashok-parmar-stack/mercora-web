import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return process.env.INTERNAL_BACKEND_URL ? `${process.env.INTERNAL_BACKEND_URL}/api` : 'http://127.0.0.1:5001/api';
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export async function fetchApi<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function postApi<T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}
