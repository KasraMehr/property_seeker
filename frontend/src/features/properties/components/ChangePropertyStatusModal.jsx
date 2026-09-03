import ChangeStatusModal from "@/shared/ui/modal/ChangeStatusModal";
import { CHANGE_PROPERTY_STATUS_FORM } from "@/features/properties/config";
import propertyService from "@/features/properties/services/propertyService";
import { toastService } from "@/lib/toast";

export default function ChangePropertyStatusModal({
  isOpen,
  onClose,
  properties = [],
  onSuccess,
}) {
  const isBulk = properties.length > 1;

  const handleSubmit = async ({ items, values }) => {
    const status = values.status;
    const statusLabel =
      CHANGE_PROPERTY_STATUS_FORM.fields[0].options.find(
        (o) => o.value === status,
      )?.label || status;

    if (isBulk) {
      // No bulk status endpoint on backend — update each property
      // individually (PropertyUpdateSerializer records history per property)
      await Promise.all(
        items.map((p) => propertyService.update(p.id, { status })),
      );
      toastService.success(
        `وضعیت ${items.length} ملک به «${statusLabel}» تغییر یافت.`,
      );
    } else if (items[0]?.id != null) {
      await propertyService.update(items[0].id, { status });
      toastService.success(
        `وضعیت ملک به «${statusLabel}» تغییر یافت.`,
      );
    }
  };

  const getErrorMessage = (error) =>
    error?.response?.data?.detail ||
    error?.response?.data?.status?.[0] ||
    "خطا در تغییر وضعیت ملک.";

  return (
    <ChangeStatusModal
      isOpen={isOpen}
      onClose={onClose}
      items={properties}
      formConfig={CHANGE_PROPERTY_STATUS_FORM}
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      getErrorMessage={getErrorMessage}
    />
  );
}