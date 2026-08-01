import { useState, useMemo } from "react";
import { Eye, Pencil, Trash2, Home, Search, Plus } from "lucide-react";
import PageHeader from "@/shared/ui/PageHeader";
import Button from "@/shared/ui/Button";
import SearchBox from "@/shared/ui/SearchBox";
import Select from "@/shared/ui/Select";
import Table from "@/shared/table/Table";
import TablePagination from "@/shared/table/TablePagination";
import TableActions from "@/shared/table/TableActions";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import Modal from "@/shared/ui/modal/Modal";
import { MotionDiv } from "@/animations/MotionElements";
import useListPage from "@/shared/useListPage";
import useTableSelection from "@/shared/table/useTableSelection";
import propertyService from "@/features/properties/services/propertyService";

const PAGE_SIZE = 10;

const DEAL_TYPE_OPTIONS = [
  { value: "sale", label: "فروش" },
  { value: "rent", label: "اجاره" },
  { value: "mortgage", label: "رهن" },
];

const STATUS_OPTIONS = [
  { value: "available", label: "فعال" },
  { value: "reserved", label: "رزرو شده" },
  { value: "sold", label: "فروخته شده" },
  { value: "rented", label: "اجاره رفته" },
];

const SortHeader = ({ label, column, sort, onToggle }) => {
  const active = sort.column === column;
  return (
    <button onClick={() => onToggle(column)} className="flex items-center gap-1 w-full justify-center hover:text-primary transition-colors">
      {label}
      {active && <span className="text-primary">{sort.direction === "asc" ? "↑" : "↓"}</span>}
    </button>
  );
};

const fmtPrice = (row) => {
  if (row.sale_price) return `${(row.sale_price / 1_000_000).toFixed(0)} میلیون`;
  if (row.monthly_rent) {
    const rent = `${(row.monthly_rent / 1_000_000).toFixed(0)} میلیون`;
    if (row.deposit_amount) return `ودیعه ${(row.deposit_amount / 1_000_000).toFixed(0)} میلیون / اجاره ${rent}`;
    return `${rent} اجاره`;
  }
  if (row.mortgage_amount) return `رهن ${(row.mortgage_amount / 1_000_000).toFixed(0)} میلیون`;
  return "—";
};

const mapStatus = (s) => ({ available: "active", reserved: "pending", sold: "sold", rented: "rented" }[s] || s);

