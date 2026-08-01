import { useEffect, useState, useMemo } from "react";
import { MapPin, Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import PageHeader from "@/shared/ui/PageHeader";
import Button from "@/shared/ui/Button";
import SearchBox from "@/shared/ui/SearchBox";
import Select from "@/shared/ui/Select";
import Table from "@/shared/table/Table";
import TablePagination from "@/shared/table/TablePagination";
import TableActions from "@/shared/table/TableActions";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import { MotionDiv } from "@/animations/MotionElements";
import useTableSelection from "@/shared/table/useTableSelection";
import locationService from "@/features/regions-management/services/locationService";

const PAGE_SIZE = 10;

const CITY_OPTIONS = [
  { value: 1, label: "کرج" },
  { value: 2, label: "ماهدشت" },
  { value: 3, label: "تهران" },
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

export default function RegionsPage() {
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ column: "id", direction: "asc" });
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [dRes, cRes] = await Promise.all([
          locationService.getDistricts(),
          locationService.getCities(),
        ]);
        setDistricts(dRes.data ?? []);
        setCities(cRes.data ?? []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cityMap = useMemo(() => {
    const map = {};
    cities.forEach((c) => { map[c.id] = c.name; });
    return map;
  }, [cities]);

  const filtered = useMemo(() => {
    let res = [...districts];
    if (cityFilter) res = res.filter((d) => d.city === Number(cityFilter));
    if (search) {
      const q = search.toLowerCase();
      res = res.filter((d) => d.name.toLowerCase().includes(q));
    }
    if (sort.column) {
      const d = sort.direction === "asc" ? 1 : -1;
      res.sort((a, b) => {
        let av = a[sort.column];
        let bv = b[sort.column];
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av < bv) return -1 * d;
        if (av > bv) return 1 * d;
        return 0;
      });
    }
    return res;
  }, [districts, cityFilter, search, sort.column, sort.direction]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const displayPage = Math.min(page, totalPages);
  const displayItems = filtered.slice((displayPage - 1) * PAGE_SIZE, displayPage * PAGE_SIZE);

  const { selected, toggle, toggleAll, isSelected, allSelectedOnPage } = useTableSelection(displayItems);
  const allIds = useMemo(() => displayItems.map((d) => d.id), [displayItems]);

  const toggleSort = (col) => {
    setSort((prev) => (prev.column === col ? { ...prev, direction: prev.direction === "asc" ? "desc" : "asc" } : { column: col, direction: "asc" }));
  };

  return (
    <MotionDiv className="space-y-6" delay={0.1}>
      <PageHeader
        title="مدیریت مناطق"
        subtitle="مشاهده و مدیریت مناطق و محله‌ها"
        backTo="/admin/dashboard"
        actions={
          <Button variant="primary" size="sm" icon={Plus}>
            منطقه جدید
          </Button>
        }
      />

      <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <SearchBox value={search} onChange={setSearch} placeholder="جستجو در نام منطقه..." className="w-full md:w-64" />
            <Select value={cityFilter} onChange={setCityFilter} options={CITY_OPTIONS} placeholder="شهر" clearable size="sm" className="w-full md:w-40" />
          </div>
          <span className="text-sm text-muted">{filtered.length.toLocaleString("fa-IR")} مورد</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <Table loading={loading}>
            <Table.Header>
              <Table.Column width="40px">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary cursor-pointer" checked={allSelectedOnPage(allIds)} onChange={() => toggleAll(allIds)} />
              </Table.Column>
              <Table.Column align="center" width="80px">
                <SortHeader label="شناسه" column="id" sort={sort} onToggle={toggleSort} />
              </Table.Column>
              <Table.Column align="right">
                <SortHeader label="نام منطقه" column="name" sort={sort} onToggle={toggleSort} />
              </Table.Column>
              <Table.Column align="right" width="140px">شهر</Table.Column>
              <Table.Column align="center" width="120px">عملیات</Table.Column>
            </Table.Header>

            <Table.Body emptyState={<Table.EmptyState icon={MapPin} title="منطقه‌ای یافت نشد" description="با فیلترهای دیگر امتحان کنید" />}>
              {displayItems.map((d) => (
                <Table.Row key={d.id} selected={isSelected(d.id)}>
                  <Table.Cell>
                    <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary cursor-pointer" checked={isSelected(d.id)} onChange={() => toggle(d.id)} />
                  </Table.Cell>
                  <Table.Cell align="center"><span className="text-sm font-mono text-muted">{d.id}</span></Table.Cell>
                  <Table.Cell align="right"><span className="text-sm font-medium">{d.name}</span></Table.Cell>
                  <Table.Cell align="right"><span className="text-sm">{cityMap[d.city] || "—"}</span></Table.Cell>
                  <Table.Cell align="center">
                    <TableActions onView={() => {}} onEdit={() => {}} onDelete={() => setPendingDeleteId(d.id)} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <TablePagination page={displayPage} totalPages={totalPages} onChange={setPage} />
      </div>

      <ConfirmModal
        isOpen={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={() => setPendingDeleteId(null)}
        title="حذف منطقه"
        message="آیا از حذف این منطقه اطمینان دارید؟"
        confirmText="حذف"
        cancelText="انصراف"
        variant="danger"
      />
    </MotionDiv>
  );
}