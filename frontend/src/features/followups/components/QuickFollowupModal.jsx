import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { QUICK_FOLLOWUP_FROM_CALL_FORM } from "@/features/followups/config";
import followupService from "@/features/followups/services/followupService";
import { toastService } from "@/lib/toast";

export default function QuickFollowupModal({ isOpen, onClose, call = null, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await followupService.create(data);
      toastService.success("پیگیری با موفقیت ثبت شد.");
      onSuccess?.();
      onClose();
    } catch (error) {
      toastService.error(error?.response?.data?.detail || "خطا در ثبت پیگیری.");
    } finally {
      setLoading(false);
    }
  };

  const extraData = call ? { call } : {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="ثبت پیگیری از تماس">
      <FormRenderer
        config={QUICK_FOLLOWUP_FROM_CALL_FORM}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
        extraData={extraData}
      />
    </Modal>
  );
}