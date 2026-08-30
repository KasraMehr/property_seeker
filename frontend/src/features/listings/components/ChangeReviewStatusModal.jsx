import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { CHANGE_REVIEW_STATUS_FORM } from "@/features/listings/config";
import listingService from "@/features/listings/services/listingService";
import { toastService } from "@/lib/toast";

export default function ChangeReviewStatusModal({
  isOpen,
  onClose,
  listings = [],
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const isBulk = listings.length > 1;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const review_status = data.review_status;
      const statusLabel =
        CHANGE_REVIEW_STATUS_FORM.fields[0].options.find(
          (o) => o.value === review_status,
        )?.label || review_status;

      if (isBulk) {
        const listing_ids = listings.map((l) => l.id);
        await listingService.bulkReview(listing_ids, review_status);
        toastService.success(
          `وضعیت ${listing_ids.length} آگهی به «${statusLabel}» تغییر یافت.`,
        );
      } else if (listings[0]?.id != null) {
        await listingService.review(listings[0].id, review_status);
        toastService.success(
          `وضعیت بررسی به «${statusLabel}» تغییر یافت.`,
        );
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Review status change error:", error);
      toastService.error(
        error?.response?.data?.detail ||
          error?.response?.data?.review_status?.[0] ||
          "خطا در تغییر وضعیت بررسی.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        isBulk ? `تغییر وضعیت بررسی (${listings.length})` : "تغییر وضعیت بررسی"
      }
    >
      <FormRenderer
        config={CHANGE_REVIEW_STATUS_FORM}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
