import { useMemo, useEffect, useState, useCallback } from "react";
import useFilter from "@/shared/filters/useFilter";
import useListingData from "@/features/listings/hooks/useListingData";
import { LISTING_FILTERS, FILTER_OPTIONS } from "@/constants/filterConfig";

export default function useListingQuery() {
  const [page, setPage] = useState(1);

  const {
    filters,
    setFilter,
    clearFilter,
    clearAll,
    activeChips,
    toQueryParams,
  } = useFilter(LISTING_FILTERS, FILTER_OPTIONS);

  const { listings, loading, error, fetchListings } = useListingData();

  // STABLE callback — never recreated
  const handleSearch = useCallback((v) => {
    setFilter("search", v || "");
  }, [setFilter]);

  const queryString = useMemo(() => {
    const params = toQueryParams();
    return new URLSearchParams(params).toString();
  }, [toQueryParams]);

  useEffect(() => {
    fetchListings(Object.fromEntries(new URLSearchParams(queryString)));
    setPage(1);
  }, [queryString]);

  const refresh = useCallback(() => {
    fetchListings(Object.fromEntries(new URLSearchParams(queryString)));
  }, [queryString, fetchListings]);

  return {
    listings,
    loading,
    error,
    page,
    setPage,
    filters,
    setFilter,
    clearFilter,
    clearAll,
    activeChips,
    handleSearch,
    refresh,
  };
}