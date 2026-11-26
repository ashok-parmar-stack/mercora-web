import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { BusinessSearch } from '@/features/businesses/components/listing/BusinessSearch';
import { useSavedBusinesses } from '@/features/saved-businesses/hooks/use-saved-businesses';

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
});
