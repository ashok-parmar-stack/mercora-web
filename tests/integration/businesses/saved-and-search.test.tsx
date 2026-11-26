import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { BusinessSearch } from '@/features/businesses/components/listing/BusinessSearch';
import { useSavedBusinesses } from '@/features/saved-businesses/hooks/use-saved-businesses';
import { useBusinesses } from '@/features/businesses/hooks/use-businesses';

describe('Business Directory & Saved Businesses (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('FE-DIR-001: BusinessSearch renders totalFound, updates query, and calls onSubmit', () => {
    const onQueryChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <BusinessSearch
        query="steel"
        onQueryChange={onQueryChange}
        onSubmit={onSubmit}
        totalFound={42}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('steel');

    fireEvent.change(input, { target: { value: 'packaging' } });
    expect(onQueryChange).toHaveBeenCalledWith('packaging');

    fireEvent.submit(input.closest('form')!);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('FE-SAV-001: useSavedBusinesses toggles save/remove without duplicates', () => {
    const { result } = renderHook(() => useSavedBusinesses());

    act(() => {
      result.current.toggleSave('biz-1');
    });
    expect(result.current.isSaved('biz-1')).toBe(true);
    expect(result.current.savedIds).toEqual(['biz-1']);

    act(() => {
      result.current.toggleSave('biz-1');
    });
    expect(result.current.isSaved('biz-1')).toBe(false);
    expect(result.current.savedIds).toEqual([]);
  });

  it('FE-DIR-002: useBusinesses filters and searches instantaneously when full dataset is seeded', () => {
    const seed: any[] = [
      { id: '1', name: 'Apex Steel', slug: 'apex-steel', category: 'Metals', businessType: 'Manufacturer', city: 'Surat', state: 'Gujarat', isVerified: true, tier: 'Verified', rating: 4.8, reviewCount: 10 },
      { id: '2', name: 'Sun Pharma', slug: 'sun-pharma', category: 'Pharma', businessType: 'Exporter', city: 'Vadodara', state: 'Gujarat', isVerified: false, tier: 'Unverified', rating: 4.2, reviewCount: 5 },
    ];
    const { result } = renderHook(() =>
      useBusinesses({ initialBusinesses: seed, initialTotal: 2 }),
    );

    expect(result.current.businesses).toHaveLength(2);
    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.setFilters((prev) => ({ ...prev, query: 'pharma' }));
    });
    expect(result.current.businesses).toHaveLength(1);
    expect(result.current.businesses[0].name).toBe('Sun Pharma');

    act(() => {
      result.current.resetFilters();
    });
    expect(result.current.businesses).toHaveLength(2);
  });
});
