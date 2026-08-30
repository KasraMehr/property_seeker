import { useState, useMemo, useEffect } from "react";
import { ClipboardList, CheckCircle2, Clock } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import useAuth from "@/features/auth/hooks/useAuth";
import {
  FOLLOWUP_TYPE_CONFIG,
  FOLLOWUP_STATUS_CONFIG,
  FOLLOWUP_DETAIL_TABS,
  FOLLOWUP_DETAIL_FIELDS,
} from "@/features/followups/config";
import { DetailFieldGrid } from "@/shared/page/DetailContentRenderer";

export default function FollowupDetailModal({
  isOpen,
  onClose,
  followup,
  onMarkDone, // اختیاری: اگر از بیرون بخوای mark done کنی
}) {
  const [activeTab, setActiveTab] = useState("details");

  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_owner);

  /* ─── Filter fields for non-owners ─── */
  const detailFields = useMemo(() => {
    if (isAdmin) return FOLLOWUP_DETAIL_FIELDS;
    return FOLLOWUP_DETAIL_FIELDS.map((section) => ({
      ...section,
      fields: section.fields.filter((f) => f.key !== "user_name"),
    })).filter((section) => section.fields.length > 0);
  }, [isAdmin]);

  // همیشه قبل از هر early return باید hookها صدا زده بشن
  const availableTabs = useMemo(() => {
    if (!followup) return [];
    return FOLLOWUP_DETAIL_TABS.filter((tab) => {
      if (tab.condition && typeof tab.condition === "function") {
        return tab.condition(followup);
      }
      return true;
    });
  }, [followup]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("details");
    }
  }, [isOpen, followup?.id]);

  if (!followup) return null;

  const isOverdue =
    followup.status === "pending" &&
    followup.due_at &&
    new Date(followup.due_at) < new Date();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="جزئیات پیگیری"
      className="h-[75vh]"
    >
      {/* ─── Header ─── */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isOverdue ? "bg-danger/10" : "bg-amber-500/10"
          }`}
        >
          {isOverdue ? (
            <Clock className="w-5 h-5 text-danger" />
          ) : (
            <ClipboardList className="w-5 h-5 text-amber-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground truncate">
            {followup.title || "—"}
          </h3>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <StatusBadge
              status={followup.type}
              config={FOLLOWUP_TYPE_CONFIG}
              size="sm"
              variant="soft"
            />
            <StatusBadge
              status={followup.status}
              config={FOLLOWUP_STATUS_CONFIG}
              size="sm"
              variant="soft"
            />
            {isOverdue && (
              <span className="text-xs text-danger font-medium">
                (موعد گذشته)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        variant="underline"
        className="flex-1 min-h-0 flex flex-col"
      >
        <Tabs.List className="mb-2 shrink-0">
          {availableTabs.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key} icon={tab.icon}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <Tabs.Content value="details">
            <DetailFieldGrid
              data={followup}
              sections={detailFields}
            />
          </Tabs.Content>

        </div>
      </Tabs>

      {/* ─── Footer ─── */}
      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>
          بستن
        </Button>

        {followup.status === "pending" && onMarkDone && (
          <Button
            variant="primary"
            size="sm"
            className="gap-1.5"
            onClick={() => onMarkDone(followup)}
          >
            <CheckCircle2 size={14} />
            انجام شد
          </Button>
        )}
      </div>
    </Modal>
  );
}