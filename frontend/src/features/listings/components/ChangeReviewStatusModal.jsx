import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/components/FormRenderer";
import { CHANGE_REVIEW_STATUS_FORM } from "@/features/listings/config";
import listingService from "@/features/listings/services/listingService";

export default function ChangeReviewStatusModal({ isOpen, onClose, listings = [], onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isBulk = listings.length > 1;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const ids = listings.map((l) => l.id);
      await listingService.bulkChangeReviewStatus(ids, data.review_status, data.note);
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={isBulk ? `تغییر وضعیت بررسی (${listings.length})` : "تغییر وضعیت بررسی"}>
      <FormRenderer
        config={CHANGE_REVIEW_STATUS_FORM}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}