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

  const triggerRun = useCallback(async (id, mode, note) => {
    await scraperService.triggerRun(id, mode, note);
  }, []);

  const resumeRun = useCallback(async (uuid) => {
    await scraperService.resumeRun(uuid);
  }, []);

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
    triggerRun,
    resumeRun,
  };
}
