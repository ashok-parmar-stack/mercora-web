"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Country } from '@mercora/shared-types';
import { fetchCountries } from '../../lib/geography-api';
import { ChevronDown, Search, X, Check, Globe } from 'lucide-react';

export interface CountrySelectProps {
  value?: string; // id or iso2Code
  onChange?: (country: Country | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  placeholder = 'Select country...',
  disabled = false,
  error,
  label,
  required = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchCountries({ limit: 100, status: 'ACTIVE' }, { signal: controller.signal })
      .then((res) => {
        if (!controller.signal.aborted) {
          setCountries(res.items);
        }
      })
      .catch((e) => {
        if (e.name !== 'AbortError' && !controller.signal.aborted) {
          console.error('Failed to load country select options', e);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    return () => {
      controller.abort();
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const selectedCountry = useMemo(() => {
    if (!value) return null;
    return (
      countries.find(
        (c) => c.id === value || c.iso2Code.toUpperCase() === value.toUpperCase(),
      ) || null
    );
  }, [countries, value]);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return countries;
    const term = search.toLowerCase().trim();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.officialName && c.officialName.toLowerCase().includes(term)) ||
        c.iso2Code.toLowerCase().includes(term) ||
        c.iso3Code.toLowerCase().includes(term) ||
        (c.phoneCode && c.phoneCode.includes(term)),
    );
  }, [countries, search]);

  const handleSelect = (country: Country) => {
    onChange?.(country);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  return (
    <div className={`flex flex-col gap-1.5 text-sm ${className}`} ref={containerRef}>
      {label && (
        <label className="font-semibold text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border bg-white text-left transition-all ${
            disabled
              ? 'bg-gray-100/70 border-gray-200 text-gray-400 cursor-not-allowed'
              : error
              ? 'border-red-300 ring-2 ring-red-100 hover:border-red-400'
              : isOpen
              ? 'border-brand-500 ring-2 ring-brand-100 shadow-xs'
              : 'border-gray-200 hover:border-gray-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {selectedCountry ? (
              <>
                <span className="w-6 h-4.5 rounded bg-gray-100 border border-gray-200 text-[11px] font-extrabold flex items-center justify-center text-gray-700 flex-shrink-0">
                  {selectedCountry.iso2Code}
                </span>
                <span className="truncate font-medium text-gray-900">
                  {selectedCountry.name}
                </span>
                {selectedCountry.phoneCode && (
                  <span className="text-xs text-gray-400 font-mono">
                    ({selectedCountry.phoneCode})
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-400 flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                {loading ? 'Loading countries...' : placeholder}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {selectedCountry && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear selection"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-brand-600' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-100">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, ISO, or phone..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-200 bg-white"
                />
              </div>
            </div>

            {/* List Options */}
            <div className="max-h-60 overflow-y-auto p-1 divide-y divide-gray-50">
              {filteredCountries.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-400">
                  No matching countries found
                </div>
              ) : (
                filteredCountries.map((country) => {
                  const isSelected = selectedCountry?.id === country.id;
                  return (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => handleSelect(country)}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 text-xs rounded-lg transition-colors text-left ${
                        isSelected
                          ? 'bg-brand-50 text-brand-900 font-bold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-4 rounded bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-600 flex items-center justify-center flex-shrink-0">
                          {country.iso2Code}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate font-medium">{country.name}</span>
                          {country.officialName && (
                            <span className="truncate text-[10px] text-gray-400">
                              {country.officialName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {country.currencyCode && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 text-gray-500">
                            {country.currencyCode}
                          </span>
                        )}
                        {country.phoneCode && (
                          <span className="text-[11px] font-mono text-gray-400">
                            {country.phoneCode}
                          </span>
                        )}
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};
