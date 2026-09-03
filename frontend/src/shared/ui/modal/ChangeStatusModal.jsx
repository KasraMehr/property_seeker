import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { toastService } from "@/lib/toast";

const DEFAULT_ERROR_MESSAGE = "خطا در تغییر وضعیت.";

const defaultGetErrorMessage = (error) =>
  error?.response?.data?.detail ||
  error?.response?.data?.message ||
  DEFAULT_ERROR_MESSAGE;

/**
 * ChangeStatusModal — reusable base modal for changing an entity's status.
 *
 * Composes the existing Modal + FormRenderer. Callers pass a form config
 * (title, description, fields, actions) and an async `onSubmit` that performs
 * the API call and any success toast. The modal handles loading state, the
 * single/bulk title, the error toast, and the onSuccess/onClose contract.
 *
 * Props:
 * - isOpen, onClose, onSuccess
 * - items           : entities to change; isBulk = items.length > 1
 * - formConfig      : shared form config (see each feature's config folder)
 * - onSubmit        : async ({ items, values }) => Promise
 * - getErrorMessage : (error) => string; default: detail → message → generic
 * - size            : Modal size (default "md")
 */
export default function ChangeStatusModal({
  isOpen,
  onClose,
  onSuccess,
  items = [],
  formConfig,
  onSubmit,
  getErrorMessage = defaultGetErrorMessage,
  size = "md",
}) {
  const [loading, setLoading] = useState(false);
  const isBulk = items.length > 1;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await onSubmit?.({ items, values });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Status change error:", error);
      toastService.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const title = isBulk
    ? `${formConfig?.title || "تغییر وضعیت"} (${items.length})`
    : formConfig?.title || "تغییر وضعیت";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} title={title}>
      <FormRenderer
        config={formConfig}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}