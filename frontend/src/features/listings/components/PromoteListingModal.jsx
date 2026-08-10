import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { PROMOTE_LISTING_FORM } from "@/features/properties/config";
import propertyService from "@/features/properties/services/propertyService";

export default function PromoteListingModal({ isOpen, onClose, listing, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await propertyService.promoteFromListing(listing.id, data);
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const extraData = listing ? { listing } : {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="تبدیل آگهی به ملک">
      <FormRenderer
        config={PROMOTE_LISTING_FORM}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
        extraData={extraData}
      />
    </Modal>
  );
}