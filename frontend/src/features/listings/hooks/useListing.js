import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import useResourceQuery from "@/shared/templates/resource/hooks/useResourceQuery";
import listingService from "../services/listingService";
import { LISTING_ALL_FILTERS } from "../config";

/**
 * Compute server-side date params from a time_range preset.
 *
 * Logic:
 *   "today"      → first_seen_at in today  OR last_changed_at in today
 *   "yesterday"   → first_seen_at in yesterday OR last_changed_at in yesterday
 *   "last7days"  → first_seen_at >= now-7d OR last_changed_at >= now-7d
 *   "all"        → no time restriction
 *
 * Uses browser-local timezone (Asia/Tehran in production).
 */
function computeTimeRangeParams(timeRange) {
  if (!timeRange || timeRange === "all") return null;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const toIso = (d) => d.toISOString().split(".")[0]; // YYYY-MM-DDTHH:mm:ss

  switch (timeRange) {
    case "today":
      return { time_from: toIso(todayStart) };

    case "yesterday": {
      const yStart = new Date(todayStart);
      yStart.setDate(yStart.getDate() - 1);
      const yEnd = new Date(todayStart);
      yEnd.setSeconds(yEnd.getSeconds() - 1);
      return { time_from: toIso(yStart), time_to: toIso(yEnd) };
    }

    case "last7days": {
      const d7Start = new Date(todayStart);
      d7Start.setDate(d7Start.getDate() - 6);
      return { time_from: toIso(d7Start) };
    }

    default:
      return null;
  }
}

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

  // ─── Set default time_range to "today" on first render ───
  useEffect(() => {
    query.setFilter("time_range", "today", "امروز");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Tab-driven advertiser_type (server-side, not in filter chips) ───
  const [advertiserType, setAdvertiserType] = useState(null); // null | "agency" | "owner"

  const resetTab = useCallback(() => {
    setAdvertiserType(null);
  }, []);

  // Merge filter params with advertiserType + time range into one params object.
  // The raw "time_range" key is stripped; derived date params replace it.
  // On the very first render the filter state is still null (before the
  // mount-effect sets "today"), so we fall back to "today" via || here
  // to avoid an extra fetch without any time restriction.
  const serverParams = useMemo(() => {
    const { time_range, ...rest } = query.queryParams;
    const params = { ...rest };
    if (advertiserType) {
      params.advertiser_type = advertiserType;
    }
    const timeParams = computeTimeRangeParams(time_range || "today");
    if (timeParams) {
      Object.assign(params, timeParams);
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
