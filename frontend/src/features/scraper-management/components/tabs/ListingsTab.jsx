import { useState, useMemo, useCallback, useEffect } from "react";
import { Eye, ExternalLink } from "lucide-react";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useListing from "@/features/listings/hooks/useListing";
import { LISTING_TABLE_COLUMNS } from "@/features/listings/config";
import ListingDetailModal from "@/features/listings/components/ListingDetailModal";
import EmptyState from "./EmptyState";

const SCRAPER_LISTING_ROW_ACTIONS = [
  { key: "view", label: "مشاهده", icon: Eye },
  {
    key: "open_source",
    label: "مشاهده منبع",
    icon: ExternalLink,
    visible: (row) => !!row.url,
  },
];

export default function ListingsTab({ onHeaderStateChange }) {
  const {
    data,
    loading,
    meta,
    page,
    setPage,
    pageSize,
    totalPages,
    getById,
    refresh,
  } = useListing();

  const [detailListing, setDetailListing] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh?.();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  useEffect(() => {
    onHeaderStateChange?.({
      loading: loading || refreshing,
      onRefresh: handleRefresh,
    });
    return () => onHeaderStateChange?.(null);
  }, [loading, refreshing, handleRefresh, onHeaderStateChange]);

  const openDetail = useCallback(
    async (row) => {
      setDetailLoading(true);
      setDetailListing(row);
      try {
        if (getById) {
          const full = await getById(row.id);
          setDetailListing(full);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setDetailLoading(false);
      }
    },
    [getById],
  );

  const handleRowAction = useCallback(
    (key, row) => {
      if (key === "view") openDetail(row);
      if (key === "open_source" && row?.url) {
        window.open(row.url, "_blank", "noopener,noreferrer");
      }
    },
    [openDetail],
  );

  const pagination = useMemo(
    () => ({
      page,
      pageSize: pageSize || 20,
      total: meta?.count || 0,
      totalPages: totalPages?.(meta?.count || 0) || 1,
    }),
    [page, pageSize, meta?.count, totalPages],
  );

  return (
    <>
      <div className="flex h-full flex-col min-h-0">
        <ResourceTemplate
          count={meta?.count || 0}
          countLabel="آگهی"
          columns={LISTING_TABLE_COLUMNS}
          data={data}
          loading={loading || refreshing}
          emptyState={<EmptyState message="آگهی‌ای یافت نشد" />}
          selectable={false}
          rowActions={SCRAPER_LISTING_ROW_ACTIONS}
          bulkActions={[]}
          onRowAction={handleRowAction}
          pagination={pagination}
          onPageChange={setPage}
        />
      </div>

      <ListingDetailModal
        isOpen={!!detailListing}
        onClose={() => setDetailListing(null)}
        listing={detailListing}
        loading={detailLoading}
      />
    </>
  );
}