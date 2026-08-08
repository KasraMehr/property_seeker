import { useMemo, useState, useCallback, useEffect } from "react";
import { Plus, Eye, Inbox, MapPin } from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import PageTabs from "@/shared/page/PageTabs";
import useRegion from "@/features/regions-management/hooks/useRegion";
import {
  REGION_FILTERS,
  REGION_TABLE_COLUMNS,
} from "@/features/regions-management/config";
import useDebounce from "@/shared/useDebounce";
import Button from "@/shared/ui/Button";
import RegionDetailModal from "@/features/regions-management/components/RegionDetailModal";

/* ─── City Tabs ─── */
const CITY_TABS = [
  { id: "all", label: "همه مناطق" },
  { id: "1", label: "کرج" },
  { id: "2", label: "ماهدشت" },
  { id: "3", label: "تهران" },
];

const REGION_ROW_ACTIONS = {
  admin: [{ key: "view", label: "مشاهده", icon: Eye }],
  operator: [{ key: "view", label: "مشاهده", icon: Eye }],
};

export default function RegionsPage() {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_owner);
  const role = isAdmin ? "admin" : "operator";

  const {
    data,
    loading,
    meta,
    filters: filterValues,
    setFilter,
    clearFilter,
    clearAll,
    activeChips,
    sort,
    setOrdering,
    page,
    setPage,
    totalPages,
    fetchList,
  } = useRegion();

  const [selected, setSelected] = useState([]);
  const [detailRegion, setDetailRegion] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  /* ─── Tab Change → Server-side filter ─── */
  const handleTabChange = useCallback(
    (tabId) => {
      setActiveTab(tabId);
      if (tabId === "all") {
        clearFilter("city");
      } else {
        setFilter("city", tabId);
      }
      setPage(1);
    },
    [setFilter, clearFilter, setPage],
  );

  /* ─── Search ─── */
  const [searchInput, setSearchInput] = useState(filterValues.search || "");
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (filterValues.search !== searchInput)
      setSearchInput(filterValues.search || "");
  }, [filterValues.search]);

  useEffect(() => {
    if (debouncedSearch !== filterValues.search)
      setFilter("search", debouncedSearch);
  }, [debouncedSearch, filterValues.search, setFilter]);

  /* ─── Sort ─── */
  const handleSort = useCallback(
    (key) => {
      const dir = sort?.key === key && sort?.dir === "asc" ? "desc" : "asc";
      setOrdering(`${dir === "desc" ? "-" : ""}${key}`);
    },
    [sort, setOrdering],
  );

  /* ─── Row actions ─── */
  const handleRowAction = useCallback(async (actionKey, row) => {
    const action = REGION_ALL_ACTIONS.find((a) => a.key === actionKey);

    if (action?.confirm) {
      setPendingAction({ key: actionKey, row, confirm: action.confirm });
      return;
    }

    switch (actionKey) {
      case "view": {
        const res = await regionService.getById(row.id); 
        setDetailRegion(res.data);
        break;
      }
      case "edit": {
        const res = await regionService.getById(row.id);
        setEditRegion(res.data); 
        break;
      }
      default:
        break;
    }
  }, []);

  /* ─── Tab badge counts (fetch all once for counts) ─── */
  const [allDistricts, setAllDistricts] = useState([]);
  useEffect(() => {
    import("@/features/regions-management/services/locationService")
      .then((mod) => mod.default.getDistricts())
      .then((res) => {
        // Paginated response: { count, next, previous, results: [...] }
        const list = res.data?.results || res.data || [];
        setAllDistricts(list);
      });
  }, []);

  const tabItems = useMemo(() => {
    const counts = {
      all: allDistricts.length,
      1: allDistricts.filter((d) => d.city?.id === 1 || d.city === 1).length,
      2: allDistricts.filter((d) => d.city?.id === 2 || d.city === 2).length,
      3: allDistricts.filter((d) => d.city?.id === 3 || d.city === 3).length,
    };
    return CITY_TABS.map((t) => ({
      ...t,
      badge: counts[t.id] || 0,
    }));
  }, [allDistricts]);

  /* ─── Filter options (hide city from FilterBar, controlled by tabs) ─── */
  const filterOptions = useMemo(() => {
    const listingFilter = REGION_FILTERS.find((f) => f.key === "has_listings");
    return {
      listingStatuses: listingFilter?.options || [],
    };
  }, []);

  const filters = useMemo(
    () => ({
      schema: REGION_FILTERS.filter(
        (f) => f.type !== "search" && f.key !== "city",
      ),
      options: filterOptions,
      values: filterValues,
      onChange: setFilter,
      onClear: clearFilter,
      onClearAll: clearAll,
      activeChips: activeChips.filter((c) => c.key !== "city"), // hide city chip
    }),
    [
      filterOptions,
      filterValues,
      setFilter,
      clearFilter,
      clearAll,
      activeChips,
    ],
  );

  const pagination = useMemo(
    () => ({ page, totalPages: totalPages(meta?.count) }),
    [page, meta?.count, totalPages],
  );

  const searchConfig = useMemo(
    () => ({
      value: searchInput,
      onChange: setSearchInput,
      label: "جستجو",
      placeholder: "نام منطقه، محله...",
    }),
    [searchInput],
  );

  /* ─── Header ─── */
  const customHeader = useMemo(
    () => (
      <div className="space-y-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              مدیریت مناطق
            </h1>
            <p className="text-sm text-muted mt-1">
              {(meta?.count || 0).toLocaleString("fa-IR")} منطقه
              {selected.length > 0 && (
                <span className="mr-2 text-(--role-primary)">
                  ({selected.length.toLocaleString("fa-IR")} انتخاب شده)
                </span>
              )}
            </p>
          </div>
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus size={16} />
            منطقه جدید
          </Button>
        </div>

        <PageTabs
          items={tabItems}
          value={activeTab}
          onChange={handleTabChange}
        />
      </div>
    ),
    [meta?.count, selected.length, tabItems, activeTab],
  );

  /* ─── Empty ─── */
  const emptyState = useMemo(
    () => (
      <div className="py-12 text-center space-y-3">
        <MapPin size={48} className="mx-auto text-muted/40" />
        <div>
          <p className="text-sm font-medium text-foreground">
            منطقه‌ای یافت نشد
          </p>
          <p className="text-xs text-muted mt-1">
            با فیلترهای انتخابی هیچ منطقه‌ای پیدا نشد.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={clearAll}>
          حذف فیلترها
        </Button>
      </div>
    ),
    [clearAll],
  );

  return (
    <>
      <ResourceTemplate
        header={customHeader}
        search={searchConfig}
        filters={filters}
        columns={REGION_TABLE_COLUMNS}
        data={data}
        loading={loading}
        emptyState={emptyState}
        sort={sort}
        onSort={handleSort}
        selectable={true}
        selected={selected}
        onSelectionChange={setSelected}
        rowActions={REGION_ROW_ACTIONS[role]}
        onRowAction={handleRowAction}
        pagination={pagination}
        onPageChange={setPage}
      />

      {detailRegion && (
        <RegionDetailModal
          isOpen={!!detailRegion}
          onClose={() => setDetailRegion(null)}
          region={detailRegion}
          agents={detailRegion._agents || []}
          // fake data
          // stats={{
          //   listings_count: detailRegion.listings_count || 0,
          //   properties_count: detailRegion.properties_count || 0,
          //   calls_count: detailRegion.calls_count || 0,
          //   followups_count: detailRegion.followups_count || 0,
          //   neighborhoods_count: detailRegion.neighborhoods_count || 0,
          //   addresses_count: detailRegion.addresses_count || 0,
          //   agents_count: detailRegion.agents_count || 0,
          // }}
        />
      )}
    </>
  );
}
