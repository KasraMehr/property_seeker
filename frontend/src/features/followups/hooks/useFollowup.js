import { useCallback, useEffect, useRef } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import useResourceQuery from "@/shared/templates/resource/hooks/useResourceQuery";
import followupService from "../services/followupService";
import { FOLLOWUP_ALL_FILTERS } from "../config";

export default function useFollowup() {
  const { fetchList, ...resourceState } = useResource(followupService);
  const query = useResourceQuery({
    filterSchema: FOLLOWUP_ALL_FILTERS,
    pageSize: 25,
    initialOrdering: "-due_at",
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

  const complete = useCallback(
    async (id) => {
      await followupService.complete(id);
      refresh();
    },
    [refresh],
  );

  const cancel = useCallback(
    async (id) => {
      await followupService.cancel(id);
      refresh();
    },
    [refresh],
  );

  return {
    ...resourceState,
    fetchList,
    complete,
    cancel,
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