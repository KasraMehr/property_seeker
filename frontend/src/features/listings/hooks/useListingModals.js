import { useState, useCallback } from "react";

export default function useListingModals() {
  const [detail, setDetail] = useState({ open: false, listing: null });
  const [promote, setPromote] = useState({ open: false, listing: null });
  const [registerCall, setRegisterCall] = useState({
    open: false,
    listing: null,
  });
  const [reviewStatus, setReviewStatus] = useState({
    open: false,
    listings: [],
  });

  const openDetail = useCallback(
    (listing) => setDetail({ open: true, listing }),
    [],
  );
  const closeDetail = useCallback(
    () => setDetail({ open: false, listing: null }),
    [],
  );

  const openPromote = useCallback(
    (listing) => setPromote({ open: true, listing }),
    [],
  );
  const closePromote = useCallback(
    () => setPromote({ open: false, listing: null }),
    [],
  );

  const openRegisterCall = useCallback(
    (listing) => setRegisterCall({ open: true, listing }),
    [],
  );
  const closeRegisterCall = useCallback(
    () => setRegisterCall({ open: false, listing: null }),
    [],
  );

  return {
    detail,
    promote,
    registerCall,
    reviewStatus,
    openDetail,
    closeDetail,
    openPromote,
    closePromote,
    openRegisterCall,
    closeRegisterCall,
    openReviewStatus: useCallback(
      (listings) => {
        const arr = Array.isArray(listings) ? listings : [listings];
        setReviewStatus({ open: true, listings: arr });
      },
      [],
    ),
    closeReviewStatus: useCallback(
      () => setReviewStatus({ open: false, listings: [] }),
      [],
    ),
  };
}