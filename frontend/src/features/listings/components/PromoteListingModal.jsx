import { useState, useMemo } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { PROMOTE_LISTING_FORM } from "@/features/properties/config";
import listingService from "@/features/listings/services/listingService";
import OwnerFormModal from "@/features/owners/components/OwnerFormModal";
import { toastService } from "@/lib/toast";

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
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [ownerFormKey, setOwnerFormKey] = useState(0);

  /* ─── Inject addAction into owner field + conditional area required ─── */
  const formConfig = useMemo(() => {
    if (!PROMOTE_LISTING_FORM) return PROMOTE_LISTING_FORM;
    const hasListedArea = listing?.listed_area != null && listing.listed_area !== 0;

    return {
      ...PROMOTE_LISTING_FORM,
      fields: PROMOTE_LISTING_FORM.fields.map((f) => {
        // Add + button to owner field
        if (f.key === "owner") {
          return {
            ...f,
            addAction: () => setShowOwnerForm(true),
            addActionLabel: "مالک جدید",
          };
        }
        // Make area required when listing has no listed_area
        if (f.key === "area" && !hasListedArea) {
          return {
            ...f,
            required: true,
          };
        }
        return f;
      }),
    };
  }, [listing?.listed_area]);

  /* ─── After owner created, force re-fetch of owner list ─── */
  const handleOwnerCreated = () => {
    setShowOwnerForm(false);
    setOwnerFormKey((k) => k + 1);
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await listingService.promote(listing.id, toPromotePayload(data));
      const result = res?.data || res;
      onSuccess?.(result);
      onClose();
    } catch (error) {
      toastService.error(error?.response?.data?.detail || "خطا در تبدیل آگهی به ملک.");
    } finally {
      setLoading(false);
    }
  };

  const extraData = listing ? { listing } : {};

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" title="تبدیل آگهی به ملک">
        <FormRenderer
          key={ownerFormKey}
          config={formConfig}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
          extraData={extraData}
        />
      </Modal>

      <OwnerFormModal
        isOpen={showOwnerForm}
        onClose={() => setShowOwnerForm(false)}
        onSuccess={handleOwnerCreated}
      />
    </>
  );
}