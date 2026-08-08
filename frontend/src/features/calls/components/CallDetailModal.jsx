import { useState, useMemo , useEffect} from "react";
import { Phone, User, Mic } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { CALL_TYPE_CONFIG, CALL_RESULT_CONFIG } from "@/features/calls/config";
import {
  CALL_DETAIL_TABS,
  CALL_DETAIL_FIELDS,
  CALL_RELATED_FIELDS,
} from "@/features/calls/config";
import { DetailFieldGrid } from "@/shared/page/DetailContentRenderer";

export default function CallDetailModal({ isOpen, onClose, call }) {
  const [activeTab, setActiveTab] = useState("call");

  if (!call) return null;

  useEffect(() => {
    if (isOpen) setActiveTab("call");
  }, [isOpen, call?.id]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="جزئیات تماس"
      className="h-[70vh]"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center">
          <Phone className="w-5 h-5 text-sky-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground">
            تماس با {call.customer?.full_name || "—"}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge
              status={call.call_type}
              config={CALL_TYPE_CONFIG}
              size="sm"
              variant="soft"
            />
            <StatusBadge
              status={call.result}
              config={CALL_RESULT_CONFIG}
              size="sm"
              variant="soft"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        variant="underline"
        className="flex-1 min-h-0 flex flex-col"
      >
        <Tabs.List className="mb-2 shrink-0">
          {CALL_DETAIL_TABS.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key} icon={tab.icon}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <Tabs.Content value="call">
            <DetailFieldGrid data={call} sections={CALL_DETAIL_FIELDS} />
          </Tabs.Content>

          <Tabs.Content value="related">
            <DetailFieldGrid data={call} sections={CALL_RELATED_FIELDS} />
          </Tabs.Content>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>
          بستن
        </Button>
      </div>
    </Modal>
  );
}
