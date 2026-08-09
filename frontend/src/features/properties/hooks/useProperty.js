import { useCallback, useEffect, useRef } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import useResourceQuery from "@/shared/templates/resource/hooks/useResourceQuery";
import propertyService from "../services/propertyService";
import { PROPERTY_ALL_FILTERS } from "../config";

/**
 * useProperty — feature hook for Property CRUD.
 *
 * Composes generic resource hooks with property-specific service calls.
 */
export default function useProperty() {
  const { fetchList, remove, ...resourceState } = useResource(propertyService);
  const query = useResourceQuery({
    filterSchema: PROPERTY_ALL_FILTERS,
    pageSize: 25,
    initialOrdering: "-created_at",
  });

  // Auto-fetch on mount
  const didFetch = useRef(false);
  useEffect(() => {
    if (!didFetch.current) {
      didFetch.current = true;
      fetchList(query.queryParams);
    }
  }, []); // eslint-disable-line

  // Re-fetch when queryParams change (page, sort, filter)
  const prevQueryRef = useRef(null);
  useEffect(() => {
    const qs = JSON.stringify(query.queryParams);
    if (prevQueryRef.current !== null && prevQueryRef.current !== qs) {
      fetchList(query.queryParams);
    }
    prevQueryRef.current = qs;
  }, [query.queryParams, fetchList]);

  const refresh = useCallback(() => {
    fetchList(query.queryParams);
  }, [fetchList, query.queryParams]);

  return {
    // Spread stable resource state (data, loading, error, meta)
    ...resourceState,

    // Stable actions
    fetchList,
    remove,

    // From useResourceQuery
    filters: query.filters,
    setFilter: query.setFilter,
    clearFilter: query.clearFilter,
    clearAll: query.clearAll,
    activeChips: query.activeChips,
    activeCount: query.activeCount,
    ordering: query.ordering,
    setOrdering: query.setOrdering,
    page: query.page,
    setPage: query.setPage,
    pageSize: query.pageSize,
    sort: query.sort,
    queryParams: query.queryParams,
    totalPages: (count) => query.totalPages(count),

    // Business actions
    refresh,
  };
}