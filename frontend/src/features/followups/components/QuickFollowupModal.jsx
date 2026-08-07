import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/components/FormRenderer";
import { QUICK_FOLLOWUP_FROM_CALL_FORM } from "@/features/followups/config";
import followupService from "@/features/followups/services/followupService";

export default function QuickFollowupModal({ isOpen, onClose, call = null, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await followupService.create(data);
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const extraData = call ? { call } : {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title="ثبت پیگیری از تماس">
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