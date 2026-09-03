import ChangeStatusModal from "@/shared/ui/modal/ChangeStatusModal";
import { TOGGLE_USER_ACTIVE_FORM } from "@/features/users-management/config";
import userService from "@/features/users-management/services/userService";
import { toastService } from "@/lib/toast";

export default function ToggleUserActiveModal({
  isOpen,
  onClose,
  users = [],
  onSuccess,
}) {
  const isBulk = users.length > 1;

  const handleSubmit = async ({ items, values }) => {
    const ids = items.map((u) => u.id);
    // No bulk endpoint on backend — update each user individually
    await Promise.all(
      ids.map((id) => userService.patch(id, { is_active: values.is_active })),
    );
    const label = values.is_active ? "فعال" : "غیرفعال";
    toastService.success(
      isBulk ? `${ids.length} کاربر ${label} شدند` : `کاربر ${label} شد`,
    );
  };

  const getErrorMessage = (err) => {
    const msg = err?.response?.data?.detail || err?.response?.data?.message;
    return typeof msg === "string" ? msg : "خطا در تغییر وضعیت";
  };

  return (
    <ChangeStatusModal
      isOpen={isOpen}
      onClose={onClose}
      items={users}
      formConfig={TOGGLE_USER_ACTIVE_FORM}
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      getErrorMessage={getErrorMessage}
      size="sm"
    />
  );
}