const StatusStats = ({ data }) => {
  const counts = useMemo(() => {
    const map = {};
    data.forEach((d) => { map[d.status] = (map[d.status] || 0) + 1; });
    return map;
  }, [data]);

  const items = [
    { key: "available", label: "", status: "active" },
    { key: "reserved", label: "", status: "pending" },
    { key: "sold", label: "", status: "sold" },
    { key: "rented", label: "", status: "rented" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 mt-3">
      {items.map((s) => counts[s.key] > 0 && (
        <div key={s.key} className="flex items-center gap-1.5 bg-surface rounded-lg px-2.5 py-1 border border-border">
          <StatusBadge status={s.status} type="property" variant="dot" size="sm" />
          <span className="text-xs text-muted">{s.label}:</span>
          <span className="text-xs font-bold text-foreground">{counts[s.key].toLocaleString("fa-IR")}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5 bg-surface rounded-lg px-2.5 py-1 border border-border">
        <span className="text-xs text-muted">کل:</span>
        <span className="text-xs font-bold text-foreground">{data.length.toLocaleString("fa-IR")}</span>
      </div>
    </div>
  );
};

export default function PropertiesPage() {
  const {
    data: properties, allData, loading, page, setPage, sort, toggleSort,
    search, setSearch, remove, pendingDeleteId, confirmDelete, cancelDelete,
    refresh, totalPages, totalCount,
  } = useListPage(propertyService, { pageSize: PAGE_SIZE, defaultSort: { column: "id", direction: "desc" } });

  const { selected, toggle, toggleAll, isSelected, allSelectedOnPage } = useTableSelection(properties);
  const [detail, setDetail] = useState({ open: false, item: null });
  const [dealFilter, setDealFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    let res = [...properties];
    if (dealFilter) res = res.filter((p) => p.deal_type === dealFilter);
    if (statusFilter) res = res.filter((p) => p.status === statusFilter);
    return res;
  }, [properties, dealFilter, statusFilter]);

  const allIds = useMemo(() => filtered.map((p) => p.id), [filtered]);
  const displayTotal = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const displayPage = Math.min(page, displayTotal);
  const displayProps = filtered.slice((displayPage - 1) * PAGE_SIZE, displayPage * PAGE_SIZE);

  return (
    <MotionDiv className="space-y-6 rounded-2xl p-6 " delay={0.1}>
      <div>
        <PageHeader
          title="املاک"
          subtitle="مدیریت املاک ثبت شده"
          backTo="/operator/dashboard"
          actions={<Button variant="primary" size="sm" icon={Plus}>ملک جدید</Button>}
        />
        <StatusStats data={allData} />
      </div>

      <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <SearchBox value={search} onChange={setSearch} placeholder="جستجو در عنوان، کد..." className="w-full md:w-64" />
            <Select value={dealFilter} onChange={setDealFilter} options={DEAL_TYPE_OPTIONS} placeholder="نوع معامله" clearable size="sm" className="w-full md:w-40" />
            <Select value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} placeholder="وضعیت" clearable size="sm" className="w-full md:w-40" />
          </div>
          <span className="text-sm text-muted">{totalCount.toLocaleString("fa-IR")} مورد</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <Table loading={loading}>
            <Table.Header>
              <Table.Column width="40px">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary cursor-pointer" checked={allSelectedOnPage(allIds)} onChange={() => toggleAll(allIds)} />
              </Table.Column>
              <Table.Column align="right" width="120px"><SortHeader label="کد ملک" column="property_code" sort={sort} onToggle={toggleSort} /></Table.Column>
              <Table.Column align="right">عنوان</Table.Column>
              <Table.Column align="center" width="100px">نوع</Table.Column>
              <Table.Column align="center" width="100px">وضعیت</Table.Column>
              <Table.Column align="center" width="80px">متراژ</Table.Column>
              <Table.Column align="right" width="140px">قیمت</Table.Column>
              <Table.Column align="right" width="120px">مالک</Table.Column>
              <Table.Column align="center" width="120px">عملیات</Table.Column>
            </Table.Header>

            <Table.Body emptyState={<Table.EmptyState icon={Home} title="ملکی یافت نشد" description="با فیلترهای دیگر امتحان کنید" />}>
              {displayProps.map((p) => (
                <Table.Row key={p.id} selected={isSelected(p.id)}>
                  <Table.Cell>
                    <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary cursor-pointer" checked={isSelected(p.id)} onChange={() => toggle(p.id)} />
                  </Table.Cell>
                  <Table.Cell align="right"><span className="text-sm font-mono text-muted">{p.property_code}</span></Table.Cell>
                  <Table.Cell align="right"><span className="text-sm font-medium">{p.title}</span></Table.Cell>
                  <Table.Cell align="center">
                    <span className="text-sm">{p.deal_type === "sale" ? "فروش" : p.deal_type === "rent" ? "اجاره" : p.deal_type === "mortgage" ? "رهن" : p.deal_type}</span>
                  </Table.Cell>
                  <Table.Cell align="center"><StatusBadge status={mapStatus(p.status)} type="property" variant="soft" size="sm" /></Table.Cell>
                  <Table.Cell align="center"><span className="text-sm">{p.area} متر</span></Table.Cell>
                  <Table.Cell align="right"><span className="text-sm font-medium">{fmtPrice(p)}</span></Table.Cell>
                  <Table.Cell align="right"><span className="text-sm">{p.owner?.full_name || "—"}</span></Table.Cell>
                  <Table.Cell align="center">
                    <TableActions onView={() => setDetail({ open: true, item: p })} onEdit={() => {}} onDelete={() => remove(p.id)} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <TablePagination page={displayPage} totalPages={displayTotal} onChange={setPage} />
      </div>

      <ConfirmModal isOpen={pendingDeleteId !== null} onClose={cancelDelete} onConfirm={confirmDelete} title="حذف ملک" message="آیا از حذف این ملک اطمینان دارید؟" confirmText="حذف" cancelText="انصراف" variant="danger" />

      <Modal isOpen={detail.open} onClose={() => setDetail({ open: false, item: null })} title="جزئیات ملک" size="lg" scrollable>
        {detail.item && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><span className="text-xs text-muted">کد</span><p className="text-sm font-medium">{detail.item.property_code}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">عنوان</span><p className="text-sm font-medium">{detail.item.title}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">نوع معامله</span><p className="text-sm font-medium">{detail.item.deal_type === "sale" ? "فروش" : detail.item.deal_type === "rent" ? "اجاره" : "رهن"}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">نوع ملک</span><p className="text-sm font-medium">{detail.item.property_type === "APARTMENT" ? "آپارتمان" : detail.item.property_type === "VILLA" ? "ویلا" : detail.item.property_type === "COMMERCIAL" ? "تجاری" : detail.item.property_type}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">وضعیت</span><p><StatusBadge status={mapStatus(detail.item.status)} type="property" variant="soft" size="sm" /></p></div>
            <div className="space-y-1"><span className="text-xs text-muted">متراژ</span><p className="text-sm font-medium">{detail.item.area} متر</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">قیمت</span><p className="text-sm font-medium">{fmtPrice(detail.item)}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">اتاق</span><p className="text-sm font-medium">{detail.item.bedrooms} خواب</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">طبقه</span><p className="text-sm font-medium">{detail.item.floor} از {detail.item.total_floors}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">سن بنا</span><p className="text-sm font-medium">{detail.item.age} سال</p></div>
            <div className="space-y-1 md:col-span-2"><span className="text-xs text-muted">آدرس</span><p className="text-sm">{detail.item.address?.full_text || "—"}</p></div>
            <div className="space-y-1 md:col-span-2"><span className="text-xs text-muted">توضیحات</span><p className="text-sm">{detail.item.description || "—"}</p></div>
          </div>
        )}
      </Modal>
    </MotionDiv>
  );
}