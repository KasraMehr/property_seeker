import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useResource from "@/shared/templates/resource/hooks/useResource";
import { LOCATION_ADAPTERS } from "../services/locationAdapters";

/**
 * Generic hook for one location level.
 * Backend lists are full arrays → search / parent filters are client-side.
 */
export default function useLocationLevel(levelKey) {
  const adapter = LOCATION_ADAPTERS[levelKey];
  const {
    fetchList,
    data,
    loading,
    error,
    meta,
    create,
    update,
    remove,
    getById,
  } = useResource(adapter);

  const [search, setSearch] = useState("");
  const [parentFilters, setParentFilters] = useState({});

  const didFetch = useRef(false);
  useEffect(() => {
    didFetch.current = false;
  }, [levelKey]);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchList({});
  }, [levelKey, fetchList]);

  const setParentFilter = useCallback((key, value) => {
    setParentFilters((prev) => {
      const next = { ...prev, [key]: value || "" };
      // clear dependents when parent changes
      if (key === "province") {
        delete next.city;
        delete next.district;
      }
      if (key === "city") {
        delete next.district;
      }
      return next;
    });
  }, []);

  const clearParentFilters = useCallback(() => setParentFilters({}), []);

  const filteredData = useMemo(() => {
    let rows = Array.isArray(data) ? data : [];

    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) => {
        const name = String(r.name ?? "").toLowerCase();
        const cityName = String(r.city_name ?? "").toLowerCase();
        const districtName = String(r.district_name ?? "").toLowerCase();
        const province = String(
          r.province ?? r.province_name ?? "",
        ).toLowerCase();
        return (
          name.includes(q) ||
          cityName.includes(q) ||
          districtName.includes(q) ||
          province.includes(q)
        );
      });
    }

    // City list serializer exposes province as NAME string — match by name if needed later
    if (parentFilters.city) {
      const cid = Number(parentFilters.city);
      rows = rows.filter(
        (r) => Number(r.city) === cid || Number(r.city_id) === cid,
      );
    }
    if (parentFilters.district) {
      const did = Number(parentFilters.district);
      rows = rows.filter(
        (r) => Number(r.district) === did || Number(r.district_id) === did,
      );
    }

    return rows;
  }, [data, search, parentFilters]);

  const refresh = useCallback(() => fetchList({}), [fetchList]);

  return {
    data: filteredData,
    rawData: data,
    loading,
    error,
    meta: { count: filteredData.length },
    search,
    setSearch,
    parentFilters,
    setParentFilter,
    clearParentFilters,
    create,
    update,
    remove,
    getById,
    refresh,
  };
}
