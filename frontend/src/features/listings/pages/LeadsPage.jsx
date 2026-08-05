import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, Pencil, Trash2, Home, Plus, Search } from "lucide-react";
import PageHeader from "@/shared/page/PageHeader";
import Button from "@/shared/ui/Button";
import SearchBox from "@/shared/ui/SearchBox";
import Table from "@/shared/table/Table";
import TablePagination from "@/shared/table/TablePagination";
import TableActions from "@/shared/table/TableActions";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import ScoreBadge from "@/shared/ui/badges/ScoreBadge";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import Modal from "@/shared/ui/modal/Modal";
import { MotionDiv } from "@/animations/MotionElements";
import useListPage from "@/shared/useListPage";
import useTableSelection from "@/shared/table/useTableSelection";
import listingService from "@/features/listings/services/listingService";

const PAGE_SIZE = 10;

const SortHeader = ({ label, column, sort, onToggle }) => {
  const active = sort.column === column;
  return (
    <button
      onClick={() => onToggle(column)}
      className="flex items-center gap-1 w-full justify-center hover:text-primary transition-colors"
    >
      {label}
      {active && (
        <span className="text-primary">{sort.direction === "asc" ? "↑" : "↓"}</span>
      )}
    </button>
  );
};

const Thumbnail = ({ src }) => (
  <div className="w-12 h-12 rounded-lg bg-surface-2 border border-border flex items-center justify-center overflow-hidden">
    {src ? (
      <img src={src} alt="" className="w-full h-full object-cover" />
    ) : (
      <Home className="w-5 h-5 text-muted" />
    )}
  </div>
);

const fmtPrice = (row) => {
  if (row.listed_sale_price) {
    if (row.listed_sale_price >= 1_000_000_000)
      return `${(row.listed_sale_price / 1_000_000_000).toFixed(1)} میلیارد`;
    return `${(row.listed_sale_price / 1_000_000).toFixed(0)} میلیون`;
  }
  if (row.listed_rent_amount) {
    const rent = `${(row.listed_rent_amount / 1_000_000).toFixed(1)} میلیون`;
    const deposit = row.deposit_toman || row.listed_deposit_amount;
    if (deposit) {
      const depositFmt =
        deposit >= 1_000_000_000
          ? `${(deposit / 1_000_000_000).toFixed(1)} میلیارد`
          : `${(deposit / 1_000_000).toFixed(0)} میلیون`;
      return `ودیعه ${depositFmt} / اجاره ${rent}`;
    }
    return `${rent} اجاره`;
  }
  return "—";
};

const fmtSource = (source) => {
  const map = { divar: "دیوار", sheypoor: "شیپور", internal: "داخلی" };
  return map[source] || source || "—";
};

