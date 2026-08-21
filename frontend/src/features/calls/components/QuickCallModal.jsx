import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { QUICK_CALL_FORM } from "@/features/calls/config";
import callService from "@/features/calls/services/callService";
import useAuthStore from "@/store/useAuthStore";
import { toastService } from "../../../lib/toast";
export default function QuickCallModal({
  isOpen,
  onClose,
  relatedListing = null,
  relatedProperty = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);

  const handleSubmit = async (data) => {
    setLoading(true);

    try {
      const payload = {
        customer: Number(data.customer),
        call_type: data.call_type,
        result: data.result,
        note: data.note || "",
        called_at: data.called_at
          ? new Date(data.called_at).toISOString()
          : new Date().toISOString(),
        listing: relatedListing?.id || null,
        property: relatedProperty?.id || null,
      };

      if (user?.id != null) {
        payload.handled_by = user.id;
      }

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
