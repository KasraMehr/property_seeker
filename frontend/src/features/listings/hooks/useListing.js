import { useCallback, useEffect, useMemo, useRef } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import useResourceQuery from "@/shared/templates/resource/hooks/useResourceQuery";
import listingService from "../services/listingService";
import { LISTING_ALL_FILTERS } from "../config";

/**
 * Client-side filters 
 */
function applyClientFilters(rows, filters = {}) {
  if (!Array.isArray(rows) || rows.length === 0) return rows;

  let result = rows;

  // search: title + external_id
  const search = (filters.search || "").toString().trim().toLowerCase();
  if (search) {
    result = result.filter((row) => {
      const title = (row.title || "").toLowerCase();
      const externalId = (row.external_id || "").toLowerCase();
      return title.includes(search) || externalId.includes(search);
    });
  }

  // status (multi)
  const statuses = normalizeMulti(filters.status);
  if (statuses.length > 0) {
    result = result.filter((row) => statuses.includes(row.status));
  }

  // review_status (multi)
  const reviewStatuses = normalizeMulti(filters.review_status);
  if (reviewStatuses.length > 0) {
    result = result.filter((row) => reviewStatuses.includes(row.review_status));
  }

  // deal_type - not exactly the same field
  const dealTypes = normalizeMulti(filters.deal_type);
  if (dealTypes.length > 0) {
    result = result.filter((row) => {
      const isSale = row.listed_sale_price != null;
      const isRent = row.listed_rent_amount != null;
      return (
        (dealTypes.includes("sale") && isSale) ||
        (dealTypes.includes("rent") && isRent)
      );
    });
  }

  return result;
}

function normalizeMulti(value) {
  if (value == null || value === "") return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function useListing() {
  const { fetchList, getById, remove, ...resourceState } =
    useResource(listingService);

  const query = useResourceQuery({
    filterSchema: LISTING_ALL_FILTERS,
    pageSize: 20,
    initialOrdering: "-last_seen_at",
  });

  const serverParams = useMemo(
    () => ({
      page: query.page,
      page_size: query.pageSize,
      // ordering: query.ordering,
    }),
    [query.page, query.pageSize],
  );

  // Auto-fetch on mount
  const didFetch = useRef(false);
  useEffect(() => {
    if (!didFetch.current) {
      didFetch.current = true;
      fetchList(serverParams);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch
  const prevServerRef = useRef(null);
  useEffect(() => {
    const key = JSON.stringify(serverParams);
    if (prevServerRef.current !== null && prevServerRef.current !== key) {
      fetchList(serverParams);
    }
    prevServerRef.current = key;
  }, [serverParams, fetchList]);

  const refresh = useCallback(() => {
    return fetchList(serverParams);
  }, [fetchList, serverParams]);

  // client-side filters
  const filteredData = useMemo(
    () => applyClientFilters(resourceState.data, query.filters),
    [resourceState.data, query.filters],
  );


  /** PUT /api/listing/<id>/review/ */
  const review = useCallback(
    async (listingId, review_status) => {
      const result = await listingService.review(listingId, review_status);
      await refresh();
      return result?.data ?? result;
    },
    [refresh],
  );

  /** PUT /api/listing/bulk/review-change-status/ */
  const bulkReview = useCallback(
    async (listingIds, review_status) => {
      const result = await listingService.bulkReview(listingIds, review_status);
      await refresh();
      return result?.data ?? result;
    },
    [refresh],
  );

  /**
   * POST /api/listing/<id>/promote/
   * data: { owner, deal_type, area?, title?, address?, property_type?, floor?, total_floors? }
   */
  const promote = useCallback(
    async (listingId, data) => {
      const result = await listingService.promote(listingId, data);
      await refresh();
      return result?.data ?? result;
    },
    [refresh],
  );

  return {
    // state
    ...resourceState,
    data: filteredData, // filtered for table
    rawData: resourceState.data, // actual data

    // resource actions
    fetchList,
    getById,
    remove,
    refresh,

    // query / filters / pagination
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

    // business actions
    review,
    bulkReview,
    promote,
  };
}