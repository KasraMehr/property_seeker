import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { CALL_FORM } from "@/features/calls/config";
import callService from "@/features/calls/services/callService";

export default function CallFormModal({ isOpen, onClose, call = null, onSuccess, extraData = {} }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!call?.id;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await callService.update(call.id, data);
      } else {
        await callService.create(data);
      }
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={isEdit ? "ویرایش تماس" : "ثبت تماس جدید"}>
      <FormRenderer
        config={CALL_FORM}
        defaultValues={call || {}}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
        extraData={extraData}
      />
    </Modal>
  );
}