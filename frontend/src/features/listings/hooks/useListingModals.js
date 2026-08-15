import { useState, useCallback } from "react";

export default function useListingModals() {
  const [detail, setDetail] = useState({ open: false, listing: null });
  const [promote, setPromote] = useState({ open: false, listing: null });
  const [registerCall, setRegisterCall] = useState({
    open: false,
    listing: null,
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
    openDetail,
    closeDetail,
    openPromote,
    closePromote,
    openRegisterCall,
    closeRegisterCall,
  };
}