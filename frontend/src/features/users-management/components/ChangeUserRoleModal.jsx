import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { CHANGE_USER_ROLE_FORM } from "@/features/users-management/config";
import userService from "@/features/users-management/services/userService";

export default function ChangeUserRoleModal({ isOpen, onClose, users = [], onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isBulk = users.length > 1;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const ids = users.map((u) => u.id);
      await userService.bulkChangeRole(ids, data.role);
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={isBulk ? `تغییر نقش (${users.length})` : "تغییر نقش"}>
      <FormRenderer
        config={CHANGE_USER_ROLE_FORM}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}