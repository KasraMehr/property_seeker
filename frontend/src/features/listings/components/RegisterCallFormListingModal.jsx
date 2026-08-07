import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/components/FormRenderer";
import { REGISTER_CALL_FROM_LISTING_FORM } from "@/features/listings/config";
import callService from "@/features/calls/services/callService";

export default function RegisterCallFromListingModal({ isOpen, onClose, listing, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await callService.create(data);
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const extraData = listing ? { listing } : {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="ثبت تماس از آگهی">
      <FormRenderer
        config={REGISTER_CALL_FROM_LISTING_FORM}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
        extraData={extraData}
      />
    </Modal>
  );
}