import { Home, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import { toastService } from "@/lib/toast";

/**
 * PromoteSuccessModal — shown after a listing is successfully promoted to property
 * Displays the new property code and provides a link to view the property.
 */
export default function PromoteSuccessModal({ isOpen, onClose, result }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!isOpen || !result) return null;

  const { property_code, property_id } = result;

  const handleCopy = async () => {
    if (!property_code) return;
    try {
      await navigator.clipboard.writeText(property_code);
      setCopied(true);
      toastService.success("کد ملک کپی شد.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastService.error("خطا در کپی کردن.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="تبدیل آگهی به ملک"
    >
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center">
          <Home className="w-8 h-8 text-success" />
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            آگهی با موفقیت به ملک تبدیل شد.
          </p>
          <p className="text-xs text-muted">
            فایل ملکی جدید در سیستم ثبت شد.
          </p>
        </div>

        {property_code && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface border border-border">
            <span className="text-xs text-muted">کد ملک:</span>
            <span className="text-base font-mono font-bold text-primary">
              {property_code}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
              title="کپی کد ملک"
            >
              {copied ? (
                <Check size={14} className="text-success" />
              ) : (
                <Copy size={14} className="text-muted-foreground" />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>
          بستن
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            onClose();
            // Detect role from current path and navigate accordingly
            const path = window.location.pathname;
            const basePath = path.startsWith("/operator") ? "/operator" : "/owner";
            navigate(`${basePath}/properties`);
          }}
        >
          مشاهده ملک
        </Button>
      </div>
    </Modal>
  );
}
