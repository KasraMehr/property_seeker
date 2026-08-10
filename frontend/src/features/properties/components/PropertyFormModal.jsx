import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { PROPERTY_FORM } from "@/features/properties/config";
import propertyService from "@/features/properties/services/propertyService";

export default function PropertyFormModal({ isOpen, onClose, property = null, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!property?.id;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await propertyService.update(property.id, data);
      } else {
        await propertyService.create(data);
      }
      onSuccess?.();
      onClose();
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