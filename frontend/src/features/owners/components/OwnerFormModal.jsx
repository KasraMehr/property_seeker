import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { OWNER_FORM } from "@/features/owners/config";
import ownerService from "@/features/owners/services/ownerService";
import { toastService } from "@/lib/toast";

export default function OwnerFormModal({
  isOpen,
  onClose,
  owner = null,
  defaultPhone = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!owner?.id;

  const defaultValues = {
    ...(owner || {}),
    ...(defaultPhone && !isEdit ? { phone: defaultPhone } : {}),
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      let createdObj = null;
      if (isEdit) {
        await ownerService.update(owner.id, data);
        toastService.success("مالک با موفقیت ویرایش شد.");
      } else {
        const res = await ownerService.create(data);
        const o = res.data?.owner;
        createdObj = o ? { id: o.id, full_name: o.full_name } : null;
        toastService.success("مالک جدید با موفقیت ثبت شد.");
      }
      onSuccess?.(createdObj);
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
        defaultValues={defaultValues}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
