import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { CHANGE_USER_ROLE_FORM } from "@/features/users-management/config";
import userService from "@/features/users-management/services/userService";
import { toastService } from "@/lib/toast";

export default function ChangeUserRoleModal({ isOpen, onClose, users = [], onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isBulk = users.length > 1;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const ids = users.map((u) => u.id);
      // No bulk endpoint on backend — update each user individually
      await Promise.all(ids.map((id) => userService.patch(id, { role: data.role })));
      toastService.success(isBulk ? `نقش ${ids.length} کاربر تغییر کرد` : "نقش کاربر تغییر کرد");
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message;
      toastService.error(typeof msg === "string" ? msg : "خطا در تغییر نقش");
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