import { useState, useMemo } from "react";
import { Eye, Phone, PhoneIncoming, PhoneOutgoing, Search, Calendar, Clock, Plus } from "lucide-react";
import PageHeader from "@/shared/page/PageHeader";
import Button from "@/shared/ui/Button";
import SearchBox from "@/shared/ui/SearchBox";
import Select from "@/shared/ui/selectors/Select";
import Table from "@/shared/table/Table";
import TablePagination from "@/shared/table/TablePagination";
import TableActions from "@/shared/table/TableActions";
import Modal from "@/shared/ui/modal/Modal";
import { MotionDiv } from "@/animations/MotionElements";
import useListPage from "@/shared/useListPage";
import useTableSelection from "@/shared/table/useTableSelection";
import callService from "@/features/calls/services/callService";
import RegisterCallForm from "@/shared/forms/RegisterCallForm";
import StatusBadge from "@/shared/ui/badges/StatusBadge"
import { getStatusConfig } from "../../../constants/statusConfig";

const PAGE_SIZE = 10;

const CALL_TYPE_OPTIONS = [
  { value: "incoming", label: "ورودی" },
  { value: "outgoing", label: "خروجی" },
];

const RESULT_OPTIONS = [
  { value: "interested", label: "علاقه‌مند" },
  { value: "no_answer", label: "بدون پاسخ" },
  { value: "follow_up", label: "پیگیری" },
  { value: "visit_booked", label: "قرار بازدید" },
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
const fmtTime = (v) => v ? new Date(v).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }) : "—";
const fmtDuration = (s) => {
  if (!s) return "—";
  if (s < 60) return `${s} ثانیه`;
  return `${Math.floor(s / 60)} دقیقه`;
};

