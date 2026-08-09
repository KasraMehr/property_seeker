import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { TRIGGER_SCRAPER_RUN_FORM } from "@/features/scraper-management/config";
import scraperService from "@/features/scraper-management/services/scraperService";

export default function TriggerScraperRunModal({ isOpen, onClose, target, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await scraperService.triggerRun(target.id, data.mode, data.note);
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={`اجرای دستی — ${target?.name || ""}`}>
      <FormRenderer
        config={TRIGGER_SCRAPER_RUN_FORM}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}