import { useMemo } from "react";
import {
  Inbox,
  Plus,
  ExternalLink,
  Trash2,
  UserPlus,
  Eye,
  ArrowUpDown,
  Phone,
  MapPin,
  Home,
} from "lucide-react";

import Table from "@/shared/table/Table";
import TablePagination from "@/shared/table/TablePagination";
import TableActions from "@/shared/table/TableActions";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import ScoreBadge from "@/shared/ui/badges/ScoreBadge";
import Button from "@/shared/ui/Button";
import SearchBox from "@/shared/ui/SearchBox";
import FilterBar from "@/shared/filters/FilterBar";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import {
  LISTING_STATUS_CONFIG,
  LISTING_FILTERS,
  LISTING_TABLE_COLUMNS,
} from "@/features/listings/config";

import useListingQuery from "@/features/listings/hooks/useListingQuery";
import useListingSort from "@/features/listings/hooks/useListingSort";
import useTableSelection from "@/shared/table/useTableSelection";
import useListingModals from "@/features/listings/hooks/useListingModals";
import useListingActions from "@/features/listings/hooks/useListingActions";

import {
  FILTER_SCHEMA_NO_SEARCH,
  PAGE_SIZE,
  fmtPrice,
  fmtYearRoomsFloor,
  fmtSource,
} from "@/features/listings/config";

import ListingDetailModal from "@/features/listings/components/ListingDetailModal";
import AssignOperatorModal from "@/features/listings/components/AssignOperatorModal";

/* ═══════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════ */

function SortHeader({ colKey, children, align = "right", sort }) {
  return (
    <button
      onClick={() => sort.toggle(colKey)}
      className={`
        flex items-center gap-1 w-full text-xs font-medium uppercase tracking-wide
        transition-colors duration-200
        ${align === "center" ? "justify-center" : "justify-start"}
        ${sort.isActive(colKey) ? "text-(--role-primary)" : "text-muted hover:text-foreground"}
      `}
    >
      {children}
      <ArrowUpDown
        size={12}
        className={
          sort.isActive(colKey) ? "text-(--role-primary)" : "text-muted/40"
        }
      />
    </button>
  );
}

function Thumbnail({ src, alt }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-border"
        loading="lazy"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-lg bg-(--role-subtle)/30 border border-border flex items-center justify-center shrink-0">
      <Home size={14} className="text-muted" />
    </div>
  );
}

function SourceTag({ source }) {
  const map = {
    divar: { bg: "bg-purple-500/10", text: "text-purple-500", label: "دیوار" },
    sheypoor: {
      bg: "bg-orange-500/10",
      text: "text-orange-500",
      label: "شیپور",
    },
    internal: {
      bg: "bg-(--role-primary)/10",
      text: "text-(--role-primary)",
      label: "داخلی",
    },
  };
  const s = map[source] || {
    bg: "bg-muted/10",
    text: "text-muted",
    label: source || "—",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  );
}

/* ═══════════════════════════════════════════
   Main page
   ═══════════════════════════════════════════ */

