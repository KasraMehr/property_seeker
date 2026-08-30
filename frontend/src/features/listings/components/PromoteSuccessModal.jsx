import { Home, Copy, Check, User, Hash } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import { toastService } from "@/lib/toast";
import propertyService from "@/features/properties/services/propertyService";

/**
 * PromoteSuccessModal — shown after a listing is successfully promoted to property
 * Shows property info + owner info and allows viewing the property detail.
 */
export default function PromoteSuccessModal({ isOpen, onClose, result, onViewProperty }) {
  const [copied, setCopied] = useState(false);
  const [propertyInfo, setPropertyInfo] = useState(null);

  useEffect(() => {
    if (isOpen && result?.property_id) {
      propertyService
        .getById(result.property_id)
        .then((res) => setPropertyInfo(res?.data ?? res))
        .catch(() => setPropertyInfo(null));
    } else {
      setPropertyInfo(null);
    }
  }, [isOpen, result?.property_id]);

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

  const handleViewProperty = () => {
    if (onViewProperty && propertyInfo) {
      onViewProperty(propertyInfo);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
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

        {/* Property Info Card */}
        <div className="w-full rounded-xl bg-surface border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash size={14} className="text-muted" />
              <span className="text-xs text-muted">کد ملک:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-primary">
                {property_code || "—"}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
                title="کپی کد ملک"
              >
                {copied ? (
                  <Check size={12} className="text-success" />
                ) : (
                  <Copy size={12} className="text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {propertyInfo?.owner && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={14} className="text-muted" />
                <span className="text-xs text-muted">مالک:</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {propertyInfo.owner}
              </span>
            </div>
          )}

          {propertyInfo?.title && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">عنوان:</span>
              <span className="text-sm text-foreground">
                {propertyInfo.title}
              </span>
            </div>
          )}

          {propertyInfo?.area && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">متراژ:</span>
              <span className="text-sm text-foreground">
                {propertyInfo.area.toLocaleString("fa-IR")} متر مربع
              </span>
            </div>
          )}

          {propertyInfo?.deal_type && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">نوع معامله:</span>
              <span className="text-sm text-foreground">
                {propertyInfo.deal_type === "sale" ? "فروش" : propertyInfo.deal_type === "rent" ? "اجاره" : propertyInfo.deal_type === "mortgage" ? "رهن" : propertyInfo.deal_type === "exchange" ? "معاوضه" : propertyInfo.deal_type}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>
          بستن
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleViewProperty}
          disabled={!propertyInfo}
        >
          مشاهده ملک
        </Button>
      </div>
    </Modal>
  );
}
