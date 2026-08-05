import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, Eye, Clock, Search, CalendarCheck } from "lucide-react";
import PageHeader from "@/shared/page/PageHeader";
import SearchBox from "@/shared/ui/SearchBox";
import Select from "@/shared/ui/selectors/Select";
import Button from "@/shared/ui/Button";
import Table from "@/shared/table/Table";
import TablePagination from "@/shared/table/TablePagination";
import TableActions from "@/shared/table/TableActions";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import Modal from "@/shared/ui/modal/Modal";
import { MotionDiv } from "@/animations/MotionElements";
import useListPage from "@/shared/useListPage";
import useTableSelection from "@/shared/table/useTableSelection";
import reminderService from "@/features/followups/services/reminderService";
import {toastService} from "@/lib/toast";

const PAGE_SIZE = 10;


const STATUS_OPTIONS = [
  { value: "pending", label: "در انتظار" },
  { value: "done", label: "انجام شده" },
  { value: "cancelled", label: "لغو شده" },
{value: "overdue" , label:"تاخیر"},
{value:"in_progress" , label:"درحال انجام"},
{value: "rescheduled" , label:"تغییر زمان"},
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

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("fa-IR") : "—");
const fmtDateTime = (v) =>
  v
    ? `${new Date(v).toLocaleDateString("fa-IR")} ${new Date(v).toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "—";

const StatusStats = ({ data }) => {
  const counts = useMemo(() => {
    const map = {};
    data.forEach((d) => {
      map[d.status] = (map[d.status] || 0) + 1;
    });
    return map;
  }, [data]);

  const items = [
    { key: "pending", },
    { key: "done", },
    { key: "cancelled",},
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 mt-3">
      {items.map(
        (s) =>
          counts[s.key] > 0 && (
            <div key={s.key} className="flex items-center gap-1.5 bg-surface rounded-lg px-2.5 py-1 border border-border">
              <StatusBadge status={s.key} type="followup" variant="dot" size="sm" />
              <span className="text-xs text-muted">{s.label}:</span>
              <span className="text-xs font-bold text-foreground">
                {counts[s.key].toLocaleString("fa-IR")}
              </span>
            </div>
          )
      )}
      <div className="flex items-center gap-1.5 bg-surface rounded-lg px-2.5 py-1 border border-border">
        <span className="text-xs text-muted">کل:</span>
        <span className="text-xs font-bold text-foreground">
          {data.length.toLocaleString("fa-IR")}
        </span>
      </div>
    </div>
  );
};

export default function FollowupsPage() {
  const {
    data: reminders,
    allData,
    loading,
    page,
    setPage,
    sort,
    toggleSort,
    search,
    setSearch,
    refresh,
    totalPages,
    totalCount,
  } = useListPage(reminderService, {
    pageSize: PAGE_SIZE,
    defaultSort: { column: "due_at", direction: "asc" },
  });

  const { selected, toggle, toggleAll, isSelected, allSelectedOnPage } =
    useTableSelection(reminders);
  const [detail, setDetail] = useState({ open: false, item: null });
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    if (!statusFilter) return reminders;
    return reminders.filter((r) => r.status === statusFilter);
  }, [reminders, statusFilter]);

  const allIds = useMemo(() => filtered.map((r) => r.id), [filtered]);
  const displayTotal = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const displayPage = Math.min(page, displayTotal);
  const displayReminders = filtered.slice(
    (displayPage - 1) * PAGE_SIZE,
    displayPage * PAGE_SIZE
  );

  const handleComplete = async (id) => {
    try {
      await reminderService.complete(id);
      toastService.success("پیگیری تکمیل شد");
      refresh();
    } catch {
      toastService.error("خطا در تکمیل پیگیری");
    }
  };

  const handleCancel = async (id) => {
    try {
      await reminderService.cancel(id);
      toastService.success("پیگیری لغو شد");
      refresh();
    } catch {
      toastService.error("خطا در لغو پیگیری");
    }
  };

  return (
    <MotionDiv
      className="space-y-6 rounded-2xl p-6"
      delay={0.1}
    >
      <div>
        <PageHeader
          title="پیگیری‌ها"
          subtitle="مدیریت وظایف و پیگیری‌های روزانه"
          backTo="/operator/dashboard"
        />
        <StatusStats data={allData} />
      </div>

      <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder="جستجو..."
              className="w-full md:w-64"
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_OPTIONS}
              placeholder="وضعیت"
              clearable
              size="sm"
              className="w-full md:w-40"
            />
          </div>
          <span className="text-sm text-muted">
            {totalCount.toLocaleString("fa-IR")} مورد
          </span>
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
              <Table.Column align="right">عنوان</Table.Column>
              <Table.Column align="right">توضیحات</Table.Column>
              <Table.Column align="center" width="140px">
                <SortHeader
                  label="تاریخ سررسید"
                  column="due_at"
                  sort={sort}
                  onToggle={toggleSort}
                />
              </Table.Column>
              <Table.Column align="center" width="100px">
                وضعیت
              </Table.Column>
              <Table.Column align="center" width="160px">
                عملیات
              </Table.Column>
            </Table.Header>

            <Table.Body
              emptyState={
                <Table.EmptyState
                  icon={Clock}
                  title="پیگیری یافت نشد"
                  description="با فیلترهای دیگر امتحان کنید"
                />
              }
            >
              {displayReminders.map((r) => (
                <Table.Row key={r.id} selected={isSelected(r.id)}>
                  <Table.Cell>
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                      checked={isSelected(r.id)}
                      onChange={() => toggle(r.id)}
                    />
                  </Table.Cell>
                  <Table.Cell align="right">
                    <span className="text-sm font-medium">{r.title}</span>
                  </Table.Cell>
                  <Table.Cell align="right">
                    <span className="text-sm line-clamp-1">
                      {r.description || "—"}
                    </span>
                  </Table.Cell>
                  <Table.Cell align="center">
                    <span className="text-sm">{fmtDateTime(r.due_at)}</span>
                  </Table.Cell>
                  <Table.Cell align="center">
                    <StatusBadge
                      status={r.status}
                      type="followup"
                      variant="soft"
                      size="sm"
                    />
                  </Table.Cell>
                  <Table.Cell align="center">
                    <div className="flex items-center justify-center gap-2">
                      {r.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            icon={CheckCircle2}
                            onClick={() => handleComplete(r.id)}
                            title="تکمیل"
                          />
                          <Button
                            size="sm"
                            variant="secondary"
                            icon={XCircle}
                            onClick={() => handleCancel(r.id)}
                            title="لغو"
                          />
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Eye}
                        onClick={() => setDetail({ open: true, item: r })}
                        title="مشاهده"
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <TablePagination
          page={displayPage}
          totalPages={displayTotal}
          onChange={setPage}
        />
      </div>

      <Modal
        isOpen={detail.open}
        onClose={() => setDetail({ open: false, item: null })}
        title="جزئیات پیگیری"
        size="md"
      >
        {detail.item && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted">عنوان</span>
              <p className="text-sm font-medium">{detail.item.title}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted">وضعیت</span>
              <p>
                <StatusBadge
                  status={detail.item.status}
                  type="followup"
                  variant="soft"
                  size="sm"
                />
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted">تاریخ سررسید</span>
              <p className="text-sm font-medium">
                {fmtDateTime(detail.item.due_at)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted">تاریخ تکمیل</span>
              <p className="text-sm font-medium">
                {detail.item.completed_at
                  ? fmtDateTime(detail.item.completed_at)
                  : "—"}
              </p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <span className="text-xs text-muted">توضیحات</span>
              <p className="text-sm">{detail.item.description || "—"}</p>
            </div>
          </div>
        )}
      </Modal>
    </MotionDiv>
  );
}