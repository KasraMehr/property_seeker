import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
    syncToUrl: true,
  });

  const [callSource, setCallSourceState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const hasOwner = params.get("has_owner");

    if (hasOwner === "true") return "owners";
    if (hasOwner === "false") return "customers";

    return "all";
  });

  const setCallSource = useCallback(
    (value) => {
      const source = value || "all";

      setCallSourceState(source);
      query.setPage(1);

      const url = new URL(window.location.href);

      if (source === "owners") {
        url.searchParams.set("has_owner", "true");
      } else if (source === "customers") {
        url.searchParams.set("has_owner", "false");
      } else {
        url.searchParams.delete("has_owner");
      }

      window.history.replaceState({}, "", url);
    },
    [query.setPage],
  );

  const serverParams = useMemo(() => {
    const params = { ...query.queryParams };

    if (callSource === "owners") {
      params.has_owner = true;
    } else if (callSource === "customers") {
      params.has_owner = false;
    }

    return params;
  }, [query.queryParams, callSource]);

  const didFetch = useRef(false);

  useEffect(() => {
    if (!didFetch.current) {
      didFetch.current = true;
      fetchList(serverParams);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const prevQueryRef = useRef(null);
  const fetchTimerRef = useRef(null);

  useEffect(() => {
    const qs = JSON.stringify(serverParams);

    if (prevQueryRef.current !== null && prevQueryRef.current !== qs) {
      clearTimeout(fetchTimerRef.current);

      fetchTimerRef.current = setTimeout(() => {
        fetchList(serverParams);
      }, 500);
    }

    prevQueryRef.current = qs;

    return () => clearTimeout(fetchTimerRef.current);
  }, [serverParams, fetchList]);

  const refresh = useCallback(() => {
    fetchList(serverParams);
  }, [fetchList, serverParams]);

  const getById = useCallback(async (id) => {
    const res = await callService.getById(id);
    return res.data;
  }, []);

  const markFollowUpDone = useCallback(
    async (id) => {
      await callService.update(id, { follow_up_done: true });
      refresh();
    },
    [refresh],
  );

  const bulkRemove = useCallback(
    async (ids) => {
      await callService.bulkRemove(ids);
      refresh();
    },
    [refresh],
  );

  return {
    ...resourceState,
    fetchList,
    remove,
    markFollowUpDone,
    bulkRemove,

    callSource,
    setCallSource,

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
    queryParams: serverParams,
    totalPages: (count) => query.totalPages(count),
    refresh,
  };
}
