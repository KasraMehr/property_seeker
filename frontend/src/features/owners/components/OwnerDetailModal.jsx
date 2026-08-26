import { useState, useMemo, useEffect } from "react";
import { User } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import {
  OWNER_DETAIL_FIELDS,
  OWNER_PROPERTY_COLUMNS,
} from "@/features/owners/config";
import { DetailFieldGrid, DetailListTable } from "@/shared/page/DetailContentRenderer";

const OWNER_DETAIL_TABS = [
  { key: "details", label: "اطلاعات" },
  { key: "properties", label: "املاک" },
];

export default function OwnerDetailModal({ isOpen, onClose, owner, loading = false, usersMap, onEdit }) {
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (isOpen) setActiveTab("details");
  }, [isOpen, owner?.id]);

  /* ─── Resolve created_by ID → name ─── */
  const resolvedOwner = useMemo(() => {
    if (!owner) return null;
    if (!usersMap || !Object.keys(usersMap).length) return owner;
    return {
      ...owner,
      created_by: usersMap[owner.created_by] || owner.created_by,
    };
  }, [owner, usersMap]);

  if (!isOpen || !owner) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="جزئیات مالک" className="h-[85vh]">
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground truncate">
            {owner.full_name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted">{owner.phone}</span>
            {owner.properties_count != null && (
              <span className="text-xs text-muted">
                — {owner.properties_count} ملک
              </span>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <p className="text-xs text-muted mb-2">در حال بارگذاری جزئیات...</p>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        variant="underline"
        className="flex-1 min-h-0 flex flex-col"
      >
        <Tabs.List className="mb-2 shrink-0">
          {OWNER_DETAIL_TABS.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <Tabs.Content value="details">
            <DetailFieldGrid data={resolvedOwner} sections={OWNER_DETAIL_FIELDS} />
          </Tabs.Content>

          <Tabs.Content value="properties">
            <DetailListTable
              data={owner.properties || []}
              columns={OWNER_PROPERTY_COLUMNS}
              emptyText="هنوز ملکی ثبت نشده"
            />
          </Tabs.Content>
        </div>
      </Tabs>

      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>
          بستن
        </Button>
        {onEdit && (
          <Button variant="primary" size="sm" onClick={() => onEdit(owner)}>
            ویرایش
          </Button>
        )}
      </div>
    </Modal>
  );
}
