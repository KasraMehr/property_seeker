import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { QUICK_CALL_FORM } from "@/features/calls/config";
import callService from "@/features/calls/services/callService";
import { toastService } from "../../../lib/toast";
export default function QuickCallModal({
  isOpen,
  onClose,
  relatedListing = null,
  relatedProperty = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);

    try {
      const payload = {
        ...data,
        related_listing: relatedListing?.id || null,
        related_property: relatedProperty?.id || null,
      };

      await callService.create(payload);

      toastService.success("تماس با موفقیت ثبت شد.");

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Quick call submit error:", error);

      toastService.error(error?.response?.data?.detail || "خطا در ثبت تماس.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title="ثبت تماس سریع">
      <FormRenderer
        config={QUICK_CALL_FORM}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
