import { useState, useCallback } from "react";

/**
 * useModal — modal state management
 * const { modal, openModal, closeModal } = useModal();
*/
export default function useModal() {
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    data: null,
    onConfirm: null,
  });

  const openModal = useCallback((type, data = {}, onConfirm = null) => {
    setModal({ isOpen: true, type, data, onConfirm });
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
    // Reset after animation
    setTimeout(() => {
      setModal({ isOpen: false, type: null, data: null, onConfirm: null });
    }, 300);
  }, []);

  return { modal, openModal, closeModal };
}