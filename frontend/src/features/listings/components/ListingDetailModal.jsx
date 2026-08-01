import { ExternalLink, FileText, Hash, Phone, MapPin, Calendar, User, Home, DollarSign, Image } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import ScoreBadge from "@/shared/ui/badges/ScoreBadge";
import { DETAIL_FIELDS, fmtSource } from "@/features/listings/config/listingTableConfig";

const ICON_MAP = {
  id: Hash, title: FileText, phone: Phone, source: ExternalLink,
  status: FileText, score: FileText, district: MapPin, assigned_to: User,
  build_year: Calendar, room_count: Home, floor_number: Home, listed_area: Home,
  listed_sale_price: DollarSign, listed_rent_amount: DollarSign, listed_deposit_amount: DollarSign,
  price_per_meter_toman: DollarSign, call_count: Phone, views_count: ExternalLink,
  leads_count: User, media_count: Image, external_id: Hash,
  created_at: Calendar, updated_at: Calendar, published_at: Calendar, expires_at: Calendar,
  description: FileText,
};

export default function ListingDetailModal({ isOpen, onClose, listing }) {
  if (!listing) return null;

  const renderValue = (field) => {
    const raw = listing[field.key];
    if (field.isBadge === "status") return <StatusBadge status={raw} type="property" variant="soft" size="sm" />;
    if (field.isBadge === "score") return <ScoreBadge score={raw} size="sm" showLabel />;
    if (field.format) return field.format(raw);
    if (raw == null) return "—";
    return String(raw);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="جزئیات آگهی">
      {/* ✅ Scrollable content body */}
      <div className="overflow-y-auto max-h-[60vh] pr-1 space-y-4" dir="rtl">
        {/* Picture */}
        {listing.hs_picture ? (
          <div className="w-full h-48 rounded-xl overflow-hidden bg-muted">
            <img src={listing.hs_picture} alt={listing.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-32 rounded-xl bg-(--role-subtle)/20 flex items-center justify-center text-muted text-sm">
            بدون تصویر
          </div>
        )}

        {/* Link to original */}
        {listing.url && (
          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-(--role-primary) hover:underline"
          >
            <ExternalLink size={14} />
            مشاهده آگهی در {fmtSource(listing.source)}
          </a>
        )}

        {/* Fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DETAIL_FIELDS.map((field) => {
            const Icon = ICON_MAP[field.key] || FileText;
            return (
              <div
                key={field.key}
                className={`flex items-start gap-2 p-2.5 rounded-lg bg-surface border border-border ${field.fullWidth ? "sm:col-span-2" : ""}`}
              >
                <Icon size={16} className="text-muted mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted uppercase tracking-wide">{field.label}</p>
                  <p className="text-sm text-foreground font-medium wrap-break-word">
                    {renderValue(field)}
                    {field.suffix && listing[field.key] != null ? field.suffix : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer — stays fixed at bottom */}
      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>بستن</Button>
        {listing.url && (
          <Button variant="primary" size="sm" onClick={() => window.open(listing.url, "_blank")}>
            <ExternalLink size={14} className="ml-1.5" />
            باز کردن در {fmtSource(listing.source)}
          </Button>
        )}
      </div>
    </Modal>
  );
}