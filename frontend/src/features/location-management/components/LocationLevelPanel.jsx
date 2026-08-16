import { useCallback, useEffect, useMemo, useState } from "react";
import { Inbox, Plus } from "lucide-react";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import Button from "@/shared/ui/Button";
import useDebounce from "@/shared/useDebounce";
import useLocationLevel from "../hooks/useLocationLevel";
import { LOCATION_LEVELS } from "../config";
import LocationFormModal from "./LocationFormModal";
import LocationDetailModal from "./LocationDetailModal";
import { toastService } from "@/lib/toast";

export default function LocationLevelPanel({ levelKey, onRegisterCreate }) {
  const level = LOCATION_LEVELS[levelKey];
  const { data, loading, meta, search, setSearch, remove, refresh } =
    useLocationLevel(levelKey);

  const [selected, setSelected] = useState([]);
  const [formRecord, setFormRecord] = useState(null); // null closed; {} create; row edit
  const [detailRecord, setDetailRecord] = useState(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState(null);

  const [searchInput, setSearchInput] = useState(search || "");
  const debouncedSearch = useDebounce(searchInput, 300);

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
        filters={null}
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
