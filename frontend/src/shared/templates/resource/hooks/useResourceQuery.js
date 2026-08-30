import { useMemo, useCallback, useState } from "react";
import useResourceFilter from "./useResourceFilter";

/**
 * useResourceQuery — composes filters + ordering + pagination into query params.
 *
 * Also exposes derived UI values: totalPages, sort object.
 */
export default function useResourceQuery({
  filterSchema = [],
  filterOptions = {},
  initialPage = 1,
  pageSize = 25,
  initialOrdering = "-created_at",
} = {}) {
  const {
    filters,
    setFilter,
    clearFilter,
    clearAll,
    activeChips,
    activeCount,
    queryParams: filterParams,
  } = useResourceFilter(filterSchema, filterOptions);

  const [ordering, setOrdering] = useState(initialOrdering);
  const [page, setPage] = useState(initialPage);

  // Reset page when filters or ordering change
  const setFilterAndReset = useCallback(
    (key, value, label) => {
      setFilter(key, value, label);
      setPage(1);
    },
    [setFilter],
  );

  const setOrderingAndReset = useCallback((value) => {
    setOrdering(value);
    setPage(1);
  }, []);

  const clearAllAndReset = useCallback(() => {
    clearAll();
    setPage(1);
  }, [clearAll]);

  // Derive sort object from ordering string for UI
  const sort = useMemo(() => {
    if (!ordering) return null;
    const desc = ordering.startsWith("-");
    return {
      key: desc ? ordering.slice(1) : ordering,
      dir: desc ? "desc" : "asc",
    };
  }, [ordering]);

  // Build final query params for API
  const queryParams = useMemo(() => {
    return {
      ...filterParams,
      ordering,
      page,
      page_size: pageSize,
    };
  }, [filterParams, ordering, page, pageSize]);

  // Total pages helper
  const totalPages = useCallback(
    (totalCount) => {
      return Math.ceil((totalCount || 0) / pageSize) || 1;
    },
    [pageSize],
  );

  return {
    // Filters
    filters,
    setFilter: setFilterAndReset,
    clearFilter,
    clearAll: clearAllAndReset,
    activeChips,
    activeCount,

    // Ordering
    ordering,
    setOrdering: setOrderingAndReset,

    // Pagination
    page,
    setPage,
    pageSize,

    // Derived
    sort,
    queryParams,
    totalPages,
  };
}
