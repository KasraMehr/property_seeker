import { useState, useMemo, useCallback } from "react";
import { DEFAULT_SORT } from "@/features/listings/config";

const sortFn = (data, col, dir) => {
  const sorted = [...data];
  const d = dir === "asc" ? 1 : -1;

  switch (col) {
    case "price":
      sorted.sort((a, b) => {
        const av = a.listed_sale_price || a.listed_rent_amount || 0;
        const bv = b.listed_sale_price || b.listed_rent_amount || 0;
        return (av - bv) * d;
      });
      break;
    case "district":
      sorted.sort((a, b) => {
        const av = (a.district?.name || "").toLowerCase();
        const bv = (b.district?.name || "").toLowerCase();
        return av.localeCompare(bv) * d;
      });
      break;
    case "info":
      sorted.sort((a, b) => ((a.build_year || 0) - (b.build_year || 0)) * d);
      break;
    default:
      sorted.sort((a, b) => {
        let av = a[col];
        let bv = b[col];
        if (av == null) av = d === 1 ? Infinity : -Infinity;
        if (bv == null) bv = d === 1 ? Infinity : -Infinity;
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av < bv) return -1 * d;
        if (av > bv) return 1 * d;
        return 0;
      });
  }
  return sorted;
};

export default function useListingSort(data) {
  const [sort, setSort] = useState(DEFAULT_SORT);

  const toggle = useCallback((col) => {
    setSort((prev) =>
      prev.column === col
        ? { ...prev, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { column: col, direction: "desc" }
    );
  }, []);

  const sorted = useMemo(
    () => sortFn(data, sort.column, sort.direction),
    [data, sort.column, sort.direction]
  );

  const isActive = (col) => sort.column === col;
  const direction = (col) => (sort.column === col ? sort.direction : null);

  return { sorted, toggle, isActive, direction };
}