import { useState, useEffect, useCallback } from 'react';
import { MasterSyncRun } from '@mercora/shared-types';
import { fetchSyncRuns, fetchSyncRunById, triggerHsnSync } from '../catalog-api';

export function useHsnSync(limit = 20) {
  const [syncRuns, setSyncRuns] = useState<MasterSyncRun[]>([]);
  const [activeRun, setActiveRun] = useState<MasterSyncRun | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRuns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchSyncRuns(limit);
      setSyncRuns(res || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load sync runs');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadRuns();
  }, [loadRuns]);

  const loadRunDetails = async (id: string) => {
    try {
      const res = await fetchSyncRunById(id);
      setActiveRun(res);
      return res;
    } catch (err: any) {
      setError(err?.message || 'Failed to load sync run details');
      return null;
    }
  };

  const triggerSync = async (source = 'ICEGATE') => {
    setIsSyncing(true);
    setError(null);
    try {
      const res = await triggerHsnSync({ source });
      await loadRuns();
      return res;
    } catch (err: any) {
      setError(err?.message || 'Sync failed');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    syncRuns,
    activeRun,
    isLoading,
    isSyncing,
    error,
    refetch: loadRuns,
    loadRunDetails,
    triggerSync,
  };
}
