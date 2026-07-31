import { useState, useCallback } from "react";
import listingService from "@/features/listings/services/listingService";

/**
 * useListingsData — fetch listings with filter params
 * Returns: { listings, loading, error, fetchListings }
 */
const useListingsData = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchListings = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await listingService.getAll(params);
      // DRF format: { count, next, previous, results: [] }
      const data = response.data?.results ?? response.data ?? [];
      setListings(data);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "خطا در دریافت داده‌ها");
    } finally {
      setLoading(false);
    }
  }, []);

  return { listings, loading, error, fetchListings };
};

export default useListingsData;