import { useState, useMemo } from "react";
import { ExternalLink, FileText, GitCommit, Target, History, Home, Inbox, Phone } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import SourceBadge from "@/shared/ui/badges/SourceBadge";
import Thumbnail from "@/shared/ui/Thumbnail";
import Can from "@/shared/access/Can";
import { formatDate } from "@/utils/formatters";
import { LISTING_STATUS_CONFIG, LISTING_REVIEW_STATUS_CONFIG } from "@/constants";
import {
  LISTING_DETAIL_TABS,
  LISTING_DETAIL_FIELDS,
  LISTING_SNAPSHOT_COLUMNS,
  LISTING_TARGET_COLUMNS,
  LISTING_STATUS_HISTORY_COLUMNS,
  LISTING_PROPERTY_FIELDS,
} from "@/features/listings/config";
import { DetailFieldGrid, DetailListTable } from "@/shared/components/DetailContentRenderer";

export default function ListingDetailModal({ isOpen, onClose, listing, onRegisterCall }) {
  const [activeTab, setActiveTab] = useState("details");

  if (!listing) return null;

  const hasProperty = !!listing.property;

  const availableTabs = useMemo(() => {
    return LISTING_DETAIL_TABS.filter((tab) => {
      if (tab.condition && typeof tab.condition === "function") {
        return tab.condition(listing);
      }
      return true;
    });
  }, [listing]);

  // Reset tab when modal opens
  useMemo(() => {
    if (isOpen) setActiveTab("details");
  }, [isOpen, listing?.id]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="جزئیات آگهی" className="h-[85vh]">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <Thumbnail src={listing.latest_payload?.image_url} alt={listing.title} size="lg" className="rounded-xl" />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground truncate">{listing.title}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <SourceBadge source={listing.source?.name || "—"} size="sm" />
            <StatusBadge status={listing.status} config={LISTING_STATUS_CONFIG} size="sm" variant="soft" />
            <StatusBadge status={listing.review_status} config={LISTING_REVIEW_STATUS_CONFIG} size="sm" variant="soft" />
          </div>
        </div>
        {listing.url && (
          <Button variant="outline" size="sm" onClick={() => window.open(listing.url, "_blank")}>
            <ExternalLink size={14} className="ml-1" />
            منبع
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline" className="flex-1 min-h-0 flex flex-col">
        <Tabs.List className="mb-2 shrink-0">
          {availableTabs.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key} icon={tab.icon}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <Tabs.Content value="details">
            <DetailFieldGrid data={listing} sections={LISTING_DETAIL_FIELDS} />
          </Tabs.Content>

          <Tabs.Content value="snapshots">
            <DetailListTable
              data={listing.snapshots || []}
              columns={LISTING_SNAPSHOT_COLUMNS}
              emptyText="اسنپ‌شاتی ثبت نشده"
            />
          </Tabs.Content>

          <Tabs.Content value="targets">
            <DetailListTable
              data={listing.target_listings || []}
              columns={LISTING_TARGET_COLUMNS}
              emptyText="تاریخچه تارگت خالی است"
            />
          </Tabs.Content>

          <Tabs.Content value="status_history">
            <DetailListTable
              data={listing.status_history || []}
              columns={LISTING_STATUS_HISTORY_COLUMNS}
              emptyText="تاریخچه وضعیت خالی است"
            />
          </Tabs.Content>

          <Tabs.Content value="property">
            {hasProperty ? (
              <>
                <DetailFieldGrid data={listing.property} sections={LISTING_PROPERTY_FIELDS} />
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => {/* navigate to property */}}>
                    <Home size={14} className="ml-1" />
                    مشاهده صفحه کامل ملک →
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">این آگهی هنوز به ملک تبدیل نشده</div>
            )}
          </Tabs.Content>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>بستن</Button>
        <Button variant="primary" size="sm" onClick={() => onRegisterCall?.(listing)}>
          <Phone size={14} className="ml-1" />
          ثبت تماس
        </Button>
      </div>
    </Modal>
  );
}