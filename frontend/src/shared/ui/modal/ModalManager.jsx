import { AnimatePresence } from "framer-motion";
import ConfirmModal from "./ConfirmModal";
import { getModalConfig } from "../../constants/modalConfigs";

/**
 * ModalManager — central modal controller
 * Usage with useModal hook
 * <ModalManager modal={modal} onClose={closeModal} onConfirm={handleConfirm} />
 */
export default function ModalManager({ modal, onClose, onConfirm }) {
  const { isOpen, type, data, onConfirm: customConfirm } = modal || {};

  if (!isOpen || !type) return null;

  const config = getModalConfig(type, data);
  if (!config) return null;

  const handleConfirm = () => {
    customConfirm?.();
    onConfirm?.();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={config.title}
      message={config.message}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      variant={config.variant}
    />
  );
}