export default function ListingsPage() {
  const {
    listings,
    loading,
    error,
    page,
    setPage,
    filters,
    setFilter,
    clearFilter,
    clearAll,
    activeChips,
    handleSearch,
    refresh,
  } = useListingQuery();

  const sort = useListingSort(listings);
  const selection = useTableSelection();
  const modals = useListingModals();
  const actions = useListingActions(refresh);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sort.sorted.slice(start, start + PAGE_SIZE);
  }, [sort.sorted, page]);

  const totalPages = Math.ceil(sort.sorted.length / PAGE_SIZE) || 1;

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <p className="text-danger font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={refresh}>
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 h-full flex flex-col" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            مدیریت آگهی‌ها
          </h1>
          <p className="text-sm text-muted mt-1">
            {sort.sorted.length.toLocaleString("fa-IR")} آگهی
            {selection.selected.length > 0 && (
              <span className="mr-2 text-(--role-primary)">
                ({selection.selected.length.toLocaleString("fa-IR")} انتخاب شده)
              </span>
            )}
          </p>
        </div>
        <Button variant="primary" size="sm" className="gap-1.5">
          <Plus size={16} />
          آگهی جدید
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        {/* Search */}
        <div className="shrink-0">
          <SearchBox
            label="جستجو"
            placeholder="عنوان، شماره تلفن، توضیحات..."
            debounce={400}
            onSearch={handleSearch}
            className="max-w-sm"
          />
        </div>

        {/* Filters */}
        <div className="shrink-0">
          <FilterBar
            schema={FILTER_SCHEMA_NO_SEARCH}
            options={FILTER_OPTIONS}
            filters={filters}
            onChange={setFilter}
            onClear={clearFilter}
            onClearAll={clearAll}
            activeChips={activeChips}
          />
        </div>
      </div>

      {/* Table wrapper */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <Table
            loading={loading}
            emptyState={
              <Table.EmptyState
                icon={Inbox}
                title="آگهی‌ای یافت نشد"
                description="با فیلترهای انتخابی هیچ آگهی‌ای پیدا نشد."
                action={
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    حذف فیلترها
                  </Button>
                }
              />
            }
          >
            <Table.Header>
              <Table.Column align="center" width="44px">
                <input
                  type="checkbox"
                  checked={selection.allSelectedOnPage(paged)}
                  onChange={() => selection.toggleAll(paged)}
                  className="w-4 h-4 rounded border-border text-(--role-primary) focus:ring-(--role-primary)/20"
                />
              </Table.Column>

              <Table.Column width="260px">
                <SortHeader colKey="title" sort={sort}>
                  عنوان
                </SortHeader>
              </Table.Column>

              <Table.Column align="center" width="90px">
                <SortHeader colKey="status" align="center" sort={sort}>
                  وضعیت
                </SortHeader>
              </Table.Column>

              <Table.Column align="center" width="80px">
                <SortHeader colKey="score" align="center" sort={sort}>
                  امتیاز
                </SortHeader>
              </Table.Column>

              <Table.Column width="140px">
                <SortHeader colKey="district" sort={sort}>
                  منطقه
                </SortHeader>
              </Table.Column>

              <Table.Column width="130px">
                <SortHeader colKey="price" sort={sort}>
                  قیمت
                </SortHeader>
              </Table.Column>

              <Table.Column align="center" width="120px">
                <SortHeader colKey="info" align="center" sort={sort}>
                  سال / اتاق / طبقه
                </SortHeader>
              </Table.Column>

              <Table.Column align="center" width="80px">
                <SortHeader colKey="source" align="center" sort={sort}>
                  منبع
                </SortHeader>
              </Table.Column>

              <Table.Column align="center" width="60px">
                <span className="text-xs font-medium text-muted uppercase tracking-wide">
                  عملیات
                </span>
              </Table.Column>
            </Table.Header>

            <Table.Body empty={!loading && paged.length === 0}>
              {paged.map((row) => (
                <Table.Row key={row.id} selected={selection.isSelected(row.id)}>
                  <Table.Cell align="center">
                    <input
                      type="checkbox"
                      checked={selection.isSelected(row.id)}
                      onChange={() => selection.toggle(row.id)}
                      className="w-4 h-4 rounded border-border text-(--role-primary) focus:ring-(--role-primary)/20"
                    />
                  </Table.Cell>

                  {/* Title + thumbnail */}
                  <Table.Cell>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Thumbnail src={row.hs_picture} alt={row.title} />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-medium text-sm text-foreground truncate max-w-52">
                          {row.title}
                        </span>
                        <div className="flex items-center gap-1 text-muted text-[11px]">
                          <Phone size={10} />
                          <span className="dir-ltr">{row.phone}</span>
                        </div>
                      </div>
                    </div>
                  </Table.Cell>

                  {/* Status */}
                  <Table.Cell align="center">
                    <StatusBadge
                      status={row.status}
                      type="property"
                      variant="soft"
                      size="sm"
                    />
                  </Table.Cell>

                  {/* Score */}
                  <Table.Cell align="center">
                    <ScoreBadge score={row.score} size="sm" showLabel={false} />
                  </Table.Cell>

                  {/* District */}
                  <Table.Cell>
                    <div className="flex items-center gap-1 text-muted text-xs">
                      <MapPin size={12} />
                      <span>{row.district?.name || "—"}</span>
                    </div>
                  </Table.Cell>

                  {/* Price */}
                  <Table.Cell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-foreground">
                        {fmtPrice(row)}
                      </span>
                      {row.price_per_meter_toman && (
                        <span className="text-[10px] text-(--role-primary)">
                          متری:{" "}
                          {new Intl.NumberFormat("fa-IR").format(
                            row.price_per_meter_toman,
                          )}
                        </span>
                      )}
                    </div>
                  </Table.Cell>

                  {/* Year / Rooms / Floor */}
                  <Table.Cell align="center">
                    <span className="text-xs text-muted font-mono">
                      {fmtYearRoomsFloor(row)}
                    </span>
                  </Table.Cell>

                  {/* Source */}
                  <Table.Cell align="center">
                    <SourceTag source={row.source} />
                  </Table.Cell>

                  {/* Actions — three-dot dropdown */}
                  <Table.Cell align="center">
                    <TableActions
                      onView={() => modals.openDetail(row)}
                      // onEdit={() => console.log("edit", row.id)}
                      actions={[
                        row.url && {
                          label: "تخصیص به کارشناس",
                          icon: UserPlus,
                          onClick: () => modals.openAssign(row.id),
                        },
                        {
                          label: "مشاهده در منبع",
                          icon: ExternalLink,
                          onClick: () => window.open(row.url, "_blank"),
                        },
                      ].filter(Boolean)}
                      // onDelete={() => actions.remove(row.id)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Pagination */}
        <div className="shrink-0 pt-3">
          <TablePagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      </div>

      {/* Modals */}
      <ListingDetailModal
        isOpen={modals.detail.open}
        onClose={modals.closeDetail}
        listing={modals.detail.listing}
      />

      <AssignOperatorModal
        isOpen={modals.assign.open}
        onClose={modals.closeAssign}
        listingId={modals.assign.listingId}
        onAssign={actions.assign}
      />

      <ConfirmModal
        isOpen={actions.pendingDeleteId != null}
        title="حذف آگهی"
        message="آیا از حذف این آگهی اطمینان دارید؟ این عملیات قابل بازگشت نیست."
        onConfirm={actions.confirmDelete}
        onCancel={actions.cancelDelete}
        confirmText="حذف"
        cancelText="انصراف"
        variant="danger"
      />
    </div>
  );
}