export default function LeadsPage() {
  const {
    data: leads,
    loading,
    page,
    setPage,
    sort,
    toggleSort,
    search,
    setSearch,
    remove,
    pendingDeleteId,
    confirmDelete,
    cancelDelete,
    refresh,
    totalPages,
    totalCount,
  } = useListPage(listingService, { pageSize: PAGE_SIZE, defaultSort: { column: "score", direction: "desc" } });

  const { selected, toggle, toggleAll, clear, isSelected, allSelectedOnPage } =
    useTableSelection(leads);

  const [detail, setDetail] = useState({ open: false, item: null });

  const allIds = useMemo(() => leads.map((l) => l.id), [leads]);

  return (
    <MotionDiv className="space-y-6" delay={0.1}>
      <PageHeader
        title="لیدهای من"
        subtitle="مدیریت لیدهای تخصیص یافته به شما"
        backTo="/operator/dashboard"
        actions={
          <Button variant="primary" size="sm" icon={Plus}>
            لید جدید
          </Button>
        }
      />

      <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-5">
        <div className="flex flex-row md:flex-row gap-4 items-start md:items-center justify-between">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="جستجو در عنوان، منطقه، شماره..."
            className="w-full md:w-80"
          />
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>{totalCount.toLocaleString("fa-IR")} مورد</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <Table loading={loading}>
            <Table.Header>
              <Table.Column width="40px">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                  checked={allSelectedOnPage(allIds)}
                  onChange={() => toggleAll(allIds)}
                />
              </Table.Column>
              <Table.Column align="right">
                <SortHeader label="عنوان" column="title" sort={sort} onToggle={toggleSort} />
              </Table.Column>
              <Table.Column align="center" width="100px">
                <SortHeader label="وضعیت" column="status" sort={sort} onToggle={toggleSort} />
              </Table.Column>
              <Table.Column align="center" width="80px">
                <SortHeader label="امتیاز" column="score" sort={sort} onToggle={toggleSort} />
              </Table.Column>
              <Table.Column align="right" width="140px">
                <SortHeader label="منطقه" column="district" sort={sort} onToggle={toggleSort} />
              </Table.Column>
              <Table.Column align="right" width="140px">
                <SortHeader label="قیمت" column="price" sort={sort} onToggle={toggleSort} />
              </Table.Column>
              <Table.Column align="center" width="80px">منبع</Table.Column>
              <Table.Column align="center" width="120px">عملیات</Table.Column>
            </Table.Header>

            <Table.Body
              emptyState={
                <Table.EmptyState
                  icon={Search}
                  title="لیدی یافت نشد"
                  description="با فیلترهای دیگر امتحان کنید"
                />
              }
            >
              {leads.map((lead) => (
                <Table.Row key={lead.id} selected={isSelected(lead.id)}>
                  <Table.Cell>
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                      checked={isSelected(lead.id)}
                      onChange={() => toggle(lead.id)}
                    />
                  </Table.Cell>
                  <Table.Cell align="right">
                    <div className="flex items-center gap-3">
                      <Thumbnail src={lead.thumbnail_url} />
                      <div>
                        <p className="font-medium text-sm">{lead.title}</p>
                        <p className="text-xs text-muted">{lead.phone || "—"}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell align="center">
                    <StatusBadge status={lead.status} type="property" variant="soft" size="sm" />
                  </Table.Cell>
                  <Table.Cell align="center">
                    <ScoreBadge score={lead.score} size="sm" />
                  </Table.Cell>
                  <Table.Cell align="right">
                    <span className="text-sm">{lead.district?.name || "—"}</span>
                  </Table.Cell>
                  <Table.Cell align="right">
                    <span className="text-sm font-medium">{fmtPrice(lead)}</span>
                  </Table.Cell>
                  <Table.Cell align="center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-surface-2 text-muted border border-border">
                      {fmtSource(lead.source)}
                    </span>
                  </Table.Cell>
                  <Table.Cell align="center">
                    <TableActions
                      onView={() => setDetail({ open: true, item: lead })}
                      onEdit={() => {}}
                      onDelete={() => remove(lead.id)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <TablePagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      <ConfirmModal
        isOpen={pendingDeleteId !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="حذف لید"
        message="آیا از حذف این لید اطمینان دارید؟"
        confirmText="حذف"
        cancelText="انصراف"
        variant="danger"
      />

      <Modal
        isOpen={detail.open}
        onClose={() => setDetail({ open: false, item: null })}
        title="جزئیات لید"
        size="lg"
        scrollable
      >
        {detail.item && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><span className="text-xs text-muted">شناسه</span><p className="text-sm font-medium">{detail.item.id}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">عنوان</span><p className="text-sm font-medium">{detail.item.title}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">شماره تماس</span><p className="text-sm font-medium">{detail.item.phone || "—"}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">منبع</span><p className="text-sm font-medium">{fmtSource(detail.item.source)}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">وضعیت</span><p><StatusBadge status={detail.item.status} type="lead" variant="soft" size="sm" /></p></div>
            <div className="space-y-1"><span className="text-xs text-muted">امتیاز</span><p><ScoreBadge score={detail.item.score} size="sm" /></p></div>
            <div className="space-y-1"><span className="text-xs text-muted">منطقه</span><p className="text-sm font-medium">{detail.item.district?.name || "—"}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">قیمت</span><p className="text-sm font-medium">{fmtPrice(detail.item)}</p></div>
            <div className="space-y-1 md:col-span-2"><span className="text-xs text-muted">توضیحات</span><p className="text-sm">{detail.item.description || "—"}</p></div>
          </div>
        )}
      </Modal>
    </MotionDiv>
  );
}