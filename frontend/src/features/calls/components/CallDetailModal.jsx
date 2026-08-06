import { useState, useMemo } from "react";
import {
  Phone,
  User,
  Mic,
  Play,
  Download,
  Inbox,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Hash,
  Home,
  FileText,
  Building,
  StickyNote,
} from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { formatDateTime } from "@/utils/formatters";
import { CALL_RESULT_CONFIG, CALL_TYPE_CONFIG } from "@/features/calls/config";
import {
  CALL_DETAIL_TABS,
  CALL_DETAIL_FIELDS,
  CALL_RELATED_FIELDS,
  CALL_ICON_MAP,
} from "@/features/calls/config";

/* ─── Helpers ─── */
function getFieldValue(obj, field) {
  if (!obj) return null;
  const raw = obj[field.key];
  if (raw === null || raw === undefined || raw === "") return null;

  switch (field.type) {
    case "duration": {
      if (!raw && raw !== 0) return null;
      const m = Math.floor(raw / 60);
      const s = raw % 60;
      return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    case "date":
      return formatDateTime(raw, { time: false });
    case "dateTime":
      return formatDateTime(raw);
    case "user":
      return typeof raw === "object"
        ? raw.full_name || raw.name || "—"
        : String(raw);
    case "nested":
      return raw?.[field.nestedKey] || "—";
    case "callType": {
      const cfg = CALL_TYPE_CONFIG[raw];
      return cfg || raw;
    }
    case "result": {
      const cfg = CALL_RESULT_CONFIG[raw];
      return cfg || raw;
    }
    case "boolean":
      return raw ? "انجام شده" : "در انتظار";
    default:
      return field.format ? field.format(raw) : String(raw);
  }
}

function FieldIcon({ fieldKey, className = "text-muted mt-0.5 shrink-0" }) {
  const Icon = CALL_ICON_MAP[fieldKey] || StickyNote;
  return <Icon size={16} className={className} />;
}

/* ─── Field Grid ─── */
function FieldGrid({ data, sections, emptyText = "اطلاعاتی موجود نیست" }) {
  if (!data)
    return (
      <div className="py-12 text-center text-sm text-muted">{emptyText}</div>
    );

  return (
    <div className="space-y-6 pr-1" dir="rtl">
      {sections.map((section) => {
        const visible = section.fields.filter((f) => {
          const val = getFieldValue(data, f);
          return val !== null && val !== undefined && val !== "—";
        });
        if (visible.length === 0) return null;

        return (
          <div key={section.section}>
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 border-b border-border pb-1">
              {section.sectionLabel}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visible.map((field) => {
                const value = getFieldValue(data, field);
                const isResult =
                  field.type === "result" && typeof value === "object";
                const isCallType =
                  field.type === "callType" && typeof value === "object";

                return (
                  <div
                    key={field.key}
                    className={`flex items-start gap-2 p-2.5 rounded-lg bg-surface border border-border ${
                      field.fullWidth ? "sm:col-span-2" : ""
                    }`}
                  >
                    <FieldIcon fieldKey={field.key} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-muted uppercase tracking-wide">
                        {field.label}
                      </p>
                      <div className="text-sm text-foreground font-medium wrap-break-word">
                        {isResult || isCallType ? (
                          <StatusBadge
                            config={value}
                            variant="soft"
                            size="sm"
                          />
                        ) : field.type === "boolean" ? (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-md ${
                              value === "انجام شده"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-amber-500/10 text-amber-500"
                            }`}
                          >
                            {value}
                          </span>
                        ) : (
                          value
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Record Player Tab ─── */
function RecordTab({ recordFile, callId }) {
  if (!recordFile) {
    return (
      <div className="py-12 text-center space-y-3">
        <Mic size={48} className="mx-auto text-muted/40" />
        <p className="text-sm text-muted">فایل صوتی ثبت نشده است</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pr-1" dir="rtl">
      <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Play size={18} className="text-primary mr-0.5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              ضبط تماس #{callId}
            </p>
            <p className="text-xs text-muted">فرمت: MP3</p>
          </div>
          <Button variant="outline" size="sm" as="a" href={recordFile} download>
            <Download size={14} className="ml-1" />
            دانلود
          </Button>
        </div>
        <audio controls className="w-full" src={recordFile}>
          مرورگر شما از پخش صوت پشتیبانی نمی‌کند.
        </audio>
      </div>
    </div>
  );
}

/* ─── Main Modal ─── */
export default function CallDetailModal({ isOpen, onClose, call }) {
  const [activeTab, setActiveTab] = useState("call");
  if (!call) return null;

  useMemo(() => {
    if (isOpen) setActiveTab("call");
  }, [isOpen, call.id]);

  return (
    <Modal
      className="h-[85vh]"
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="جزئیات تماس"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            CALL_TYPE_CONFIG[call.call_type]?.bg || "bg-muted/10"
          }`}
        >
          {(() => {
            const Icon = CALL_TYPE_CONFIG[call.call_type]?.icon || Phone;
            return (
              <Icon
                size={22}
                className={
                  CALL_TYPE_CONFIG[call.call_type]?.text || "text-muted"
                }
              />
            );
          })()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground">
            تماس {CALL_TYPE_CONFIG[call.call_type]?.label || call.call_type}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs font-mono text-muted dir-ltr">
              #{call.id}
            </span>
            {call.result && CALL_RESULT_CONFIG[call.result] && (
              <StatusBadge
                config={CALL_RESULT_CONFIG[call.result]}
                variant="soft"
                size="sm"
              />
            )}
            {call.call_duration > 0 && (
              <span className="text-xs font-mono text-muted">
                {(() => {
                  const m = Math.floor(call.call_duration / 60);
                  const s = call.call_duration % 60;
                  return `${m}:${s.toString().padStart(2, "0")}`;
                })()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        className="flex-1 min-h-0 flex flex-col"
        value={activeTab}
        onValueChange={setActiveTab}
        variant="underline"
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
            <FieldGrid data={call} sections={CALL_DETAIL_FIELDS} />
          </Tabs.Content>

          <Tabs.Content value="related">
            <FieldGrid
              data={call}
              sections={CALL_RELATED_FIELDS}
              emptyText="اطلاعات مرتبط یافت نشد"
            />
          </Tabs.Content>

          <Tabs.Content value="record">
            <RecordTab recordFile={call.record_file} callId={call.id} />
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
