"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  Layers,
  Building2,
  Navigation,
  CheckCircle2,
  RotateCcw,
  RefreshCw,
  Sparkles,
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
import {
  CustomLocationSelect,
  CustomSelectOption,
} from './CustomLocationSelect';

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

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [subDistricts, setSubDistricts] = useState<any[]>([]);

  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [selectedStateId, setSelectedStateId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedSubDistrictId, setSelectedSubDistrictId] = useState<string>('');

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingSubDistricts, setLoadingSubDistricts] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingLevel, setSyncingLevel] = useState<string | null>(null);

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
    countries,
    states,
    districts,
    subDistricts,
    onSelectionChange,
  ]);

  return (
    <div className={`flex flex-col gap-5 p-6 rounded-2xl bg-surface border border-border shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Cascading Location Selector</h3>
            <p className="text-[11px] text-text-muted">Official Government LGD Administrative Hierarchy</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleInsideSyncAll}
            disabled={syncingAll}
            className="text-xs font-bold text-white bg-primary hover:bg-primary-hover flex items-center gap-1.5 transition-all cursor-pointer px-3 py-1.5 rounded-xl shadow-xs disabled:opacity-50"
            title="Execute Parent-First Location Master Sync from LGD"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
            <span>{syncingAll ? 'Syncing...' : 'Sync Master Data'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors cursor-pointer px-2.5 py-1.5 rounded-xl hover:bg-surface-hover border border-border"
            title="Clear all selections"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {selectedStateId && (
        <div className="mt-2 p-3.5 rounded-xl bg-status-success-bg border border-status-success/30 text-xs flex items-center justify-between text-status-success">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
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

export default LocationCascader;
