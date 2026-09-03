import ChangeStatusModal from "@/shared/ui/modal/ChangeStatusModal";
import { CHANGE_REVIEW_STATUS_FORM } from "@/features/listings/config";
import listingService from "@/features/listings/services/listingService";
import { toastService } from "@/lib/toast";

export default function ChangeReviewStatusModal({
  isOpen,
  onClose,
  listings = [],
  onSuccess,
}) {
  const isBulk = listings.length > 1;

  const handleSubmit = async ({ items, values }) => {
    const review_status = values.review_status;
    const statusLabel =
      CHANGE_REVIEW_STATUS_FORM.fields[0].options.find(
        (o) => o.value === review_status,
      )?.label || review_status;

    if (isBulk) {
      const listing_ids = items.map((l) => l.id);
      await listingService.bulkReview(listing_ids, review_status);
      toastService.success(
        `وضعیت ${listing_ids.length} آگهی به «${statusLabel}» تغییر یافت.`,
      );
    } else if (items[0]?.id != null) {
      await listingService.review(items[0].id, review_status);
      toastService.success(
        `وضعیت بررسی به «${statusLabel}» تغییر یافت.`,
      );
    }
  };

  const getErrorMessage = (error) =>
    error?.response?.data?.detail ||
    error?.response?.data?.review_status?.[0] ||
    "خطا در تغییر وضعیت بررسی.";

  return (
    <ChangeStatusModal
      isOpen={isOpen}
      onClose={onClose}
      items={listings}
      formConfig={CHANGE_REVIEW_STATUS_FORM}
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      getErrorMessage={getErrorMessage}
    />
  );
}