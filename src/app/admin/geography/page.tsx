"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  MapPin,
  Building2,
  Building,
  Navigation,
  Milestone,
  Mail,
  Home,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Database,
  ShieldCheck,
  Check,
  ExternalLink,
  ChevronRight,
  Info,
  X,
  FileCode,
  GitBranch,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { CountrySelect } from '../../../components/geography/CountrySelect';
import { LocationCascader } from '../../../components/geography/LocationCascader';
import { Country, GeographicDashboardMetrics } from '@mercora/shared-types';

import {
  fetchGeographicDashboardMetrics,
  seedBaselineCountries,
  seedBaselineStates,
  seedBaselineDistricts,
  syncLgdStates,
  syncLgdDistricts,
  syncLgdSubDistricts,
  syncAllGovernmentGeography,
  resetAndSyncAllGeography,
} from '../../../lib/geography-api';
import { useUIStore } from '../../../lib/store/ui-store';

interface GovernmentDataset {
  id: string;
  dataset: string;
  source: 'LGD';
  frequency: string;
  records: number;
  status: 'Synchronized' | 'Syncing' | 'Pending';
  sourceFullName: string;
  apiEndpoint: string;
  lastSync: string;
  stagingTable: string;
  duplicatePolicy: string;
  fields: string[];
}

