import { useState, useMemo } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { USER_FORM } from "@/features/users-management/config";
import userService from "@/features/users-management/services/userService";
import { toastService } from "@/lib/toast";

/**
 * Transform backend user object into form-friendly default values.
 *
 * Backend UserSerializer returns:
 *   role: [{ id, name, description, permissions }]   (array of objects)
 *   service_neighborhoods: [{ id, name, ... }]        (array of objects)
 *
 * Form / UserUpdateSerializer expects:
 *   role: number (single PK)
 *   service_neighborhoods: number[] (array of PKs)
 *
 * We must NOT mutate the original user object.
 */
function toFormDefaults(user) {
  if (!user) return {};
  return {
    ...user,
    role: Array.isArray(user.role)
      ? (user.role[0]?.id ?? null)
      : (user.role ?? null),
    service_neighborhoods: Array.isArray(user.service_neighborhoods)
      ? user.service_neighborhoods.map((n) => n.id)
      : (user.service_neighborhoods ?? []),
    // Backend stores only neighborhoods — derive their districts so the
    // "مناطق خدمت" field isn't empty when editing an existing user.
    service_districts: Array.isArray(user.service_neighborhoods)
      ? [
          ...new Set(
            user.service_neighborhoods
              .map((n) => n.district)
              .filter((v) => v !== null && v !== undefined),
          ),
        ]
      : (user.service_districts ?? []),
  };
}

export default function UserFormModal({ isOpen, onClose, user = null, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!user?.id;

  const formDefaults = useMemo(
    () => (isEdit ? toFormDefaults(user) : {}),
    [isEdit, user],
  );

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data };
      if (isEdit) delete payload.password; // don't send password on edit
      if (isEdit) {
        await userService.update(user.id, payload);
        toastService.success("کاربر ویرایش شد");
      } else {
        await userService.create(payload);
        toastService.success("کاربر جدید ثبت شد");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message;
      toastService.error(typeof msg === "string" ? msg : "خطا در ذخیره کاربر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={isEdit ? "ویرایش کاربر" : "ثبت کاربر جدید"}>
      <FormRenderer
        config={USER_FORM}
        defaultValues={formDefaults}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}