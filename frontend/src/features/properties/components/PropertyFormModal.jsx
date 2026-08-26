import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { PROPERTY_FORM } from "@/features/properties/config";
import propertyService from "@/features/properties/services/propertyService";
import { toastService } from "@/lib/toast";

export default function PropertyFormModal({ isOpen, onClose, property = null, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!property?.id;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await propertyService.update(property.id, data);
        toastService.success("ملک با موفقیت ویرایش شد.");
      } else {
        await propertyService.create(data);
        toastService.success("ملک جدید با موفقیت ثبت شد.");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      toastService.error(error?.response?.data?.detail || "خطا در ذخیره ملک.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={isEdit ? "ویرایش ملک" : "ثبت ملک جدید"}>
      <FormRenderer
        config={PROPERTY_FORM}
        defaultValues={property || {}}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}