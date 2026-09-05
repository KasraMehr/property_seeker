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
 *
 * role:
 * [
 *   {
 *     id,
 *     name,
 *     description,
 *     permissions
 *   }
 * ]
 *
 * service_neighborhoods:
 * [
 *   {
 *     id,
 *     name,
 *     zone,
 *     zone_name,
 *     city,
 *     city_name
 *   }
 * ]
 *
 * Form / UserUpdateSerializer expects:
 *
 * role:
 * number
 *
 * service_neighborhoods:
 * number[]
 */
function toFormDefaults(user) {
  if (!user) {
    return {};
  }

  return {
    ...user,

    /**
     * Backend returns role as an array of role objects.
     * Form expects a single role ID.
     */
    role: Array.isArray(user.role)
      ? (user.role[0]?.id ?? null)
      : (user.role ?? null),

    /**
     * Backend returns service_neighborhoods as DivarNeighborhood objects.
     * Form expects an array of DivarNeighborhood IDs.
     */
    service_neighborhoods: Array.isArray(user.service_neighborhoods)
      ? user.service_neighborhoods
          .map((item) => item?.id)
          .filter((id) => id != null)
      : [],
  };
}

export default function UserFormModal({
  isOpen,
  onClose,
  user = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const isEdit = !!user?.id;

  const formDefaults = useMemo(
    () => (isEdit ? toFormDefaults(user) : {}),
    [isEdit, user],
  );

  const handleSubmit = async (data) => {
    setLoading(true);

    try {
      /**
       * Never mutate FormRenderer's original data object.
       */
      const payload = { ...data };

      /**
       * confirm_password is a frontend-only validation field.
       *
       * It is NOT part of the backend UserCreateSerializer /
       * UserUpdateSerializer contract.
       */
      delete payload.confirm_password;

      /**
       * Password is only accepted during user creation.
       *
       * Do not send it on update.
       */
      if (isEdit) {
        delete payload.password;
      }

      /**
       * service_neighborhoods must already contain DivarNeighborhood IDs.
       *
       * Example:
       *
       * {
       *   service_neighborhoods: [12, 18, 24]
       * }
       *
       * No district IDs should be sent.
       */
      if (Array.isArray(payload.service_neighborhoods)) {
        payload.service_neighborhoods =
          payload.service_neighborhoods
            .map((value) => {
              /**
               * Defensive handling in case a select component
               * returns objects instead of raw IDs.
               */
              if (
                value &&
                typeof value === "object"
              ) {
                return value.id;
              }

              return value;
            })
            .filter(
              (id) =>
                id !== null &&
                id !== undefined &&
                id !== "",
            );
      } else {
        payload.service_neighborhoods = [];
      }

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
      const responseData = err?.response?.data;

      const msg =
        responseData?.detail ||
        responseData?.message ||
        responseData?.service_neighborhoods?.[0] ||
        responseData?.role?.[0] ||
        responseData?.national_id?.[0] ||
        responseData?.phone?.[0];

      toastService.error(
        typeof msg === "string"
          ? msg
          : "خطا در ذخیره کاربر",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        isEdit
          ? "ویرایش کاربر"
          : "ثبت کاربر جدید"
      }
    >
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
