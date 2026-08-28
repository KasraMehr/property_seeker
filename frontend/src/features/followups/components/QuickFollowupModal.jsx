import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { QUICK_FOLLOWUP_FROM_CALL_FORM } from "@/features/followups/config";
import followupService from "@/features/followups/services/followupService";
import { toastService } from "@/lib/toast";
import useAuth from "@/features/auth/hooks/useAuth";

export default function QuickFollowupModal({ isOpen, onClose, call = null, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, user: currentUser?.id };
      await followupService.create(payload);
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