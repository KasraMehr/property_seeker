import { useState, useCallback, useRef } from "react";
import scraperService from "../services/scraperService";

export default function useScraper() {
  const [targets, setTargets] = useState([]);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  // Ignore responses from superseded requests (e.g. when search/page
  // changes faster than the network responds).
  const targetsEpoch = useRef(0);
  const runsEpoch = useRef(0);

  const fetchTargets = useCallback(async (params = {}) => {
    const epoch = ++targetsEpoch.current;
    setLoading(true);
    try {
      const res = await scraperService.getTargets({ page_size: 10, ...params });
      if (epoch !== targetsEpoch.current) return;

      const payload = res.data;

      const list = Array.isArray(payload) ? payload : (payload?.results ?? []);

      setTargets(list);
      setMeta(
        Array.isArray(payload)
          ? { count: payload.length, results: payload }
          : payload,
      );
    } finally {
      if (epoch === targetsEpoch.current) setLoading(false);
    }
  }, []);

  const fetchRuns = useCallback(async (params = {}) => {
    const epoch = ++runsEpoch.current;
    setLoading(true);
    try {
      const res = await scraperService.getRuns({ page_size: 10, ...params });
      if (epoch !== runsEpoch.current) return;
      const payload = res.data;
      const list = Array.isArray(payload) ? payload : (payload?.results ?? []);

      setRuns(list);
      setMeta(
        Array.isArray(payload)
          ? { count: payload.length, results: payload }
          : payload,
      );
    } finally {
      if (epoch === runsEpoch.current) setLoading(false);
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

  const bulkDeleteTargets = useCallback(
    async (ids) => {
      await scraperService.bulkDeleteTargets(ids);
      await fetchTargets({ page });
    },
    [fetchTargets, page],
  );

  const bulkToggleTargets = useCallback(
    async (enable_ids, disable_ids) => {
      await scraperService.bulkToggleTargets(enable_ids, disable_ids);
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

  const bulkCancelRuns = useCallback(
    async (cancel_ids, resume_ids) => {
      await scraperService.bulkCancelRuns(cancel_ids, resume_ids);
      await fetchRuns({ page });
    },
    [fetchRuns, page],
  );

  const bulkDeleteRuns = useCallback(
    async (ids) => {
      await scraperService.bulkDeleteRuns(ids);
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
    bulkDeleteTargets,
    bulkToggleTargets,
    triggerRun,
    resumeRun,
    cancelRun,
    deleteRun,
    bulkCancelRuns,
    bulkDeleteRuns,
  };
}
