import { useState } from "react";

import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";

import { CALL_FORM } from "@/features/calls/config";
import callService from "@/features/calls/services/callService";

export default function CallFormModal({
  isOpen,
  onClose,
  call = null,
  onSuccess,
  extraData = {},
}) {
  const [loading, setLoading] = useState(false);

  const isEdit = !!call?.id;

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const payload = {
        customer: Number(values.customer),
        property: values.property ? Number(values.property) : null,
        call_type: values.call_type,
        result: values.result,
        note: values.note || "",
        called_at: values.called_at ? new Date(values.called_at).toISOString() : new Date().toISOString(),
        call_duration: values.call_duration ? Number(values.call_duration) : null,
        next_follow_up_at: values.next_follow_up_at ? new Date(values.next_follow_up_at).toISOString() : null,
      };

      if (isEdit) {
        await callService.update(call.id, payload);
      } else {
        await callService.create(payload);
      }

      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={isEdit ? "ویرایش تماس" : "ثبت تماس جدید"}
    >
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