import { useCallback, useEffect, useRef } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import useResourceQuery from "@/shared/templates/resource/hooks/useResourceQuery";
import regionService from "../services/regionService";
import { REGION_FILTERS } from "../config";

export default function useRegion() {
  const { fetchList, ...resourceState } = useResource(regionService);
  const query = useResourceQuery({
    filterSchema: REGION_FILTERS,
    pageSize: 25,
    initialOrdering: "name",
  });

  const didFetch = useRef(false);
  useEffect(() => {
    if (!didFetch.current) {
      didFetch.current = true;
      fetchList(query.queryParams);
    }
  }, []); // eslint-disable-line

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
    ...resourceState,
    fetchList,
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
    refresh,
  };
}