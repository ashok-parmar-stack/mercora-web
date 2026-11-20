"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Globe,
  Layers,
  Building2,
  Navigation,
  Building,
  Mail,
  Home,
  CheckCircle2,
  RotateCcw,
  RefreshCw,
  Sparkles,
  Zap,
  ChevronDown,
  Search,
  X,
  Check,
} from 'lucide-react';
import {
  getLocationCountries,
  getLocationStates,
  getLocationDistricts,
  getLocationSubDistricts,
  syncAllGovernmentGeography,
  syncLgdDistricts,
  syncLgdSubDistricts,
} from '../../lib/geography-api';
import { useUIStore } from '../../lib/store/ui-store';

// ── CUSTOM SELECT COMPONENT ──────────────────────────────────────────────

interface CustomSelectOption {
  id: string;
  label: string;
  subLabel?: string;
  badge?: string;
  badgeColor?: string;
  extra?: any;
}

interface CustomSelectProps {
  label: string;
  tierNumber: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  placeholder?: string;
  value?: string;
  options: CustomSelectOption[];
  onChange: (value: string, option?: CustomSelectOption) => void;
  disabled?: boolean;
  loading?: boolean;
  onSyncInline?: () => void;
  syncingInline?: boolean;
  syncButtonLabel?: string;
  className?: string;
}

