import { useCallback, useEffect, useMemo, useState } from "react";
import { Inbox, Plus } from "lucide-react";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import Button from "@/shared/ui/Button";
import useDebounce from "@/shared/useDebounce";
import useLocationLevel from "../hooks/useLocationLevel";
import { LOCATION_LEVELS, LEVEL_FILTER_SCHEMA } from "../config";
import LocationFormModal from "./LocationFormModal";
import LocationDetailModal from "./LocationDetailModal";
import { toastService } from "@/lib/toast";
import locationService from "../services/locationService";

export default function LocationLevelPanel({ levelKey, onRegisterCreate }) {
  const level = LOCATION_LEVELS[levelKey];
  const {
    data,
    loading,
    meta,
    search,
    setSearch,
    parentFilters,
    setParentFilter,
    clearParentFilters,
    remove,
    refresh,
  } = useLocationLevel(levelKey);

  const [selected, setSelected] = useState([]);
  const [formRecord, setFormRecord] = useState(null); // null closed; {} create; row edit
  const [detailRecord, setDetailRecord] = useState(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState(null);

  const [searchInput, setSearchInput] = useState(search || "");
  const debouncedSearch = useDebounce(searchInput, 300);

  // client-side parent filters
  const filterSchema = LEVEL_FILTER_SCHEMA[levelKey] || [];
  const [filterOptions, setFilterOptions] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (levelKey === "city") {
          const res = await locationService.getProvinces();
          const list = locationService.unwrapList(res).map((p) => ({
            value: p.id,
            label: p.name,
            name: p.name,
          }));
          if (!cancelled) setFilterOptions({ provinces: list });
        } else if (levelKey === "district") {
          const res = await locationService.getCities();
          const list = locationService.unwrapList(res).map((c) => ({
            value: c.id,
            label: c.name,
          }));
          if (!cancelled) setFilterOptions({ cities: list });
        } else if (levelKey === "neighborhood") {
          const res = await locationService.getDistricts();
          const list = locationService.unwrapList(res).map((d) => ({
            value: d.id,
            label: d.city_name ? `${d.name} (${d.city_name})` : d.name,
          }));
          if (!cancelled) setFilterOptions({ districts: list });
        } else {
          if (!cancelled) setFilterOptions({});
        }
      } catch {
        if (!cancelled) setFilterOptions({});
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [levelKey]);

  // props for template
  const filtersProp =
    filterSchema.length === 0
      ? null
      : {
          schema: filterSchema,
          options: filterOptions,
          values: parentFilters,
          onChange: (key, value) => {
            if (key === "province") {
              const opt = (filterOptions.provinces || []).find(
                (o) => o.value === value || o.value === Number(value),
              );
              setParentFilter(key, value, { name: opt?.name || opt?.label });
            } else {
              setParentFilter(key, value);
            }
          },
          onClear: (key) => setParentFilter(key, ""),
          onClearAll: clearParentFilters,
        //   activeChips: Object.entries(parentFilters)
        //     .filter(([k, v]) => v && k !== "provinceName")
        //     .map(([key, value]) => {
        //       const field = filterSchema.find((f) => f.key === key);
        //       const opts = filterOptions[field?.optionsKey] || [];
        //       const opt = opts.find(
        //         (o) => o.value === value || o.value === Number(value),
        //       );
        //       return {
        //         key,
        //         label: field?.label || key,
        //         value: opt?.label || String(value),
        //       };
        //     }),
        };

  useEffect(() => {
    setSearchInput(search || "");
  }, [search]);

  useEffect(() => {
    if (debouncedSearch !== search) setSearch(debouncedSearch);
  }, [debouncedSearch, search, setSearch]);

  // expose "create" to page header when this tab is active
  useEffect(() => {
    onRegisterCreate?.(() => setFormRecord({}));
    return () => onRegisterCreate?.(null);
  }, [levelKey, onRegisterCreate]);

  const handleRowAction = useCallback((actionKey, row) => {
    if (actionKey === "view") setDetailRecord(row);
    else if (actionKey === "edit") setFormRecord(row);
    else if (actionKey === "delete") setPendingDeleteIds([row.id]);
  }, []);

  const handleBulkAction = useCallback(
    (actionKey) => {
      if (actionKey === "delete" && selected.length > 0) {
        setPendingDeleteIds([...selected]);
      }
    },
    [selected],
  );

  const confirmDelete = useCallback(async () => {
    if (!pendingDeleteIds?.length) return;
    try {
      await remove(pendingDeleteIds);
      toastService.success(
        pendingDeleteIds.length > 1
          ? `${level.labelPlural} با موفقیت حذف شدند`
          : `${level.label} با موفقیت حذف شد`,
      );
      setPendingDeleteIds(null);
      setSelected([]);
      refresh();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        `حذف ${level.label} ناموفق بود`;
      toastService.error(typeof msg === "string" ? msg : "خطا در حذف");
    }
  }, [pendingDeleteIds, remove, refresh, level]);

  const searchConfig = useMemo(
    () => ({
      value: searchInput,
      onChange: setSearchInput,
      placeholder: `جستجو در ${level.labelPlural}...`,
    }),
    [searchInput, level.labelPlural],
  );

  const emptyState = useMemo(
    () => (
      <div className="py-12 text-center space-y-3">
        <Inbox size={48} className="mx-auto text-muted/40" />
        <p className="text-sm font-medium">{level.label}ی یافت نشد</p>
        <Button variant="outline" size="sm" onClick={() => setFormRecord({})}>
          <Plus size={14} className="ml-1" />
          ثبت {level.label} جدید
        </Button>
      </div>
    ),
    [level.label],
  );

  return (
    <>
      <ResourceTemplate
        search={searchConfig}
        filters={filtersProp}
        count={meta?.count || 0}
        countLabel={level.label}
        columns={level.columns}
        data={data}
        loading={loading}
        emptyState={emptyState}
        selectable
        selected={selected}
        onSelectionChange={setSelected}
        rowActions={level.actions.row}
        bulkActions={level.actions.bulk}
        onRowAction={handleRowAction}
        onBulkAction={handleBulkAction}
      />

      <LocationFormModal
        isOpen={formRecord !== null}
        onClose={() => setFormRecord(null)}
        levelKey={levelKey}
        record={formRecord?.id ? formRecord : null}
        onSuccess={refresh}
      />

      <LocationDetailModal
        isOpen={!!detailRecord}
        onClose={() => setDetailRecord(null)}
        levelKey={levelKey}
        record={detailRecord}
      />

      <ConfirmModal
        isOpen={!!pendingDeleteIds?.length}
        onClose={() => setPendingDeleteIds(null)}
        onConfirm={confirmDelete}
        title={
          level.actions.row.find((a) => a.key === "delete")?.confirm?.title
        }
        message={
          level.actions.row.find((a) => a.key === "delete")?.confirm?.message
        }
        confirmLabel="حذف"
        variant="danger"
      />
    </>
  );
}
