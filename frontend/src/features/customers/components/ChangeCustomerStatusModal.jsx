import ChangeStatusModal from "@/shared/ui/modal/ChangeStatusModal";
import { CHANGE_CUSTOMER_STATUS_FORM } from "@/features/customers/config";
import customerService from "@/features/customers/services/customerService";
import { toastService } from "@/lib/toast";

export default function ChangeCustomerStatusModal({
  isOpen,
  onClose,
  customers = [],
  onSuccess,
}) {
  const isBulk = customers.length > 1;

  const handleSubmit = async ({ items, values }) => {
    const status = values.status;
    const statusLabel =
      CHANGE_CUSTOMER_STATUS_FORM.fields[0].options.find(
        (o) => o.value === status,
      )?.label || status;

    if (isBulk) {
      // No bulk status endpoint on backend — update each customer individually
      await Promise.all(
        items.map((c) => customerService.patch(c.id, { status })),
      );
      toastService.success(
        `وضعیت ${items.length} مشتری به «${statusLabel}» تغییر یافت.`,
      );
    } else if (items[0]?.id != null) {
      await customerService.patch(items[0].id, { status });
      toastService.success(
        `وضعیت مشتری به «${statusLabel}» تغییر یافت.`,
      );
    }
  };

  const getErrorMessage = (error) =>
    error?.response?.data?.detail ||
    error?.response?.data?.status?.[0] ||
    "خطا در تغییر وضعیت مشتری.";

  return (
    <ChangeStatusModal
      isOpen={isOpen}
      onClose={onClose}
      items={customers}
      formConfig={CHANGE_CUSTOMER_STATUS_FORM}
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      getErrorMessage={getErrorMessage}
    />
  );
}