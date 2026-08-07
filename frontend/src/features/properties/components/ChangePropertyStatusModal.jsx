import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/components/FormRenderer";
import { CHANGE_PROPERTY_STATUS_FORM } from "@/features/properties/config";
import propertyService from "@/features/properties/services/propertyService";

export default function ChangePropertyStatusModal({ isOpen, onClose, properties = [], onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isBulk = properties.length > 1;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const ids = properties.map((p) => p.id);
      await propertyService.bulkChangeStatus(ids, data.status, data.note);
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={isBulk ? `تغییر وضعیت ملک (${properties.length})` : "تغییر وضعیت ملک"}>
      <FormRenderer
        config={CHANGE_PROPERTY_STATUS_FORM}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}