import { useState, useCallback, useMemo } from "react";

/**
 * useResource — generic CRUD state management.
 *
 * Handles async state for any service with getAll/getById/create/update/remove.
 * Supports both axios responses (with .data) and raw payloads.
 */
export default function useResource(service) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ count: 0 });

  const fetchList = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await service.getAll(params);

        // 🔴 KEY FIX: extract .data from axios response, or use raw payload
        const payload = response?.data ?? response;

        const results = Array.isArray(payload)
          ? payload
          : payload?.results ?? [];

        const count = Array.isArray(payload)
          ? payload.length
          : payload?.count ?? 0;

        setData(results);
        setMeta({ count });
        return { data: results, count };
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const getById = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await service.getById(id);
        return response?.data ?? response;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const create = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const response = await service.create(payload);
        return response?.data ?? response;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const update = useCallback(
    async (id, payload) => {
      setLoading(true);
      try {
        const response = await service.update(id, payload);
        return response?.data ?? response;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const remove = useCallback(
    async (id) => {
      setLoading(true);
      try {
        await service.remove(id);
        setData((prev) => prev.filter((item) => item.id !== id));
        setMeta((prev) => ({ ...prev, count: Math.max(0, prev.count - 1) }));
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const refresh = useCallback(() => {}, []);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      meta,
      fetchList,
      getById,
      create,
      update,
      remove,
      refresh,
    }),
    [data, loading, error, meta, fetchList, getById, create, update, remove, refresh]
  );
}