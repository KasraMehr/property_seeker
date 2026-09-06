import { useCallback, useEffect, useRef } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import useResourceQuery from "@/shared/templates/resource/hooks/useResourceQuery";
import callService from "../services/callService";
import { CALL_ALL_FILTERS } from "../config";

export default function useCall() {
  const { fetchList, remove, ...resourceState } = useResource(callService);

  const query = useResourceQuery({
    filterSchema: CALL_ALL_FILTERS,
    pageSize: 10,
    initialOrdering: "-called_at",
  });

  const didFetch = useRef(false);
  useEffect(() => {
    if (!didFetch.current) {
      didFetch.current = true;
      fetchList(query.queryParams);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const prevQueryRef = useRef(null);
  const fetchTimerRef = useRef(null);
  useEffect(() => {
    const qs = JSON.stringify(query.queryParams);
    if (prevQueryRef.current !== null && prevQueryRef.current !== qs) {
      clearTimeout(fetchTimerRef.current);
      fetchTimerRef.current = setTimeout(() => {
        fetchList(query.queryParams);
      }, 500);
    }
    prevQueryRef.current = qs;
    return () => clearTimeout(fetchTimerRef.current);
  }, [query.queryParams, fetchList]);

  const refresh = useCallback(() => {
    fetchList(query.queryParams);
  }, [fetchList, query.queryParams]);

  const getById = useCallback(async (id) => {
    const res = await callService.getById(id);
    return res.data;
  }, []);

  const markFollowUpDone = useCallback(
    async (id) => {
      await callService.update(id, { follow_up_done: true });
      refresh();
    },
    [refresh]
  );

  const bulkRemove = useCallback(
    async (ids) => {
      await callService.bulkRemove(ids);
      refresh();
    },
    [refresh]
  );

  return {
    ...resourceState,
    fetchList,
    remove,
    markFollowUpDone,
    bulkRemove,
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