function CustomLocationSelect({
  label,
  tierNumber,
  icon: Icon,
  iconColor,
  placeholder = 'Select option...',
  value,
  options,
  onChange,
  disabled = false,
  loading = false,
  onSyncInline,
  syncingInline = false,
  syncButtonLabel,
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when opened and reset focused index
  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(-1);
      setTimeout(() => searchInputRef.current?.focus(), 40);
    } else {
      setSearch('');
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  const selectedOption = useMemo(() => {
    if (!value) return null;
    return options.find((o) => o.id === value) || null;
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const term = search.toLowerCase().trim();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(term) ||
        (o.subLabel && o.subLabel.toLowerCase().includes(term)) ||
        (o.badge && o.badge.toLowerCase().includes(term)),
    );
  }, [options, search]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === 'Enter' && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
      e.preventDefault();
      const chosen = filteredOptions[focusedIndex];
      onChange(chosen.id, chosen);
      setIsOpen(false);
    }
  };

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-option-item]');
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  return (
    <div className={`flex flex-col gap-1.5 text-xs relative ${className}`} ref={containerRef} onKeyDown={handleKeyDown}>
      {/* Label and Inline Sync Button */}
      <div className="flex items-center justify-between">
        <label className="font-bold text-gray-700 flex items-center gap-1.5 select-none">
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
          <span>{tierNumber}. {label}</span>
          {loading && <span className="text-[10px] text-brand-600 font-normal animate-pulse">(loading...)</span>}
        </label>

        {onSyncInline && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSyncInline();
            }}
            disabled={syncingInline}
            className="text-[10px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer hover:underline disabled:opacity-50"
            title={syncButtonLabel}
          >
            <Zap className={`w-2.5 h-2.5 ${syncingInline ? 'animate-spin' : ''}`} />
            {syncingInline ? 'Syncing...' : syncButtonLabel || 'Sync'}
          </button>
        )}
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
          disabled
            ? 'bg-gray-100/70 border-gray-200 text-gray-400 cursor-not-allowed'
            : isOpen
            ? 'border-brand-500 ring-2 ring-brand-100 bg-white shadow-xs'
            : selectedOption
            ? 'border-gray-300 bg-white text-gray-900 hover:border-gray-400 shadow-2xs'
            : 'border-gray-200 bg-gray-50/50 hover:bg-white text-gray-500 hover:border-gray-300 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {selectedOption ? (
            <>
              <span className="font-semibold text-gray-900 truncate">
                {selectedOption.label}
              </span>
              {selectedOption.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex-shrink-0 ${
                    selectedOption.badgeColor || 'bg-brand-50 text-brand-700 border border-brand-200'
                  }`}
                >
                  {selectedOption.badge}
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400 truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 text-gray-400">
          {selectedOption && !disabled && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-0.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-600' : ''}`} />
        </div>
      </button>

      {/* Custom Dropdown Menu Panel */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-72">
          {/* Search Box */}
          <div className="p-2 border-b border-gray-100 bg-gray-50/70">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setFocusedIndex(-1);
                }}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div ref={listRef} className="overflow-y-auto divide-y divide-gray-50 p-1 flex-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => {
                const isSelected = opt.id === value;
                const isFocused = index === focusedIndex;
                return (
                  <button
                    key={opt.id}
                    data-option-item
                    type="button"
                    onClick={() => {
                      onChange(opt.id, opt);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-brand-50 text-brand-900 font-bold'
                        : isFocused
                        ? 'bg-gray-100 text-gray-900'
                        : 'hover:bg-gray-50 text-gray-700 font-medium'
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{opt.label}</span>
                      {opt.subLabel && <span className="text-[10px] text-gray-400 font-normal truncate">{opt.subLabel}</span>}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {opt.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                            opt.badgeColor || 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
                <span>No results found for &ldquo;{search || label}&rdquo;</span>
                {onSyncInline && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSyncInline();
                    }}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 border border-brand-200 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    {syncButtonLabel || 'Sync from LGD'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── CASCADING LOCATION SELECTOR ──────────────────────────────────────────

export interface CascadedLocationSelection {
  country?: { id: string; name: string; isoCode: string };
  state?: { id: string; name: string; code: string; lgdCode?: string };
  district?: { id: string; name: string; code: string; lgdCode?: string };
  subDistrict?: { id: string; name: string; code: string; lgdCode?: string };
}

interface LocationCascaderProps {
  onSelectionChange?: (selection: CascadedLocationSelection) => void;
  className?: string;
}

export function LocationCascader({ onSelectionChange, className = '' }: LocationCascaderProps) {
  const addToast = useUIStore((s) => s.addToast);

  // Option lists
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [subDistricts, setSubDistricts] = useState<any[]>([]);

  // Selected values
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [selectedStateId, setSelectedStateId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedSubDistrictId, setSelectedSubDistrictId] = useState<string>('');

  // Loading states
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingSubDistricts, setLoadingSubDistricts] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingLevel, setSyncingLevel] = useState<string | null>(null);

  // 1. Initial: Load Countries
  useEffect(() => {
    loadCountriesData();
  }, []);

  async function loadCountriesData() {
    try {
      const list = await getLocationCountries();
      setCountries(list);
      const india = list.find((c: any) => c.isoCode === 'IN' || c.name === 'India');
      if (india) {
        setSelectedCountryId(india.id);
      } else if (list.length > 0) {
        setSelectedCountryId(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load countries dropdown', err);
    }
  }

  // 2. When Country changes -> load States
  useEffect(() => {
    if (!selectedCountryId) {
      setStates([]);
      return;
    }
    loadStatesData(selectedCountryId);
  }, [selectedCountryId]);

  async function loadStatesData(countryId: string) {
    setLoadingStates(true);
    try {
      const list = await getLocationStates(countryId);
      setStates(list);
    } catch (err) {
      console.error('Failed to load states', err);
    } finally {
      setLoadingStates(false);
    }
  }

  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    setSelectedStateId('');
    setSelectedDistrictId('');
    setSelectedSubDistrictId('');
    setDistricts([]);
    setSubDistricts([]);
  };

  // 3. When State changes -> load Districts
  const handleStateChange = async (stateId: string) => {
    setSelectedStateId(stateId);
    setSelectedDistrictId('');
    setSelectedSubDistrictId('');
    setSubDistricts([]);

    if (stateId) {
      await loadDistrictsData(stateId);
    } else {
      setDistricts([]);
    }
  };

  async function loadDistrictsData(stateId: string) {
    setLoadingDistricts(true);
    try {
      const list = await getLocationDistricts(stateId);
      setDistricts(list);
    } catch (err) {
      console.error('Failed to load districts', err);
    } finally {
      setLoadingDistricts(false);
    }
  }

  // 4. When District changes -> load Sub-Districts
  const handleDistrictChange = async (districtId: string) => {
    setSelectedDistrictId(districtId);
    setSelectedSubDistrictId('');

    if (districtId) {
      await loadSubDistricts(districtId);
    } else {
      setSubDistricts([]);
    }
  };

  async function loadSubDistricts(districtId: string) {
    setLoadingSubDistricts(true);
    try {
      const subDistList = await getLocationSubDistricts(districtId);
      setSubDistricts(subDistList);
    } catch (err) {
      console.error('Failed to load sub-districts', err);
    } finally {
      setLoadingSubDistricts(false);
    }
  }

  const handleSubDistrictChange = (subDistrictId: string) => {
    setSelectedSubDistrictId(subDistrictId);
  };

  const handleReset = () => {
    setSelectedStateId('');
    setSelectedDistrictId('');
    setSelectedSubDistrictId('');
    setDistricts([]);
    setSubDistricts([]);
  };

  // In-Side Full Sync
  const handleInsideSyncAll = async () => {
    setSyncingAll(true);
    try {
      const res = await syncAllGovernmentGeography();
      addToast('success', 'Location Master Synchronized', res?.message || 'LGD datasets synchronized.');

      if (selectedCountryId) await loadStatesData(selectedCountryId);
      if (selectedStateId) await loadDistrictsData(selectedStateId);
      if (selectedDistrictId) await loadSubDistricts(selectedDistrictId);
    } catch (err: any) {
      addToast('error', 'Sync Failed', err?.message || 'Failed to sync locations');
    } finally {
      setSyncingAll(false);
    }
  };

  // Inline sync for districts
  const handleInsideSyncDistricts = async () => {
    if (!selectedStateId) return;
    const currentState = states.find((s) => s.id === selectedStateId);
    setSyncingLevel('districts');
    try {
      const res = await syncLgdDistricts(currentState?.code);
      addToast('success', 'Districts Synchronized', res?.message || 'Districts synchronized from LGD.');
      await loadDistrictsData(selectedStateId);
    } catch (err: any) {
      addToast('error', 'Sync Failed', err?.message || 'Failed to sync districts');
    } finally {
      setSyncingLevel(null);
    }
  };

  // Inline sync for sub-districts
  const handleInsideSyncSubDistricts = async () => {
    if (!selectedDistrictId) return;
    const currentDist = districts.find((d) => d.id === selectedDistrictId);
    setSyncingLevel('subdistricts');
    try {
      const res = await syncLgdSubDistricts(currentDist?.code);
      addToast('success', 'Sub-Districts Synchronized', res?.message || 'Sub-districts synchronized from LGD.');
      await loadSubDistricts(selectedDistrictId);
    } catch (err: any) {
      addToast('error', 'Sync Failed', err?.message || 'Failed to sync sub-districts');
    } finally {
      setSyncingLevel(null);
    }
  };

  // Map options for custom selects
  const countryOptions = useMemo<CustomSelectOption[]>(
    () => countries.map((c) => ({ id: c.id, label: c.name, badge: c.isoCode || 'IN', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' })),
    [countries],
  );

  const stateOptions = useMemo<CustomSelectOption[]>(
    () =>
      states.map((s) => ({
        id: s.id,
        label: s.name,
        badge: s.lgdCode ? `LGD: ${s.lgdCode}` : s.code,
        badgeColor: s.type === 'UNION_TERRITORY' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200',
      })),
    [states],
  );

  const districtOptions = useMemo<CustomSelectOption[]>(
    () =>
      districts.map((d) => ({
        id: d.id,
        label: d.name,
        badge: d.lgdCode ? `LGD: ${d.lgdCode}` : undefined,
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      })),
    [districts],
  );

  const subDistrictOptions = useMemo<CustomSelectOption[]>(
    () =>
      subDistricts.map((sd) => ({
        id: sd.id,
        label: sd.name,
        badge: sd.lgdCode ? `LGD: ${sd.lgdCode}` : undefined,
        badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
      })),
    [subDistricts],
  );

  // Propagate selection to parent if callback provided
  useEffect(() => {
    if (onSelectionChange) {
      const countryObj = countries.find((c) => c.id === selectedCountryId);
      const stateObj = states.find((s) => s.id === selectedStateId);
      const distObj = districts.find((d) => d.id === selectedDistrictId);
      const subDistObj = subDistricts.find((sd) => sd.id === selectedSubDistrictId);

      onSelectionChange({
        country: countryObj ? { id: countryObj.id, name: countryObj.name, isoCode: countryObj.isoCode } : undefined,
        state: stateObj ? { id: stateObj.id, name: stateObj.name, code: stateObj.code, lgdCode: stateObj.lgdCode } : undefined,
        district: distObj ? { id: distObj.id, name: distObj.name, code: distObj.code, lgdCode: distObj.lgdCode } : undefined,
        subDistrict: subDistObj ? { id: subDistObj.id, name: subDistObj.name, code: subDistObj.code, lgdCode: subDistObj.lgdCode } : undefined,
      });
    }
  }, [
    selectedCountryId,
    selectedStateId,
    selectedDistrictId,
    selectedSubDistrictId,
  ]);

  return (
    <div className={`flex flex-col gap-5 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm ${className}`}>
      {/* Header with In-Side Sync & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Cascading Location Selector</h3>
            <p className="text-[11px] text-gray-500">Official Government LGD Administrative Hierarchy</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleInsideSyncAll}
            disabled={syncingAll}
            className="text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 flex items-center gap-1.5 transition-all cursor-pointer px-3 py-1.5 rounded-xl shadow-xs shadow-brand-500/20 disabled:opacity-50"
            title="Execute Parent-First Location Master Sync from LGD"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
            {syncingAll ? 'Syncing...' : 'Sync Master Data'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors cursor-pointer px-2.5 py-1.5 rounded-xl hover:bg-gray-100 border border-gray-200"
            title="Clear all selections"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* 4-Tier Custom Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tier 1: Country */}
        <CustomLocationSelect
          tierNumber={1}
          label="Country"
          icon={Globe}
          iconColor="text-blue-600"
          placeholder="Select country..."
          value={selectedCountryId}
          options={countryOptions}
          onChange={handleCountryChange}
        />

        {/* Tier 2: State / UT */}
        <CustomLocationSelect
          tierNumber={2}
          label="State / Union Territory"
          icon={Layers}
          iconColor="text-indigo-600"
          placeholder="Select state / UT..."
          value={selectedStateId}
          options={stateOptions}
          onChange={handleStateChange}
          disabled={!selectedCountryId}
          loading={loadingStates}
        />

        {/* Tier 3: District */}
        <CustomLocationSelect
          tierNumber={3}
          label="District"
          icon={Building2}
          iconColor="text-purple-600"
          placeholder="Select district..."
          value={selectedDistrictId}
          options={districtOptions}
          onChange={handleDistrictChange}
          disabled={!selectedStateId}
          loading={loadingDistricts}
          onSyncInline={selectedStateId && districts.length === 0 && !loadingDistricts ? handleInsideSyncDistricts : undefined}
          syncingInline={syncingLevel === 'districts'}
          syncButtonLabel="Sync Districts"
        />

        {/* Tier 4: Sub-District / Taluka */}
        <CustomLocationSelect
          tierNumber={4}
          label="Sub-District / Taluka"
          icon={Navigation}
          iconColor="text-pink-600"
          placeholder="Select sub-district / taluka..."
          value={selectedSubDistrictId}
          options={subDistrictOptions}
          onChange={handleSubDistrictChange}
          disabled={!selectedDistrictId}
          loading={loadingSubDistricts}
          onSyncInline={selectedDistrictId && subDistricts.length === 0 && !loadingSubDistricts ? handleInsideSyncSubDistricts : undefined}
          syncingInline={syncingLevel === 'subdistricts'}
          syncButtonLabel="Sync Sub-Districts"
        />
      </div>

      {/* Selection Summary Breadcrumb */}
      {selectedStateId && (
        <div className="mt-2 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs flex items-center justify-between text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">
              Hierarchy Selected: <b>{states.find((s) => s.id === selectedStateId)?.name}</b>
              {selectedDistrictId && <> &rarr; <b>{districts.find((d) => d.id === selectedDistrictId)?.name}</b></>}
              {selectedSubDistrictId && <> &rarr; <b>{subDistricts.find((sd) => sd.id === selectedSubDistrictId)?.name}</b></>}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
