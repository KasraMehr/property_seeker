import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { OWNER_FORM } from "@/features/owners/config";
import ownerService from "@/features/owners/services/ownerService";
import { toastService } from "@/lib/toast";

export default function OwnerFormModal({ isOpen, onClose, owner = null, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!owner?.id;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await ownerService.update(owner.id, data);
        toastService.success("مالک با موفقیت ویرایش شد.");
      } else {
        await ownerService.create(data);
        toastService.success("مالک جدید با موفقیت ثبت شد.");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      toastService.error(error?.response?.data?.detail || "خطا در ذخیره مالک.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={isEdit ? "ویرایش مالک" : "مالک جدید"}>
      <FormRenderer
        config={OWNER_FORM}
        defaultValues={owner || {}}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
