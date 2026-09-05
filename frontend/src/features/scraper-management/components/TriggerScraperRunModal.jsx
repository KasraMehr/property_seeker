import { useEffect, useMemo, useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { TRIGGER_SCRAPER_RUN_FORM } from "@/features/scraper-management/config";
import scraperService from "@/features/scraper-management/services/scraperService";
import { toastService } from "@/lib/toast";

export default function TriggerScraperRunModal({
  isOpen,
  onClose,
  target,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const defaultValues = useMemo(() => ({ mode: "discovery", note: "" }), []);

  useEffect(() => {
    if (isOpen) {
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const configuration = {};

      if (data.note?.trim()) {
        configuration.note = data.note.trim();
      }

      await scraperService.triggerRun(target.id, data.mode, configuration);

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Trigger scraper run failed:", err);

      const detail = err?.response?.data?.detail;

      if (detail?.includes("already has an active run")) {
        setError(
          "این تارگت در حال اجراست؛ لطفاً پس از پایان اجرای فعلی دوباره تلاش کنید.",
        );
        return;
      }

      setError("شروع اجرا ناموفق بود. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={`اجرای دستی — ${target?.name || ""}`}
    >
      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-danger/20 bg-danger/10 px-3 py-2.5 text-sm text-danger">
            {error}
          </div>
        )}

        <FormRenderer
          config={TRIGGER_SCRAPER_RUN_FORM}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </Modal>
  );
}
