import { useCallback, useEffect, useMemo, useRef } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import useResourceQuery from "@/shared/templates/resource/hooks/useResourceQuery";
import listingService from "../services/listingService";
import { LISTING_ALL_FILTERS } from "../config";

function normalizeMulti(value) {
  if (value == null || value === "") return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function applyClientFilters(rows, filters = {}) {
  if (!Array.isArray(rows) || rows.length === 0) return rows;

  let result = rows;

  const search = (filters.search || "").toString().trim().toLowerCase();
  if (search) {
    result = result.filter((row) => {
      const title = (row.title || "").toLowerCase();
      const externalId = (row.external_id || "").toLowerCase();
      return title.includes(search) || externalId.includes(search);
    });
  }

  const statuses = normalizeMulti(filters.status);
  if (statuses.length > 0) {
    result = result.filter((row) => statuses.includes(row.status));
  }

  const reviewStatuses = normalizeMulti(filters.review_status);
  if (reviewStatuses.length > 0) {
    result = result.filter((row) =>
      reviewStatuses.includes(row.review_status),
    );
  }

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

export default function useListing() {
  const { fetchList, getById, remove, ...resourceState } =
    useResource(listingService);

  const query = useResourceQuery({
    filterSchema: LISTING_ALL_FILTERS,
    pageSize: 20,
    initialOrdering: "-last_seen_at",
  });

  // just pagination
  const serverParams = useMemo(
    () => ({
      page: query.page,
      page_size: query.pageSize,
    }),
    [query.page, query.pageSize],
  );

  const didFetch = useRef(false);
  useEffect(() => {
    if (!didFetch.current) {
      didFetch.current = true;
      fetchList(serverParams);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const filteredData = useMemo(
    () => applyClientFilters(resourceState.data, query.filters),
    [resourceState.data, query.filters],
  );

  const review = useCallback(
    async (listingId, review_status) => {
      const result = await listingService.review(listingId, review_status);
      await refresh();
      return result?.data ?? result;
    },
    [refresh],
  );

  const bulkReview = useCallback(
    async (listingIds, review_status) => {
      const result = await listingService.bulkReview(
        listingIds,
        review_status,
      );
      await refresh();
      return result?.data ?? result;
    },
    [refresh],
  );

  const promote = useCallback(
    async (listingId, data) => {
      const result = await listingService.promote(listingId, data);
      await refresh();
      return result?.data ?? result;
    },
    [refresh],
  );

  return {
    ...resourceState,
    data: filteredData,
    rawData: resourceState.data,

    fetchList,
    getById,
    remove,
    refresh,

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

    review,
    bulkReview,
    promote,
  };
}