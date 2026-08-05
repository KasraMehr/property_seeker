import { useState, useEffect, useCallback, useMemo } from "react";
import {toastService} from "@/lib/toast";

export default function useListPage(service, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(options.defaultSort || { column: "id", direction: "desc" });
  const [search, setSearch] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [selected, setSelected] = useState(new Set());

  const pageSize = options.pageSize || 10;

  const fetch = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await service.getAll(params);
      const results = response.data?.results ?? response.data ?? [];
      setData(results);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "خطا در دریافت داده‌ها");
    } finally {
      setLoading(false);
    }
  }, [service]);

  const refresh = useCallback(() => fetch(), [fetch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const remove = useCallback((id) => setPendingDeleteId(id), []);

  const confirmDelete = useCallback(async () => {
    if (pendingDeleteId == null) return;
    try {
      if (!service.remove) throw new Error("no remove");
      await service.remove(pendingDeleteId);
      toastService.success("حذف شد");
      refresh();
    } catch {
      toastService.error("خطا در حذف");
    } finally {
      setPendingDeleteId(null);
    }
  }, [pendingDeleteId, service, refresh]);

  const cancelDelete = useCallback(() => setPendingDeleteId(null), []);

  const toggleSort = useCallback((col) => {
    setSort((prev) =>
      prev.column === col
        ? { ...prev, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { column: col, direction: "desc" }
    );
  }, []);

  const toggleSelect = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback((ids) => {
    setSelected((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      const next = new Set(prev);
      ids.forEach((id) => {
        if (allSelected) next.delete(id);
        else next.add(id);
      });
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const sortedData = useMemo(() => {
    if (!sort.column) return data;
    const sorted = [...data];
    const d = sort.direction === "asc" ? 1 : -1;
    sorted.sort((a, b) => {
      let av = a[sort.column];
      let bv = b[sort.column];
      if (av == null) av = d === 1 ? Infinity : -Infinity;
      if (bv == null) bv = d === 1 ? Infinity : -Infinity;
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return -1 * d;
      if (av > bv) return 1 * d;
      return 0;
    });
    return sorted;
  }, [data, sort.column, sort.direction]);

  const filteredData = useMemo(() => {
    if (!search) return sortedData;
    const q = search.toLowerCase();
    return sortedData.filter((item) =>
      Object.values(item).some((v) =>
        v != null && String(v).toLowerCase().includes(q)
      )
    );
  }, [sortedData, search]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

  return {
    data: paginatedData,
    allData: data,
    loading,
    error,
    page,
    setPage,
    sort,
    toggleSort,
    search,
    setSearch,
    remove,
    pendingDeleteId,
    confirmDelete,
    cancelDelete,
    refresh,
    totalPages,
    totalCount: filteredData.length,
    selected,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
  };
}