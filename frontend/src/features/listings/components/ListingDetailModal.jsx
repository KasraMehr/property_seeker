import { useState, useMemo, useEffect, useCallback } from "react";
import { ExternalLink, Phone } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import SourceBadge from "@/shared/ui/badges/SourceBadge";
import Thumbnail from "@/shared/ui/Thumbnail";
import {
  LISTING_STATUS_CONFIG,
  LISTING_REVIEW_STATUS_CONFIG,
} from "@/features/listings/config";
import {
  LISTING_DETAIL_TABS,
  LISTING_DETAIL_FIELDS,
  LISTING_SNAPSHOT_COLUMNS,
  LISTING_TARGET_COLUMNS,
} from "@/features/listings/config";
import { buildStatusConfig } from "@/constants/status.utils";
import { DetailFieldGrid, DetailListTable } from "@/shared/page/DetailContentRenderer";
import scraperService from "@/features/scraper-management/services/scraperService";

function unwrapList(response) {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  return payload?.results ?? [];
}

export default function ListingDetailModal({
  isOpen,
  onClose,
  listing,
  loading = false,
  onRegisterCall,
}) {
  const [activeTab, setActiveTab] = useState("details");
  const [snapshots, setSnapshots] = useState([]);
  const [targets, setTargets] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);

  const availableTabs = useMemo(() => {
    if (!listing) return [];
    return LISTING_DETAIL_TABS.filter((tab) => {
      if (typeof tab.condition === "function") {
        return tab.condition(listing);
      }
      return true;
    });
  }, [listing]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("details");
      setSnapshots([]);
      setTargets([]);
    }
  }, [isOpen, listing?.id]);

  const loadSnapshots = useCallback(async (id) => {
    setTabLoading(true);
    try {
      const res = await scraperService.getSnapshots(id);
      setSnapshots(unwrapList(res));
    } catch (err) {
      console.error(err);
      setSnapshots([]);
    } finally {
      setTabLoading(false);
    }
  }, []);

  const loadTargets = useCallback(async (id) => {
    setTabLoading(true);
    try {
      const res = await scraperService.getTargetListings(id);
      setTargets(unwrapList(res));
    } catch (err) {
      console.error(err);
      setTargets([]);
    } finally {
      setTabLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !listing?.id) return;
    if (activeTab === "snapshots") loadSnapshots(listing.id);
    if (activeTab === "targets") loadTargets(listing.id);
  }, [activeTab, isOpen, listing?.id, loadSnapshots, loadTargets]);

  if (!isOpen || !listing) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="جزئیات آگهی"
      className="h-[85vh]"
    >
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <Thumbnail
          src={listing.latest_payload?.image_url}
          alt={listing.title}
          size="lg"
          className="rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground truncate">
            {listing.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <SourceBadge source={listing.source?.name || "—"} size="sm" />
            <StatusBadge
              config={buildStatusConfig(LISTING_STATUS_CONFIG, listing.status)}
              size="sm"
              variant="soft"
            />
            <StatusBadge
              config={buildStatusConfig(
                LISTING_REVIEW_STATUS_CONFIG,
                listing.review_status,
              )}
              size="sm"
              variant="soft"
            />
          </div>
        </div>
        {listing.url && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(listing.url, "_blank", "noopener,noreferrer")
            }
          >
            <ExternalLink size={14} className="ml-1" />
            منبع
          </Button>
        )}
      </div>

      {(loading || tabLoading) && (
        <p className="text-xs text-muted mb-2">در حال بارگذاری...</p>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        variant="underline"
        className="flex-1 min-h-0 flex flex-col"
      >
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
              data={snapshots}
              columns={LISTING_SNAPSHOT_COLUMNS}
              emptyText="اسنپ‌شاتی ثبت نشده"
            />
          </Tabs.Content>

          <Tabs.Content value="targets">
            <DetailListTable
              data={targets}
              columns={LISTING_TARGET_COLUMNS}
              emptyText="تاریخچه تارگت خالی است"
            />
          </Tabs.Content>
        </div>
      </Tabs>

      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>
          بستن
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onRegisterCall?.(listing)}
        >
          <Phone size={14} className="ml-1" />
          ثبت تماس
        </Button>
      </div>
    </Modal>
  );
}