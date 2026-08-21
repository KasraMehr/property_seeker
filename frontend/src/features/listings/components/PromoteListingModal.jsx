import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { PROMOTE_LISTING_FORM } from "@/features/properties/config";
import listingService from "@/features/listings/services/listingService";

/** Backend ListingPromotionSerializer only accepts these keys. */
const PROMOTE_PAYLOAD_KEYS = [
  "owner",
  "deal_type",
  "area",
  "title",
  "address",
  "property_type",
  "floor",
  "total_floors",
];

function toPromotePayload(data) {
  const payload = {};
  for (const key of PROMOTE_PAYLOAD_KEYS) {
    const value = data?.[key];
    if (value !== undefined && value !== null && value !== "") {
      payload[key] = value;
    }
  }
  return payload;
}

export default function PromoteListingModal({ isOpen, onClose, listing, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await listingService.promote(listing.id, toPromotePayload(data));
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