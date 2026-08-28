import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { CALL_FORM } from "@/features/calls/config";
import callService from "@/features/calls/services/callService";
import useAuthStore from "@/store/useAuthStore";
import { toastService } from "@/lib/toast";

export default function CallFormModal({
  isOpen,
  onClose,
  call = null,
  onSuccess,
  extraData = {},
}) {
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isEdit = !!call?.id;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        customer: Number(values.customer),
        property: values.property ? Number(values.property) : null,
        listing: values.listing ? Number(values.listing) : null,
        call_type: values.call_type,
        result: values.result,
        note: values.note || "",
        called_at: values.called_at || new Date().toISOString(),
        call_duration: values.call_duration ? Number(values.call_duration) : 0,
      };

      if (!isEdit && user?.id != null) {
        payload.handled_by = user.id;
      }

      if (isEdit) {
        await callService.update(call.id, payload);
        toastService.success("تماس با موفقیت ویرایش شد.");
      } else {
        await callService.create(payload);
        toastService.success("تماس با موفقیت ثبت شد.");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Call form submit error:", error);
      toastService.error(
        error?.response?.data?.detail || "خطا در ثبت اطلاعات تماس.",
      );
    } finally {
      setLoading(false);
    }
  };

  const defaultValues = call
    ? {
        ...call,
        customer: call.customer?.id ?? call.customer,
        property: call.property?.id ?? call.property,
        listing: call.listing?.id ?? call.listing,
        called_at: call.called_at || "",
        next_follow_up_at: call.next_follow_up_at || "",
      }
    : {
        customer: extraData?.customer || null,
        call_type: "outgoing",
        result: "answered",
        call_duration: 0,
        follow_up_done: false,
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
        defaultValues={defaultValues}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
        extraData={extraData}
      />
    </Modal>
  );
}
