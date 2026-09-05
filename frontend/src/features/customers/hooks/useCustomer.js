import { useCallback, useEffect, useRef } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import useResourceQuery from "@/shared/templates/resource/hooks/useResourceQuery";
import customerService from "../services/customerService";
import { CUSTOMER_ALL_FILTERS } from "../config";

export default function useCustomer() {
  const { fetchList, getById, remove, ...resourceState } = useResource(customerService);

  const query = useResourceQuery({
    filterSchema: CUSTOMER_ALL_FILTERS,
    pageSize: 10,
    initialOrdering: "-created_at",
  });

  // ─── Fetch on mount ───
  const didFetch = useRef(false);
  useEffect(() => {
    if (!didFetch.current) {
      didFetch.current = true;
      fetchList(query.queryParams);
    }
  }, []); // eslint-disable-line

  // ─── Refetch when params change ───
  const prevQueryRef = useRef(null);
  useEffect(() => {
    const qs = JSON.stringify(query.queryParams);
    if (prevQueryRef.current !== null && prevQueryRef.current !== qs) {
      fetchList(query.queryParams);
    }
    prevQueryRef.current = qs;
  }, [query.queryParams, fetchList]);

  const refresh = useCallback(() => {
    return fetchList(query.queryParams);
  }, [fetchList, query.queryParams]);

  return {
    ...resourceState,
    getById,
    remove,
    refresh,

    // Filters (server-side via useResourceQuery)
    filters: query.filters,
    setFilter: query.setFilter,
    clearFilter: query.clearFilter,
    clearAll: query.clearAll,
    activeChips: query.activeChips,
    activeCount: query.activeCount,

    // Ordering
    ordering: query.ordering,
    setOrdering: query.setOrdering,

    // Pagination
    page: query.page,
    setPage: query.setPage,
    pageSize: query.pageSize,
    sort: query.sort,
    queryParams: query.queryParams,
    totalPages: query.totalPages,
  };
}