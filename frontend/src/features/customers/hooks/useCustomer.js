import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import customerService from "../services/customerService";

export default function useCustomer() {
  const { remove } = useResource(customerService);

  const [allData, setAllData] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [clientFilters, setClientFilters] = useState({});
  const [clientSearch, setClientSearch] = useState("");
  const [clientOrdering, setClientOrdering] = useState("-created_at");
  const [clientPage, setClientPage] = useState(1);
  const pageSize = 25;

  const fetchAll = useCallback(async () => {
    setLoadingAll(true);
    try {
      const res = await customerService.getAll({ page_size: 1000 });
      setAllData(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoadingAll(false);
    }
  }, []);

  const didFetch = useRef(false);
  useEffect(() => {
    if (!didFetch.current) {
      didFetch.current = true;
      fetchAll();
    }
  }, [fetchAll]);

  const refresh = useCallback(() => {
    fetchAll();
  }, [fetchAll]);

  /* ─── Client-side filtering ─── */
  const filteredData = useMemo(() => {
    let result = [...allData];

    if (clientSearch) {
      const s = clientSearch.toLowerCase();
      result = result.filter(
        (item) =>
          item.full_name?.toLowerCase().includes(s) ||
          item.phone?.includes(clientSearch) ||
          item.email?.toLowerCase().includes(s),
      );
    }

    if (clientFilters.customer_type?.length > 0) {
      result = result.filter((item) =>
        clientFilters.customer_type.includes(item.customer_type),
      );
    }

    if (clientFilters.status?.length > 0) {
      result = result.filter((item) =>
        clientFilters.status.includes(item.status),
      );
    }

    if (clientOrdering) {
      const desc = clientOrdering.startsWith("-");
      const key = desc ? clientOrdering.slice(1) : clientOrdering;
      result.sort((a, b) => {
        let aVal = a[key];
        let bVal = b[key];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        if (aVal < bVal) return desc ? 1 : -1;
        if (aVal > bVal) return desc ? -1 : 1;
        return 0;
      });
    }

    return result;
  }, [allData, clientSearch, clientFilters, clientOrdering]);

  /* ─── Client-side pagination ─── */
  const paginatedData = useMemo(() => {
    const start = (clientPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, clientPage]);

  const totalPagesCount = Math.ceil(filteredData.length / pageSize);

  const setFilter = useCallback((key, value) => {
    if (key === "search") {
      setClientSearch(value || "");
    } else {
      setClientFilters((prev) => ({ ...prev, [key]: value }));
    }
    setClientPage(1);
  }, []);

  const clearFilter = useCallback((key) => {
    setClientFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setClientPage(1);
  }, []);

  const clearAll = useCallback(() => {
    setClientFilters({});
    setClientSearch("");
    setClientPage(1);
  }, []);

  const activeChips = useMemo(() => {
    const chips = [];
    Object.entries(clientFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((v) => chips.push({ key, value: v }));
      } else if (value) {
        chips.push({ key, value });
      }
    });
    return chips;
  }, [clientFilters]);

  const getById = useCallback(async (id) => {
    const res = await customerService.getById(id);
    return res.data;
  }, []);

  return {
    data: paginatedData,
    loading: loadingAll,
    meta: { count: filteredData.length },
    remove,
    getById,
    refresh,
    filters: { ...clientFilters, search: clientSearch },
    setFilter,
    clearFilter,
    clearAll,
    activeChips,
    ordering: clientOrdering,
    setOrdering: (val) => {
      setClientOrdering(val);
      setClientPage(1);
    },
    page: clientPage,
    setPage: setClientPage,
    pageSize,
    sort: clientOrdering
      ? {
          key: clientOrdering.startsWith("-")
            ? clientOrdering.slice(1)
            : clientOrdering,
          dir: clientOrdering.startsWith("-") ? "desc" : "asc",
        }
      : null,
    totalPages: () => totalPagesCount,
  };
}