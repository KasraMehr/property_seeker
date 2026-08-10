import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { TOGGLE_USER_ACTIVE_FORM } from "@/features/users-management/config";
import userService from "@/features/users-management/services/userService";

export default function ToggleUserActiveModal({ isOpen, onClose, users = [], onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isBulk = users.length > 1;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const ids = users.map((u) => u.id);
      await userService.bulkToggleActive(ids, data.is_active, data.note);
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={isBulk ? `تغییر وضعیت فعالیت (${users.length})` : "تغییر وضعیت فعالیت"}>
      <FormRenderer
        config={TOGGLE_USER_ACTIVE_FORM}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}