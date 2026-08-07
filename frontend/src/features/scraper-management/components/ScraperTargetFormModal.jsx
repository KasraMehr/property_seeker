import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/components/FormRenderer";
import { SCRAPER_TARGET_FORM } from "@/features/scraper-management/config";
import scraperService from "@/features/scraper-management/services/scraperService";

export default function ScraperTargetFormModal({ isOpen, onClose, target = null, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!target?.id;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await scraperService.updateTarget(target.id, data);
      } else {
        await scraperService.createTarget(data);
      }
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={isEdit ? "ویرایش تارگت" : "ثبت تارگت جدید"}>
      <FormRenderer
        config={SCRAPER_TARGET_FORM}
        defaultValues={target || {}}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}