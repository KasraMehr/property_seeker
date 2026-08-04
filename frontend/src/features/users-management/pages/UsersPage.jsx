import { useState, useMemo } from "react";
import { Eye, Pencil, Trash2, Users, Search, Plus, Shield, MapPin } from "lucide-react";
import PageHeader from "@/shared/page/PageHeader";
import Button from "@/shared/ui/Button";
import SearchBox from "@/shared/ui/SearchBox";
import Select from "@/shared/ui/selectors/Select";
import Table from "@/shared/table/Table";
import TablePagination from "@/shared/table/TablePagination";
import TableActions from "@/shared/table/TableActions";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import RoleBadge from "@/shared/ui/badges/RoleBadge";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import Modal from "@/shared/ui/modal/Modal";
import { MotionDiv } from "@/animations/MotionElements";
import useListPage from "@/shared/useListPage";
import useTableSelection from "@/shared/table/useTableSelection";
import userService from "@/features/users-management/services/userService";

const PAGE_SIZE = 10;

const ROLE_OPTIONS = [
  { value: "مدیر", label: "مدیر" },
  { value: "سرپرست", label: "سرپرست" },
  { value: "اپراتور / کارشناس", label: "اپراتور / کارشناس" },
  { value: "مشاور املاک", label: "مشاور املاک" },
  { value: "ناظر", label: "ناظر" },
];

const STATUS_OPTIONS = [
  { value: "true", label: "فعال" },
  { value: "false", label: "غیرفعال" },
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

const fmtDate = (v) => v ? new Date(v).toLocaleDateString("fa-IR") : "—";

export default function UsersPage() {
  const {
    data: users,
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
  } = useListPage(userService, { pageSize: PAGE_SIZE, defaultSort: { column: "id", direction: "desc" } });

  const { selected, toggle, toggleAll, isSelected, allSelectedOnPage } = useTableSelection(users);
  const [detail, setDetail] = useState({ open: false, item: null });
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    let res = [...users];
    if (roleFilter) res = res.filter((u) => u.role?.some((r) => r.name === roleFilter || r === roleFilter));
    if (statusFilter) {
      const active = statusFilter === "true";
      res = res.filter((u) => u.is_active === active);
    }
    return res;
  }, [users, roleFilter, statusFilter]);

  const allIds = useMemo(() => filtered.map((u) => u.id), [filtered]);
  const displayTotal = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const displayPage = Math.min(page, displayTotal);
  const displayUsers = filtered.slice((displayPage - 1) * PAGE_SIZE, displayPage * PAGE_SIZE);

  return (
    <MotionDiv className="space-y-6" delay={0.1}>
      <PageHeader
        title="کاربران"
        subtitle="مدیریت کاربران سیستم"
        backTo="/admin/dashboard"
        actions={
          <Button variant="primary" size="sm" icon={Plus}>
            کاربر جدید
          </Button>
        }
      />

      <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <SearchBox value={search} onChange={setSearch} placeholder="جستجو در نام، موبایل..." className="w-full md:w-64" />
            <Select value={roleFilter} onChange={setRoleFilter} options={ROLE_OPTIONS} placeholder="نقش" clearable size="sm" className="w-full md:w-36" />
            <Select value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} placeholder="وضعیت" clearable size="sm" className="w-full md:w-36" />
          </div>
          <span className="text-sm text-muted">{totalCount.toLocaleString("fa-IR")} مورد</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <Table loading={loading}>
            <Table.Header>
              <Table.Column width="40px">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary cursor-pointer" checked={allSelectedOnPage(allIds)} onChange={() => toggleAll(allIds)} />
              </Table.Column>
              <Table.Column align="right">
                <SortHeader label="نام" column="full_name" sort={sort} onToggle={toggleSort} />
              </Table.Column>
              <Table.Column align="center" width="120px">موبایل</Table.Column>
              <Table.Column align="center" width="100px">نقش</Table.Column>
              <Table.Column align="center" width="100px">وضعیت</Table.Column>
              <Table.Column align="right" width="160px">مناطق خدمت</Table.Column>
              <Table.Column align="center" width="120px">
                <SortHeader label="تاریخ ایجاد" column="created_at" sort={sort} onToggle={toggleSort} />
              </Table.Column>
              <Table.Column align="center" width="120px">عملیات</Table.Column>
            </Table.Header>

            <Table.Body emptyState={<Table.EmptyState icon={Users} title="کاربری یافت نشد" description="با فیلترهای دیگر امتحان کنید" />}>
              {displayUsers.map((u) => (
                <Table.Row key={u.id} selected={isSelected(u.id)}>
                  <Table.Cell>
                    <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary cursor-pointer" checked={isSelected(u.id)} onChange={() => toggle(u.id)} />
                  </Table.Cell>
                  <Table.Cell align="right">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center">
                        <Users className="w-4 h-4 text-muted" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.full_name}</p>
                        <p className="text-xs text-muted">{u.national_id || "—"}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell align="center"><span className="text-sm font-mono">{u.phone}</span></Table.Cell>
                  <Table.Cell align="center">
                    {u.role?.map((r, i) => (
                      <RoleBadge key={i} role={r.name || r} variant="soft" size="sm" />
                    ))}
                  </Table.Cell>
                  <Table.Cell align="center">
                    <StatusBadge status={u.is_active ? "active" : "inactive"} type="user" variant="soft" size="sm" />
                  </Table.Cell>
                  <Table.Cell align="right">
                    <span className="text-sm">
                      {u.service_districts?.map((d) => d.name).join("، ") || "—"}
                    </span>
                  </Table.Cell>
                  <Table.Cell align="center"><span className="text-sm">{fmtDate(u.created_at)}</span></Table.Cell>
                  <Table.Cell align="center">
                    <TableActions onView={() => setDetail({ open: true, item: u })} onEdit={() => {}} onDelete={() => remove(u.id)} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <TablePagination page={displayPage} totalPages={displayTotal} onChange={setPage} />
      </div>

      <ConfirmModal isOpen={pendingDeleteId !== null} onClose={cancelDelete} onConfirm={confirmDelete} title="حذف کاربر" message="آیا از حذف این کاربر اطمینان دارید؟" confirmText="حذف" cancelText="انصراف" variant="danger" />

      <Modal isOpen={detail.open} onClose={() => setDetail({ open: false, item: null })} title="جزئیات کاربر" size="md">
        {detail.item && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><span className="text-xs text-muted">نام</span><p className="text-sm font-medium">{detail.item.full_name}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">موبایل</span><p className="text-sm font-medium">{detail.item.phone}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">کد ملی</span><p className="text-sm font-medium">{detail.item.national_id || "—"}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">نقش</span><p>{detail.item.role?.map((r, i) => <RoleBadge key={i} role={r.name || r} variant="soft" size="sm" />)}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">وضعیت</span><p><StatusBadge status={detail.item.is_active ? "active" : "inactive"} type="user" variant="soft" size="sm" /></p></div>
            <div className="space-y-1"><span className="text-xs text-muted">آژانس</span><p className="text-sm font-medium">{detail.item.agency?.name || "—"}</p></div>
            <div className="space-y-1 md:col-span-2"><span className="text-xs text-muted">مناطق خدمت</span><p className="text-sm">{detail.item.service_districts?.map((d) => d.name).join("، ") || "—"}</p></div>
          </div>
        )}
      </Modal>
    </MotionDiv>
  );
}