import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/components/FormRenderer";
import { USER_FORM } from "@/features/users-management/config";
import userService from "@/features/users-management/services/userService";

export default function UserFormModal({ isOpen, onClose, user = null, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!user?.id;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data };
      if (isEdit) delete payload.password; // don't send password on edit
      if (isEdit) {
        await userService.update(user.id, payload);
      } else {
        await userService.create(payload);
      }
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={isEdit ? "ویرایش کاربر" : "ثبت کاربر جدید"}>
      <FormRenderer
        config={USER_FORM}
        defaultValues={user || {}}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}