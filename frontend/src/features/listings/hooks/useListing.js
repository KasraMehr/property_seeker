import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import useResourceQuery from "@/shared/templates/resource/hooks/useResourceQuery";
import listingService from "../services/listingService";
import { LISTING_ALL_FILTERS } from "../config";

/**
 * Compute server-side date params from a time_range preset.
 *
 * Hourly ranges (1h, 3h, 6h, 12h):
 *   Uses OR across first_seen_at / last_changed_at (freshness logic).
 *
 * Daily ranges (today, yesterday, 3days, 7days):
 *   Uses published_at for publication-time filtering.
 *
 * "all": no time restriction.
 */
function computeTimeRangeParams(timeRange) {
  if (!timeRange || timeRange === "all") return null;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const toIso = (d) => d.toISOString().split(".")[0];

  switch (timeRange) {
    // ── Hourly ranges: freshness OR logic ──
    case "1h": {
      const from = new Date(now.getTime() - 1 * 60 * 60 * 1000);
      return { time_from: toIso(from) };
    }
    case "3h": {
      const from = new Date(now.getTime() - 3 * 60 * 60 * 1000);
      return { time_from: toIso(from) };
    }
    case "6h": {
      const from = new Date(now.getTime() - 6 * 60 * 60 * 1000);
      return { time_from: toIso(from) };
    }
    case "12h": {
      const from = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      return { time_from: toIso(from) };
    }

    // ── Daily ranges: published_at logic ──
    case "today":
      return { published_at_from: toIso(todayStart) };

    case "yesterday": {
      const yStart = new Date(todayStart);
      yStart.setDate(yStart.getDate() - 1);
      const yEnd = new Date(todayStart);
      yEnd.setSeconds(yEnd.getSeconds() - 1);
      return { published_at_from: toIso(yStart), published_at_to: toIso(yEnd) };
    }

    case "3days": {
      const d3Start = new Date(todayStart);
      d3Start.setDate(d3Start.getDate() - 2);
      return { published_at_from: toIso(d3Start) };
    }

    case "7days": {
      const d7Start = new Date(todayStart);
      d7Start.setDate(d7Start.getDate() - 6);
      return { published_at_from: toIso(d7Start) };
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
    initialOrdering: "-published_at",
    syncToUrl: true,
  });

  // ─── Set default time_range + freshness only when URL has no filter state ───
  useEffect(() => {
    // If URL already has filter params (from syncToUrl), don't override them
    if (query.filters.time_range != null || query.filters.freshness != null) return;
    query.setFilter("time_range", "today", "امروز");
    query.setFilter("freshness", "new", "جدید");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Tab-driven advertiser_type (server-side, not in filter chips) ───
  const [advertiserType, setAdvertiserType] = useState(null); // null | "agency" | "owner"

  const resetTab = useCallback(() => {
    setAdvertiserType(null);
  }, []);

  // Merge filter params with advertiserType + time range into one params object.
  // The raw "time_range" key is stripped; derived date params replace it.
  // "freshness" is passed through to the server for server-side filtering.
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

  // ─── Freshness computation: is_new / is_updated for each listing ───
  const FRESHNESS_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours

  const computeFreshness = useCallback((listing) => {
    const now = Date.now();
    const pub = listing.published_at ? new Date(listing.published_at).getTime() : 0;
    const created = listing.created_at ? new Date(listing.created_at).getTime() : 0;
    const changed = listing.last_changed_at ? new Date(listing.last_changed_at).getTime() : 0;

    // New: both published_at AND created_at within threshold
    const isNew =
      pub > 0 &&
      created > 0 &&
      now - pub < FRESHNESS_THRESHOLD_MS &&
      now - created < FRESHNESS_THRESHOLD_MS;

    // Updated: last_changed_at recent but NOT new
    const isUpdated = !isNew && changed > 0 && now - changed < FRESHNESS_THRESHOLD_MS;

    return { is_new: isNew, is_updated: isUpdated };
  }, []);

  // ─── Enrich rows with freshness badges (no client-side filtering) ───
  const filteredData = useMemo(() => {
    if (!resourceState.data) return [];

    return resourceState.data.map((row) => ({
      ...row,
      ...computeFreshness(row),
    }));
  }, [resourceState.data, computeFreshness]);

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

  // Params for badge counts — same as serverParams but WITHOUT advertiser_type,
  // so the counts endpoint returns totals across all tabs.
  const countParams = useMemo(() => {
    const { advertiser_type, ...rest } = serverParams;
    return rest;
  }, [serverParams]);

  return {
    ...resourceState,
    data: filteredData,

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

    // Badge counts params (filters without advertiser_type)
    countParams,
  };
}
