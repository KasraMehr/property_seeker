import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";

export default function TargetPickerModal({
  isOpen,
  onClose,
  targets = [],
  onPick,
  loading = false,
}) {
  const [targetId, setTargetId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTargetId(targets[0]?.id ? String(targets[0].id) : "");
    }
  }, [isOpen, targets]);

  if (!isOpen) return null;

  const canContinue = !loading && targets.length > 0 && !!targetId;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="اجرای فوری">
      <div className="space-y-4">
        <p className="text-sm text-muted">
          یک تارگت فعال انتخاب کنید؛ بعد حالت اجرا را مشخص می‌کنید.
        </p>

        {loading ? (
          <p className="text-sm text-muted">در حال بارگذاری تارگت‌ها…</p>
        ) : !targets.length ? (
          <p className="text-sm text-danger">تارگت فعالی وجود ندارد.</p>
        ) : (
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-foreground">تارگت</span>
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
            >
              {targets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            انصراف
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!canContinue}
            onClick={() => {
              const target = targets.find(
                (t) => String(t.id) === String(targetId),
              );
              if (target) onPick(target);
            }}
          >
            <Zap size={14} />
            ادامه
          </Button>
        </div>
      </div>
    </Modal>
  );
}