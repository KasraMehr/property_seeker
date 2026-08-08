import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { LISTING_FORM } from "@/features/listings/config";
import listingService from "@/features/listings/services/listingService";

export default function ListingFormModal({ isOpen, onClose, listing = null, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!listing?.id;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await listingService.update(listing.id, data);
      } else {
        await listingService.create(data);
      }
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={isEdit ? "ویرایش آگهی" : "ثبت آگهی جدید"}>
      <FormRenderer
        config={LISTING_FORM}
        defaultValues={listing || {}}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}