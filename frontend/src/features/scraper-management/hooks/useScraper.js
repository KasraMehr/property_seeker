import { useState, useCallback } from "react";
import scraperService from "../services/scraperService";

export default function useScraper() {
  const [targets, setTargets] = useState([]);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  const fetchTargets = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await scraperService.getTargets(params);
      const payload = res.data;

      const list = Array.isArray(payload) ? payload : (payload?.results ?? []);

      setTargets(list);
      setMeta(
        Array.isArray(payload)
          ? { count: payload.length, results: payload }
          : payload,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRuns = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await scraperService.getRuns(params);
      const payload = res.data;
      const list = Array.isArray(payload) ? payload : (payload?.results ?? []);

      setRuns(list);
      setMeta(
        Array.isArray(payload)
          ? { count: payload.length, results: payload }
          : payload,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTarget = useCallback(
    async (id, enabled) => {
      await scraperService.updateTarget(id, { enabled: !enabled });
      await fetchTargets({ page });
    },
    [fetchTargets, page],
  );

  const deleteTarget = useCallback(
    async (id) => {
      await scraperService.deleteTarget(id);
      await fetchTargets({ page });
    },
    [fetchTargets, page],
  );

  const triggerRun = useCallback(async (id, mode, configuration = {}) => {
    const config =
      configuration &&
      typeof configuration === "object" &&
      !Array.isArray(configuration)
        ? configuration
        : {};
    await scraperService.triggerRun(id, mode, config);
  }, []);

  const resumeRun = useCallback(async (uuid) => {
    await scraperService.resumeRun(uuid);
  }, []);

  const cancelRun = useCallback(
    async (uuid) => {
      await scraperService.cancelRun(uuid);
      await fetchRuns({ page });
    },
    [fetchRuns, page],
  );

  const deleteRun = useCallback(
    async (uuid) => {
      await scraperService.deleteRun(uuid);
      await fetchRuns({ page });
    },
    [fetchRuns, page],
  );

  return {
    targets,
    runs,
    loading,
    meta,
    page,
    setPage,
    fetchTargets,
    fetchRuns,
    toggleTarget,
    deleteTarget,
    triggerRun,
    resumeRun,
    cancelRun,
    deleteRun,
  };
}
