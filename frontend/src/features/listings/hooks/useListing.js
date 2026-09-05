import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import useResourceQuery from "@/shared/templates/resource/hooks/useResourceQuery";
import listingService from "../services/listingService";
import { LISTING_ALL_FILTERS } from "../config";

/**
 * useListing — server-side filtering for all filters.
 *
 * advertiser_type is managed separately (via tabs) and injected into
 * query params but excluded from filter chips / the filter bar.
 */
export default function useListing() {
  const { fetchList, getById, remove, ...resourceState } =
    useResource(listingService);

  const query = useResourceQuery({
    filterSchema: LISTING_ALL_FILTERS,
    pageSize: 10,
    initialOrdering: "-last_seen_at",
  });

  // ─── Tab-driven advertiser_type (server-side, not in filter chips) ───
  const [advertiserType, setAdvertiserType] = useState(null); // null | "agency" | "owner"

  const resetTab = useCallback(() => {
    setAdvertiserType(null);
  }, []);

  // Merge filter params with advertiserType into one params object
  const serverParams = useMemo(() => {
    const params = { ...query.queryParams };
    if (advertiserType) {
      params.advertiser_type = advertiserType;
    }
    return params;
  }, [query.queryParams, advertiserType]);

  // ─── Fetch on mount ───
  const didFetch = useRef(false);
  useEffect(() => {
    if (!didFetch.current) {
      didFetch.current = true;
      fetchList(serverParams);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Refetch when any param changes ───
  const prevParamsRef = useRef(null);
  useEffect(() => {
    const key = JSON.stringify(serverParams);
    if (prevParamsRef.current !== null && prevParamsRef.current !== key) {
      fetchList(serverParams);
    }
    prevParamsRef.current = key;
  }, [serverParams, fetchList]);

  const refresh = useCallback(() => {
    return fetchList(serverParams);
  }, [fetchList, serverParams]);

  return {
    ...resourceState,
    data: resourceState.data,

    fetchList,
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
    totalPages: (count) => query.totalPages(count),

    // Tab / advertiser type
    advertiserType,
    setAdvertiserType,
    resetTab,
  };
}
