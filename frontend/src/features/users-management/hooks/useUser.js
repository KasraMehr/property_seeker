import { useCallback, useEffect, useRef } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import useResourceQuery from "@/shared/templates/resource/hooks/useResourceQuery";
import userService from "../services/userService";
import { USER_ALL_FILTERS } from "@/features/users-management/config";

export default function useUser() {
  const { fetchList, remove, ...resourceState } = useResource(userService);
  const query = useResourceQuery({
    filterSchema: USER_ALL_FILTERS,
    pageSize: 10,
    initialOrdering: "-created_at",
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
    remove,
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