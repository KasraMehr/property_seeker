import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/components/FormRenderer";
import { REGION_FORM } from "@/features/regions-management/config";
import regionService from "@/features/regions-management/services/regionService";

export default function RegionFormModal({ isOpen, onClose, region = null, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!region?.id;

  const handleSubmit = async (data) => {
    setLoading(true);
    const { province, ...payload } = data;
    try {
      if (isEdit) {
        await regionService.update(region.id, data);
      } else {
        await regionService.create(data);
      }
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title={isEdit ? "ویرایش منطقه" : "ثبت منطقه جدید"}>
      <FormRenderer
        config={REGION_FORM}
        defaultValues={region || {}}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}