export default function GeographicDashboardPage() {
  const addToast = useUIStore((s) => s.addToast);
  const [metrics, setMetrics] = useState<GeographicDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingDatasetId, setSyncingDatasetId] = useState<string | null>(null);
  const [viewingDataset, setViewingDataset] = useState<GovernmentDataset | null>(null);
  const [selectedDemoCountry, setSelectedDemoCountry] = useState<Country | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await fetchGeographicDashboardMetrics();
      setMetrics(data);
    } catch (e) {
      console.error('Failed to load geographic metrics', e);
      setMetrics({
        countriesCount: 0,
        statesCount: 0,
        districtsCount: 0,
        subDistrictsCount: 0,
        recentImports: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleSyncBaseline = async () => {
    setSyncingAll(true);
    try {
      const res = await syncAllGovernmentGeography();
      addToast(
        'success',
        'Geographic Master Synchronized',
        res?.message || 'Official LGD datasets synchronized to database.',
      );
      await loadMetrics();
    } catch (err: any) {
      addToast('error', 'Sync Failed', err?.message || 'Failed to sync geographic baseline');
    } finally {
      setSyncingAll(false);
    }
  };

  const handleResetAndSync = () => {
    setIsResetModalOpen(true);
  };

  const executeResetAndSync = async () => {
    setSyncingAll(true);
    try {
      const res = await resetAndSyncAllGeography();
      addToast(
        'success',
        'Database Reset & Synchronized',
        res?.message || 'All location master tables cleared and synchronized fresh from LGD.',
      );
      setIsResetModalOpen(false);
      await loadMetrics();
    } catch (err: any) {
      addToast('error', 'Reset Failed', err?.message || 'Failed to reset and sync geography');
    } finally {
      setSyncingAll(false);
    }
  };

  const handleSyncDataset = async (datasetId: string) => {
    setSyncingDatasetId(datasetId);

    try {
      if (datasetId === 'lgd-states') {
        const res = await syncLgdStates();
        addToast('success', 'LGD States Sync Complete', res?.message || 'States & UTs synchronized from LGD.');
      } else if (datasetId === 'lgd-districts') {
        const res = await syncLgdDistricts();
        addToast('success', 'LGD Districts Sync Complete', res?.message || 'Districts synchronized from LGD.');
      } else if (datasetId === 'lgd-subdistricts') {
        const res = await syncLgdSubDistricts();
        addToast('success', 'LGD Sub-Districts Sync Complete', res?.message || 'Sub-districts synchronized from LGD.');
      } else {
        const res = await seedBaselineCountries();
        addToast('success', 'Country Master Verified', res?.message || 'Country registry verified.');
      }
      await loadMetrics();
    } catch (err: any) {
      addToast('error', 'Sync Failed', err?.message || 'Failed to sync dataset');
    } finally {
      setSyncingDatasetId(null);
    }
  };

  const handleSyncAllPipelines = async () => {
    setSyncingAll(true);

    try {
      const res = await syncAllGovernmentGeography();
      addToast(
        'success',
        'All Government Pipelines Synchronized',
        res?.message || 'Official LGD and India Post datasets synchronized to database.',
      );
      await loadMetrics();
    } catch (err: any) {
      addToast('error', 'Sync Failed', err?.message || 'Failed to sync all pipelines');
    } finally {
      setSyncingAll(false);
    }
  };

  const datasets: GovernmentDataset[] = [
    {
      id: 'lgd-states',
      dataset: 'States & Union Territories',
      source: 'LGD',
      frequency: 'Monthly',
      records: metrics?.statesCount || 0,
      status: metrics?.statesCount && metrics.statesCount > 0 ? 'Synchronized' : 'Pending',
      sourceFullName: 'Local Government Directory (Ministry of Panchayati Raj, Govt of India)',
      apiEndpoint: 'https://lgd.gov.in/ws/stateList',
      lastSync: metrics?.statesCount && metrics.statesCount > 0 ? 'Live in Database' : 'Pending Synchronization',
      stagingTable: 'staging_lgd_states',
      duplicatePolicy: 'Natural composite match on (lgd_code, country_id)',
      fields: ['state_code', 'state_name_english', 'state_name_local', 'census_2011_code', 'state_or_ut'],
    },
    {
      id: 'lgd-districts',
      dataset: 'Districts & Administrative Divisions',
      source: 'LGD',
      frequency: 'Monthly',
      records: metrics?.districtsCount || 0,
      status: metrics?.districtsCount && metrics.districtsCount > 0 ? 'Synchronized' : 'Pending',
      sourceFullName: 'Local Government Directory (Ministry of Panchayati Raj, Govt of India)',
      apiEndpoint: 'https://lgd.gov.in/ws/districtList',
      lastSync: metrics?.districtsCount && metrics.districtsCount > 0 ? 'Live in Database' : 'Pending Synchronization',
      stagingTable: 'staging_lgd_districts',
      duplicatePolicy: 'Composite match on (district_code, state_id)',
      fields: ['district_code', 'district_name_english', 'state_code', 'census_2011_code', 'headquarters'],
    },
    {
      id: 'lgd-subdistricts',
      dataset: 'Sub-Districts (Talukas / Tehsils)',
      source: 'LGD',
      frequency: 'Monthly',
      records: metrics?.subDistrictsCount || 0,
      status: metrics?.subDistrictsCount && metrics.subDistrictsCount > 0 ? 'Synchronized' : 'Pending',
      sourceFullName: 'Local Government Directory (Ministry of Panchayati Raj, Govt of India)',
      apiEndpoint: 'https://lgd.gov.in/ws/subdistrictList',
      lastSync: metrics?.subDistrictsCount && metrics.subDistrictsCount > 0 ? 'Live in Database' : 'Pending Synchronization',
      stagingTable: 'staging_lgd_sub_districts',
      duplicatePolicy: 'Composite match on (sub_district_code, district_id)',
      fields: ['sub_district_code', 'sub_district_name_english', 'district_code', 'census_2011_code'],
    },
  ];

  const totalGeoRecords =
    (metrics?.countriesCount || 0) +
    (metrics?.statesCount || 0) +
    (metrics?.districtsCount || 0) +
    (metrics?.subDistrictsCount || 0);

  const administrativeTiers = [
    {
      level: 1,
      name: 'Countries',
      count: `${metrics?.countriesCount ?? 0} in Database`,
      active: true,
      step: 'Tier 1 — Live',
      description: 'ISO-3166 global country registry, dialing codes, and currencies',
      href: '/admin/countries',
      icon: Globe,
      color: 'from-blue-600 to-indigo-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      level: 2,
      name: 'States / Provinces',
      count: `${metrics?.statesCount ?? 0} in Database`,
      active: true,
      step: 'Tier 2 — Live',
      description: 'LGD states, union territories, and regional divisions',
      href: '/admin/states',
      icon: Layers,
      color: 'from-indigo-600 to-purple-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      level: 3,
      name: 'Districts',
      count: `${metrics?.districtsCount ?? 0} in Database`,
      active: true,
      step: 'Tier 3 — Live',
      description: 'Administrative districts (e.g. Morbi, Rajkot, Ahmedabad)',
      href: '/admin/districts',
      icon: Building2,
      color: 'from-purple-600 to-pink-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      level: 4,
      name: 'Sub-Districts',
      count: `${metrics?.subDistrictsCount ?? 0} in Database`,
      active: true,
      step: 'Tier 4 — Live',
      description: 'Talukas, Tehsils, Blocks, and County Subdivisions',
      href: '/admin/sub-districts',
      icon: Navigation,
      color: 'from-pink-600 to-rose-600',
      badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-950 via-slate-900 to-gray-900 text-white p-6 sm:p-8 shadow-xl border border-gray-800">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-brand-500 text-white shadow-2xs">
                Phase 1 Execution
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Step 2 Active: States Master
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                LGD & India Post Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Geographic Master Architecture
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Standardized 8-tier normalized geographic hierarchy for Mercora B2B platform.
              Powering ceramic cluster localization, company addresses, shipping routes, and trade data.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleResetAndSync}
              disabled={syncingAll}
              className="px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold backdrop-blur-xs border border-rose-500/30 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Clear all geographic tables, restart identity counters, and re-sync fresh from LGD"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
              {syncingAll ? 'Resetting...' : 'Reset & Re-Sync'}
            </button>
            <button
              type="button"
              onClick={handleSyncBaseline}
              disabled={syncingAll}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-xs border border-white/10 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Seed baseline countries"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
              {syncingAll ? 'Syncing...' : 'Sync Baseline'}
            </button>
            <Link
              href="/admin/countries"
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              Manage Countries
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col gap-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Total Geo Records
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-gray-900">
              {loading ? '...' : totalGeoRecords.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Live DB
            </span>
          </div>
          <span className="text-[11px] text-gray-500">Live Database Records</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col gap-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Master Hierarchy
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-gray-900">4 Tiers</span>
            <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
              Normalized
            </span>
          </div>
          <span className="text-[11px] text-gray-500">Strict foreign-key chains</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col gap-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Official Sources
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-gray-900">LGD Pipeline</span>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
              Gov of India
            </span>
          </div>
          <span className="text-[11px] text-gray-500">Automated directory sync</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col gap-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Active Registry
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-emerald-600">4 Tiers Live</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
              Ready
            </span>
          </div>
          <span className="text-[11px] text-gray-500">Master tables synchronized</span>
        </div>
      </div>

      {/* ── 4-TIER GEOGRAPHIC ADMINISTRATIVE HIERARCHY CARDS ──────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-600" />
              Administrative Level Masters (4 Tables)
            </h2>
            <p className="text-xs text-gray-500">
              Independent master tables preserving granular relational integrity and government sources.
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200 self-start sm:self-auto">
            4 Administrative Tiers Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {administrativeTiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.level}
                className={`relative rounded-2xl border p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all duration-200 bg-white ${tier.active
                  ? 'border-brand-400 ring-2 ring-brand-100 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 shadow-2xs'
                  }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.color} text-white flex items-center justify-center shadow-xs flex-shrink-0`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${tier.badgeBg}`}
                  >
                    {tier.step}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400">
                    Tier {tier.level} Master
                  </span>
                  <h3 className="text-base font-bold text-gray-900">{tier.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      Total Records
                    </span>
                    <span className="text-sm font-extrabold text-gray-900">
                      {loading ? '...' : tier.count}
                    </span>
                  </div>

                  {tier.active ? (
                    <Link
                      href={tier.href}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
                    >
                      Open Master
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    <span className="text-[11px] font-medium text-gray-400">Upcoming Tier</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── GOVERNMENT DATASET SYNC STATUS (USER REQUESTED HIGHLIGHT) ──────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                Government Dataset Sync Status
              </h3>
              <p className="text-xs text-gray-500">
                Official LGD & India Post synchronization pipeline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Pipeline Ready
            </span>
            <button
              type="button"
              onClick={handleSyncAllPipelines}
              disabled={syncingAll}
              className="px-3 py-1 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Trigger sync on all 4 government pipelines"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
              Sync All
            </button>
          </div>
        </div>

        {/* Datasets Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-2xs bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#fafafa] border-b border-gray-200 text-xs font-semibold text-gray-700 font-instrument sticky top-0 z-10 select-none">
              <tr>
                <th className="px-0 py-0 border-b border-gray-200">
                  <div className="flex items-center justify-between h-10 px-4">
                    <span>Dataset Name</span>
                    <span className="h-4 w-[1px] bg-gray-300 flex-shrink-0 ml-3" aria-hidden="true" />
                  </div>
                </th>
                <th className="px-0 py-0 border-b border-gray-200">
                  <div className="flex items-center justify-between h-10 px-4">
                    <span>Source</span>
                    <span className="h-4 w-[1px] bg-gray-300 flex-shrink-0 ml-3" aria-hidden="true" />
                  </div>
                </th>
                <th className="px-0 py-0 border-b border-gray-200">
                  <div className="flex items-center justify-between h-10 px-4">
                    <span>Frequency</span>
                    <span className="h-4 w-[1px] bg-gray-300 flex-shrink-0 ml-3" aria-hidden="true" />
                  </div>
                </th>
                <th className="px-0 py-0 border-b border-gray-200 text-right">
                  <div className="flex items-center justify-between h-10 px-4">
                    <span className="flex-1 text-right">Records</span>
                    <span className="h-4 w-[1px] bg-gray-300 flex-shrink-0 ml-3" aria-hidden="true" />
                  </div>
                </th>
                <th className="px-0 py-0 border-b border-gray-200 text-center">
                  <div className="flex items-center justify-between h-10 px-4">
                    <span className="flex-1 text-center">Pipeline Status</span>
                    <span className="h-4 w-[1px] bg-gray-300 flex-shrink-0 ml-3" aria-hidden="true" />
                  </div>
                </th>
                <th className="px-0 py-0 border-b border-gray-200 text-right">
                  <div className="flex items-center justify-end h-10 px-4 border-l border-gray-200">
                    <span className="font-semibold text-gray-700">Action</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {datasets.map((item) => {
                const isSyncing = syncingDatasetId === item.id || (syncingAll && item.status === 'Syncing');
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                    onClick={() => setViewingDataset(item)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                          {item.dataset}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {item.lastSync}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border ${item.source === 'LGD'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                      >
                        {item.source}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {item.frequency}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900">
                      {item.records.toLocaleString('en-US')}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {isSyncing ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Syncing...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Synchronized
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          disabled={isSyncing}
                          onClick={() => handleSyncDataset(item.id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer border border-brand-200 disabled:opacity-50"
                          title="Trigger instant sync check"
                        >
                          {isSyncing ? 'Running...' : 'Sync'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewingDataset(item)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                          title="View dataset schema & endpoint specifications"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Sync Strategy Highlight Callout */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
              💡 Sync Strategy:
            </span>
            <p className="text-amber-800 leading-relaxed font-medium">
              Mercora synchronizes official government records monthly using staging tables with duplicate detection, preventing blind re-imports while tracking record origins.
            </p>
          </div>
        </div>
      </div>

      {/* ── 7-TIER CASCADING LOCATION SELECTOR ───────────────────────────── */}
      <LocationCascader />

      {/* ── TWO-COLUMN SECTION: DATA ARCHITECTURE VISUALIZER & COMPONENT PREVIEW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">


        {/* Left: 8-Tier Relational Architecture Hierarchy Diagram */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <GitBranch className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-gray-900">
                Relational Architecture (2 Master Branches)
              </h3>
              <p className="text-xs text-gray-500">
                Independent normalization separating Administrative divisions from Postal routing
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
            <div className="text-emerald-400 font-bold mb-1">// Branch 1: Administrative Master Hierarchy (LGD)</div>
            <div>countries (ISO 3166-1) <span className="text-emerald-400 font-bold">[Step 1 Live]</span></div>
            <div>│</div>
            <div>└── states (LGD: 36 States &amp; UTs)</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;│</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;└── districts (LGD: 780 Districts)</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── sub_districts (LGD: 7,240 Talukas / Tehsils)</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── cities (Municipalities &amp; Towns)</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;└── localities (Ceramic Zones &amp; Industrial Areas)</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── villages (Census Villages — Future)</div>
            <div className="text-amber-400 font-bold mt-3 mb-1">// Branch 2: Postal Routing Master (India Post)</div>
            <div>postal_codes (PIN Codes Directory)</div>
            <div>│</div>
            <div>└── post_offices (154,800 Delivery &amp; Branch Offices)</div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>
              <b>Design Principle:</b> Postal boundaries do not strictly follow municipal and taluka borders. By decoupling Postal Codes from Sub-Districts, addresses can map to valid PINs while maintaining exact administrative jurisdiction.
            </span>
          </div>
        </div>

        {/* Right: Reusable Component Showcase */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-gray-900">
                Live Reusable Component
              </h3>
              <p className="text-xs text-gray-500">
                Interactive preview of <code className="text-brand-600 font-mono text-[11px]">&lt;CountrySelect /&gt;</code>
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Directly utilized in user onboarding, supplier profiles, company addresses, and order billing. Queries active country master records with search and keyboard support.
          </p>

          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 flex flex-col gap-3">
            <CountrySelect
              label="Select Country of Operation"
              placeholder="Search or pick country..."
              value={selectedDemoCountry?.id}
              onChange={(country) => setSelectedDemoCountry(country)}
            />

            {selectedDemoCountry && (
              <div className="mt-2 p-3.5 rounded-xl bg-white border border-gray-200 text-xs flex flex-col gap-2 shadow-2xs">
                <div className="flex items-center justify-between font-bold text-gray-900">
                  <span className="text-sm">{selectedDemoCountry.name}</span>
                  <span className="text-brand-600 font-mono text-xs px-2 py-0.5 rounded bg-brand-50 border border-brand-200">
                    {selectedDemoCountry.iso2Code} / {selectedDemoCountry.iso3Code}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-500 text-[11px] pt-2 border-t border-gray-100">
                  <div>Dialing Code: <b className="text-gray-800">{selectedDemoCountry.phoneCode || 'N/A'}</b></div>
                  <div>Currency: <b className="text-gray-800">{selectedDemoCountry.currencyCode || 'N/A'}</b></div>
                  <div>Source: <b className="text-gray-800">{selectedDemoCountry.source}</b></div>
                  <div>
                    Status:{' '}
                    <b className={selectedDemoCountry.status?.isActive !== false ? 'text-emerald-600' : 'text-gray-500'}>
                      {selectedDemoCountry.status?.name || 'Active'}
                    </b>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <span className="font-semibold text-gray-400">Step 2 Next: StateSelect</span>
            <Link
              href="/admin/countries"
              className="text-brand-600 font-bold hover:underline flex items-center gap-1"
            >
              Open Countries Registry →
            </Link>
          </div>
        </div>
      </div>

      {/* ── DATASET DETAILS MODAL ─────────────────────────────────────────── */}
      {viewingDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${viewingDataset.source === 'LGD'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                    }`}
                >
                  {viewingDataset.source}
                </span>
                <h3 className="font-extrabold text-gray-900 text-sm">
                  {viewingDataset.dataset}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingDataset(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Official Government Authority
                </span>
                <span className="font-semibold text-gray-800 text-xs">
                  {viewingDataset.sourceFullName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                <div>
                  <span className="text-gray-400 block">Total Records:</span>
                  <b className="font-mono text-gray-900 text-sm">
                    {viewingDataset.records.toLocaleString('en-US')}
                  </b>
                </div>
                <div>
                  <span className="text-gray-400 block">Sync Frequency:</span>
                  <b className="text-gray-900">{viewingDataset.frequency}</b>
                </div>
                <div>
                  <span className="text-gray-400 block">Staging Table:</span>
                  <code className="text-brand-600 font-mono text-[11px] font-bold">
                    {viewingDataset.stagingTable}
                  </code>
                </div>
                <div>
                  <span className="text-gray-400 block">Pipeline Status:</span>
                  <span className="text-emerald-600 font-bold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Synchronized
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <span className="text-gray-400 block">Deduplication &amp; Idempotency Rule:</span>
                <span className="text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 font-mono text-[11px]">
                  {viewingDataset.duplicatePolicy}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-gray-400 block">Key Schema Attributes:</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingDataset.fields.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-mono text-[10px]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Last checked: {viewingDataset.lastSync}
              </span>
              <button
                type="button"
                onClick={() => setViewingDataset(null)}
                className="px-4 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset & Sync Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-gray-900">
                    Reset &amp; Re-Synchronize Geography
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    This action will clear all local location tables and execute a fresh live synchronization directly from the Government Local Government Directory (LGD).
                  </p>
                </div>
              </div>

              <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3.5 flex flex-col gap-2 text-xs">
                <span className="font-semibold text-rose-900 flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  What will be synchronized:
                </span>
                <ul className="text-rose-800 text-[11px] space-y-1 list-disc list-inside">
                  <li>Seed fresh Republic of India (<code className="font-mono">IN</code>) country record</li>
                  <li>Live sync all <b>36 Indian States &amp; UTs</b> from LGD</li>
                  <li>Live sync all <b>784 official Districts</b> from LGD</li>
                  <li>Reset sync history and telemetry logs</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                disabled={syncingAll}
                className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 font-semibold text-gray-700 text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeResetAndSync}
                disabled={syncingAll}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {syncingAll ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Resetting &amp; Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    Confirm Reset &amp; Re-Sync
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
