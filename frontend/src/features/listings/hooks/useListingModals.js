import { useState, useCallback } from "react";

export default function useListingModals() {
  const [detail, setDetail] = useState({ open: false, listing: null });
  const [assign, setAssign] = useState({ open: false, listingId: null });

  const openDetail = useCallback((listing) => setDetail({ open: true, listing }), []);
  const closeDetail = useCallback(() => setDetail({ open: false, listing: null }), []);

  const openAssign = useCallback((listingId) => setAssign({ open: true, listingId }), []);
  const closeAssign = useCallback(() => setAssign({ open: false, listingId: null }), []);

  return {
    detail,
    assign,
    openDetail,
    closeDetail,
    openAssign,
    closeAssign,
  };
}