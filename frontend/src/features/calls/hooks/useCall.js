import { useCallback, useEffect, useRef } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import useResourceQuery from "@/shared/templates/resource/hooks/useResourceQuery";
import callService from "../services/callService";
import { CALL_ALL_FILTERS } from "../config";

export default function useCall() {
  const { fetchList, remove, ...resourceState } = useResource(callService);
  const query = useResourceQuery({
    filterSchema: CALL_ALL_FILTERS,  
    pageSize: 25,
    initialOrdering: "-called_at",
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

  /* ─── Detail (fetch full object for modal) ─── */
  const getById = useCallback(async (id) => {
    const res = await callService.getById(id);
    return res.data;
  }, []);

  /* ─── Mark follow-up done ─── */
  const markFollowUpDone = useCallback(
    async (id) => {
      await callService.update(id, { follow_up_done: true });
      refresh();
    },
    [refresh]
  );

  /* ─── Bulk delete ─── */
  const bulkRemove = useCallback(
    async (ids) => {
      await Promise.all(ids.map((id) => callService.remove(id)));
      refresh();
    },
    [refresh]
  );

  return {
    ...resourceState,
    fetchList,
    remove,
    getById,
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