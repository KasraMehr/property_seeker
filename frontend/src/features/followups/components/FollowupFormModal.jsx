import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { FOLLOWUP_FORM } from "@/features/followups/config";
import followupService from "@/features/followups/services/followupService";

export default function FollowupFormModal({ isOpen, onClose, followup = null, onSuccess, extraData = {} }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!followup?.id;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await followupService.update(followup.id, data);
      } else {
        await followupService.create(data);
      }
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={isEdit ? "ویرایش پیگیری" : "ثبت پیگیری جدید"}>
      <FormRenderer
        config={FOLLOWUP_FORM}
        defaultValues={followup || {}}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
        extraData={extraData}
      />
    </Modal>
  );
}