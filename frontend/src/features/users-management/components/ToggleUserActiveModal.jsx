import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { TOGGLE_USER_ACTIVE_FORM } from "@/features/users-management/config";
import userService from "@/features/users-management/services/userService";
import { toastService } from "@/lib/toast";

export default function ToggleUserActiveModal({ isOpen, onClose, users = [], onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isBulk = users.length > 1;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const ids = users.map((u) => u.id);
      // No bulk endpoint on backend — update each user individually
      await Promise.all(ids.map((id) => userService.patch(id, { is_active: data.is_active })));
      const label = data.is_active ? "فعال" : "غیرفعال";
      toastService.success(isBulk ? `${ids.length} کاربر ${label} شدند` : `کاربر ${label} شد`);
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message;
      toastService.error(typeof msg === "string" ? msg : "خطا در تغییر وضعیت");
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