const StatusStats = ({ data }) => {
  const counts = useMemo(() => {
    const map = {};
    data.forEach((d) => { 
      // تبدیل no_answer به no-answer برای هماهنگی با config
      const key = d.result === "no_answer" ? "no-answer" : d.result;
      map[key] = (map[key] || 0) + 1; 
    });
    return map;
  }, [data]);

  const items = [
    { key: "interested" },
    { key: "visit_booked" },
    { key: "follow_up" },
    { key: "no-answer" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 mt-3">
      {items.map((item) => {
        const count = counts[item.key] || 0;
        if (count === 0) return null;
        
        const config = getStatusConfig(item.key, "call");
        
        return (
          <div key={item.key} className="flex items-center gap-1.5 bg-surface rounded-lg px-2.5 py-1 border border-border">
            <span className={`w-2 h-2 rounded-full ${config.dot}`} />
            <span className="text-xs text-muted">{config.label}:</span>
            <span className="text-xs font-bold text-foreground">
              {count.toLocaleString("fa-IR")}
            </span>
          </div>
        );
      })}
      
      <div className="flex items-center gap-1.5 bg-surface rounded-lg px-2.5 py-1 border border-border">
        <span className="text-xs text-muted">کل:</span>
        <span className="text-xs font-bold text-foreground">
          {data.length.toLocaleString("fa-IR")}
        </span>
      </div>
    </div>
  );
};

export default function CallsPage() {
  const {
    data: calls, allData, loading, page, setPage, sort, toggleSort,
    search, setSearch, refresh, totalPages, totalCount,
  } = useListPage(callService, { pageSize: PAGE_SIZE, defaultSort: { column: "called_at", direction: "desc" } });

  const { selected, toggle, toggleAll, isSelected, allSelectedOnPage } = useTableSelection(calls);
  const [detail, setDetail] = useState({ open: false, item: null });
  const [newCall, setNewCall] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");

  const filtered = useMemo(() => {
    let res = [...calls];
    if (typeFilter) res = res.filter((c) => c.call_type === typeFilter);
    if (resultFilter) res = res.filter((c) => c.result === resultFilter);
    return res;
  }, [calls, typeFilter, resultFilter]);

  const allIds = useMemo(() => filtered.map((c) => c.id), [filtered]);
  const displayTotal = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const displayPage = Math.min(page, displayTotal);
  const displayCalls = filtered.slice((displayPage - 1) * PAGE_SIZE, displayPage * PAGE_SIZE);

  return (
    <MotionDiv className="space-y-6 rounded-2xl p-6 " delay={0.1}>
      <div>
        <PageHeader
          title="تماس‌ها"
          subtitle="گزارش تماس‌های ورودی و خروجی"
          backTo="/operator/dashboard"
          actions={<Button variant="primary" size="sm" icon={Plus} onClick={() => setNewCall(true)}>تماس جدید</Button>}
        />
        <StatusStats data={allData} />
      </div>

      <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <SearchBox value={search} onChange={setSearch} placeholder="جستجو..." className="w-full md:w-64" />
            <Select value={typeFilter} onChange={setTypeFilter} options={CALL_TYPE_OPTIONS} placeholder="نوع تماس" clearable size="sm" className="w-full md:w-40" />
            <Select value={resultFilter} onChange={setResultFilter} options={RESULT_OPTIONS} placeholder="نتیجه" clearable size="sm" className="w-full md:w-40" />
          </div>
          <span className="text-sm text-muted">{totalCount.toLocaleString("fa-IR")} مورد</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <Table loading={loading}>
            <Table.Header>
              <Table.Column width="40px">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary cursor-pointer" checked={allSelectedOnPage(allIds)} onChange={() => toggleAll(allIds)} />
              </Table.Column>
              <Table.Column align="center" width="120px"><SortHeader label="تاریخ" column="called_at" sort={sort} onToggle={toggleSort} /></Table.Column>
              <Table.Column align="center" width="100px">نوع</Table.Column>
              <Table.Column align="center" width="120px">نتیجه</Table.Column>
              <Table.Column align="center" width="80px">مدت</Table.Column>
              <Table.Column align="right">یادداشت</Table.Column>
              <Table.Column align="right" width="160px">آگهی</Table.Column>
              <Table.Column align="center" width="80px">عملیات</Table.Column>
            </Table.Header>

            <Table.Body emptyState={<Table.EmptyState icon={Phone} title="تماسی یافت نشد" description="با فیلترهای دیگر امتحان کنید" />}>
              {displayCalls.map((call) => (
                <Table.Row key={call.id} selected={isSelected(call.id)}>
                  <Table.Cell>
                    <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary cursor-pointer" checked={isSelected(call.id)} onChange={() => toggle(call.id)} />
                  </Table.Cell>
                  <Table.Cell align="center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium">{fmtDate(call.called_at)}</span>
                      <span className="text-xs text-muted">{fmtTime(call.called_at)}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell align="center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-surface-2 text-muted border border-border">
                      {call.call_type === "incoming" ? <PhoneIncoming className="w-3 h-3" /> : <PhoneOutgoing className="w-3 h-3" />}
                      {call.call_type === "incoming" ? "ورودی" : "خروجی"}
                    </span>
                  </Table.Cell>
                  <Table.Cell align="center">
                    <span className="text-sm">{RESULT_OPTIONS.find((o) => o.value === call.result)?.label || call.result}</span>
                  </Table.Cell>
                  <Table.Cell align="center"><span className="text-sm font-medium">{fmtDuration(call.call_duration)}</span></Table.Cell>
                  <Table.Cell align="right"><span className="text-sm line-clamp-1">{call.note || "—"}</span></Table.Cell>
                  <Table.Cell align="right"><span className="text-sm">{call.listing?.title || "—"}</span></Table.Cell>
                  <Table.Cell align="center">
                    <TableActions onView={() => setDetail({ open: true, item: call })} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <TablePagination page={displayPage} totalPages={displayTotal} onChange={setPage} />
      </div>

      <Modal isOpen={detail.open} onClose={() => setDetail({ open: false, item: null })} title="جزئیات تماس" size="md">
        {detail.item && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><span className="text-xs text-muted">شناسه</span><p className="text-sm font-medium">{detail.item.id}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">نوع تماس</span><p className="text-sm font-medium">{detail.item.call_type === "incoming" ? "ورودی" : "خروجی"}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">نتیجه</span><p className="text-sm font-medium">{RESULT_OPTIONS.find((o) => o.value === detail.item.result)?.label || detail.item.result}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">مدت</span><p className="text-sm font-medium">{fmtDuration(detail.item.call_duration)}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">تاریخ</span><p className="text-sm font-medium">{fmtDate(detail.item.called_at)} {fmtTime(detail.item.called_at)}</p></div>
            <div className="space-y-1"><span className="text-xs text-muted">آگهی</span><p className="text-sm font-medium">{detail.item.listing?.title || "—"}</p></div>
            <div className="space-y-1 md:col-span-2"><span className="text-xs text-muted">یادداشت</span><p className="text-sm">{detail.item.note || "—"}</p></div>
          </div>
        )}
      </Modal>

      <Modal isOpen={newCall} onClose={() => setNewCall(false)} title="ثبت تماس جدید" size="md">
        <RegisterCallForm onSubmit={() => { setNewCall(false); refresh(); }} onCancel={() => setNewCall(false)} />
      </Modal>
    </MotionDiv>
  );
}