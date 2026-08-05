import { useState, useMemo, useCallback } from "react";
import useResourceFilter from "./useResourceFilter";

/**
 * useResourceQuery
 *
 * Combines:
 * - filters
 * - ordering
 * - pagination
 *
 * Produces the final backend query object.
 */

export default function useResourceQuery({
  filterSchema = [],
  filterOptions = {},

  initialPage = 1,
  pageSize = 25,

  initialOrdering = null,
} = {}) {
  const filter = useResourceFilter(filterSchema, filterOptions);

  const [page, setPageState] = useState(initialPage);

  const [ordering, setOrderingState] = useState(initialOrdering);

  const setPage = useCallback((value) => {
    setPageState(value);
  }, []);

  const setOrdering = useCallback((value) => {
    setOrderingState(value);

    setPageState(1);
  }, []);

  const setFilter = useCallback(
    (key, value) => {
      filter.setFilter(key, value);

      setPageState(1);
    },
    [filter],
  );

  const clearFilter = useCallback(
    (key) => {
      filter.clearFilter(key);

      setPageState(1);
    },
    [filter],
  );

  const clearAll = useCallback(() => {
    filter.clearAll();

    setPageState(1);
  }, [filter]);

  const queryParams = useMemo(
    () => ({
      ...filter.queryParams,

      ...(ordering && {
        ordering,
      }),

      page,

      page_size: pageSize,
    }),
    [filter.queryParams, ordering, page, pageSize],
  );

  return {
    filters: filter.filters,
    setFilter,
    clearFilter,
    clearAll,

    activeChips: filter.activeChips,
    activeCount: filter.activeCount,

    ordering,
    setOrdering,

    page,
    setPage,
    queryParams,
  };
}
