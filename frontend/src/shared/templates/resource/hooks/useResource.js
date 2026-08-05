import { useState, useCallback } from "react";

/**
 * useResource
 *
 * Generic resource management hook.
 *
 * This hook does NOT know anything about a specific resource.
 * It only handles common CRUD operations and async states.
 *
 * Example:
 *
 * const resource = useResource({
 *   service: listingService
 * });
 *
 * Then feature hooks can extend it:
 *
 * useListing -> useResource + listing specific actions
 *
 */

export default function useResource({ service }) {
  // Resource data state
  const [data, setData] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination metadata
  //
  // Django REST Framework response:
  //
  // {
  //   count: 150,
  //   next: "...",
  //   previous: "...",
  //   results: []
  // }
  //

  const [meta, setMeta] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  // Fetch resource list
  //
  // params are converted to query params
  // by the service layer.
  //
  // Example:
  //
  // fetchList({
  //   search:"apartment",
  //   status:"active",
  //   page:1
  // })
  //

  const fetchList = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await service.getAll(params);

        const payload = response.data;

        // Support both:
        //
        // DRF pagination:
        // {results:[]}
        //
        // Simple array response:
        // []
        //

        const items = payload?.results ?? payload ?? [];

        setData(items);

        // Save pagination information
        if (payload?.results) {
          setMeta({
            count: payload.count ?? 0,
            next: payload.next,
            previous: payload.previous,
          });
        }

        return items;
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            err.message ||
            "Failed to fetch resource",
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service],
  );

  // Get single resource item
  const getById = useCallback(
    async (id) => {
      const response = await service.getById(id);

      return response.data;
    },
    [service],
  );

  // Create resource item
  const create = useCallback(
    async (payload) => {
      const response = await service.create(payload);

      return response.data;
    },
    [service],
  );

  // Update resource item
  const update = useCallback(
    async (id, payload) => {
      const response = await service.update(id, payload);

      return response.data;
    },
    [service],
  );

  // Delete resource item
  const remove = useCallback(
    async (id) => {
      const response = await service.remove(id);

      return response.data;
    },
    [service],
  );

  // Refresh helper
  // Feature hooks can store the
  // latest query params and call this.
  // Example:
  //
  // after delete:
  // await remove(id)
  // refresh()
  
  const refresh = useCallback(() => {
    // intentionally empty
    //
    // The feature hook should provide
    // the last query params.
    //
    // This keeps useResource generic.
  }, []);

  return {
    // state
    data,
    loading,
    error,

    // pagination
    meta,

    // CRUD
    fetchList,
    getById,
    create,
    update,
    remove,

    // helper
    refresh,
  };
}
