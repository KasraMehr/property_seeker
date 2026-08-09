import { useMemo } from "react";
import { Link2, ExternalLink, CheckCircle2, XCircle, User, Building2 } from "lucide-react";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import RoleBadge from "@/shared/ui/badges/RoleBadge";
import { formatPrice, formatDate } from "@/utils/formatters";
import {
  LISTING_STATUS_CONFIG,
  LISTING_REVIEW_STATUS_CONFIG,
} from "@/features/listings/config";
import {
  PROPERTY_STATUS_CONFIG,
  PROPERTY_DEAL_TYPE_CONFIG,
} from "@/features/properties/config";
import { CALL_TYPE_CONFIG, CALL_RESULT_CONFIG } from "@/features/calls/config";
import { FOLLOWUP_TYPE_CONFIG, FOLLOWUP_STATUS_CONFIG } from "@/features/followups/config";
import {
  INGESTION_RUN_STATUS_CONFIG,
  INGESTION_RUN_MODE_CONFIG,
  INGESTION_RUN_ITEM_STATUS_CONFIG,
  SCRAPE_TARGET_STATUS_CONFIG,
} from "@/features/scraper-management/config";
import {
  ACTIVITY_LOG_ALL_ACTIONS,
  ACTIVITY_LOG_SOURCE_CONFIG,
  ACTIVITY_LOG_LEVEL_CONFIG,
  ACTIVITY_LOG_OUTCOME_CONFIG,
} from "@/features/activity-log/config";

/* ─── Status Config Map ───
 * NOTE: mediaType intentionally omitted — no `features/media` config exists
 * yet on the frontend. Add it here once that feature is built. */
const STATUS_CONFIG_MAP = {
  listingStatus: LISTING_STATUS_CONFIG,
  listingReviewStatus: LISTING_REVIEW_STATUS_CONFIG,
  propertyStatus: PROPERTY_STATUS_CONFIG,
  propertyDealType: PROPERTY_DEAL_TYPE_CONFIG,
  callType: CALL_TYPE_CONFIG,
  callResult: CALL_RESULT_CONFIG,
  followupType: FOLLOWUP_TYPE_CONFIG,
  followupStatus: FOLLOWUP_STATUS_CONFIG,
  ingestionRunStatus: INGESTION_RUN_STATUS_CONFIG,
  ingestionRunMode: INGESTION_RUN_MODE_CONFIG,
  ingestionRunItemStatus: INGESTION_RUN_ITEM_STATUS_CONFIG,
  scrapeTargetStatus: SCRAPE_TARGET_STATUS_CONFIG,
  activityLogAction: ACTIVITY_LOG_ALL_ACTIONS,
  activityLogSource: ACTIVITY_LOG_SOURCE_CONFIG,
  activityLogLevel: ACTIVITY_LOG_LEVEL_CONFIG,
  activityLogOutcome: ACTIVITY_LOG_OUTCOME_CONFIG,
};

/* ─── Get nested value ─── */
function getValue(obj, keyPath) {
  if (!obj) return null;
  const keys = keyPath.split(".");
  let val = obj;
  for (const k of keys) {
    if (val == null) return null;
    val = val[k];
  }
  return val;
}

/* ─── Format value by type ─── */
export function formatFieldValue(value, field, data) {
  if (value === null || value === undefined || value === "") return null;

  switch (field.type) {
    case "price":
      return formatPrice(value);
    case "date":
      return formatDate(value, "short");
    case "dateTime":
      return formatDate(value, "long");
    case "phone":
      return <span className="font-mono ltr">{value}</span>;
    case "user": {
      const userName = value?.full_name || value?.name || "—";
      return (
        <span className="inline-flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
          {userName}
        </span>
      );
    }
    case "nested": {
      const nestedVal = field.dataKey ? getValue(data, field.dataKey) : value;
      const display = field.nestedKey ? getValue(nestedVal, field.nestedKey) : nestedVal;
      return display || "—";
    }
    case "status": {
      const cfg = STATUS_CONFIG_MAP[field.configKey];
      if (!cfg || !cfg[value]) return String(value);
      return <StatusBadge status={value} config={cfg} size="sm" variant="soft" />;
    }
    case "boolean": {
      const isTrue = value === true || value === "true";
      return isTrue ? (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" /> {field.trueLabel || "بله"}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <XCircle className="w-3.5 h-3.5" /> {field.falseLabel || "خیر"}
        </span>
      );
    }
    case "link": {
      const linkText = field.displayKey ? getValue(value, field.displayKey) : (typeof value === "string" ? value : "لینک");
      const href = typeof value === "string" ? value : (value?.url || "#");
      return (
        <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
          <ExternalLink className="w-3 h-3" /> {linkText}
        </a>
      );
    }
    case "mono":
      return <span className="text-xs font-mono text-muted-foreground">{String(value)}</span>;
    case "json":
      return (
        <pre className="text-[10px] font-mono bg-muted p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    case "json_badge": {
      const arr = Array.isArray(value) ? value : (typeof value === "object" ? Object.keys(value) : [value]);
      return (
        <div className="flex flex-wrap gap-1">
          {arr.map((item, i) => (
            <span key={i} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded">{item}</span>
          ))}
        </div>
      );
    }
    case "duration": {
      const mins = Math.floor(value / 60);
      const secs = value % 60;
      return <span>{mins > 0 ? `${mins}m ` : ""}{secs}s</span>;
    }
    case "role_list": {
      const roles = Array.isArray(value) ? value : [value];
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((r, i) => (
            <RoleBadge key={i} role={r?.name || r} size="sm" />
          ))}
        </div>
      );
    }
    case "tag_list": {
      const tags = Array.isArray(value) ? value : [value];
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((t, i) => (
            <span key={i} className="text-xs bg-secondary px-2 py-0.5 rounded">{t?.name || t}</span>
          ))}
        </div>
      );
    }
    case "text_truncate":
      return <span className="text-xs text-muted-foreground truncate max-w-50" title={String(value)}>{String(value)}</span>;
    case "code":
      return <pre className="text-[10px] font-mono bg-muted p-2 rounded overflow-auto max-h-60">{String(value)}</pre>;
    case "action":
      return null; // handled separately
    default:
      if (field.format && typeof field.format === "function") {
        return field.format(value);
      }
      return String(value);
  }
}

/* ─── Field Grid Component ─── */
export function DetailFieldGrid({ data, sections, emptyText = "اطلاعاتی موجود نیست" }) {
  if (!data) {
    return <div className="py-12 text-center text-sm text-muted-foreground">{emptyText}</div>;
  }

  return (
    <div className="space-y-6 pr-1" dir="rtl">
      {sections.map((section) => {
        const visibleFields = section.fields.filter((f) => {
          if (f.condition && typeof f.condition === "function") {
            return f.condition(data);
          }
          const val = f.dataKey ? getValue(data, f.dataKey) : getValue(data, f.key);
          return val !== null && val !== undefined && val !== "";
        });

        if (visibleFields.length === 0) return null;

        return (
          <div key={section.section}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 border-b border-border pb-1">
              {section.sectionLabel}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visibleFields.map((field) => {
                const rawValue = field.dataKey ? getValue(data, field.dataKey) : getValue(data, field.key);
                const displayValue = formatFieldValue(rawValue, field, data);
                if (displayValue === null) return null;

                return (
                  <div
                    key={field.key}
                    className={`flex items-start gap-2 p-2.5 rounded-lg bg-surface border border-border ${field.fullWidth ? "sm:col-span-2" : ""}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{field.label}</p>
                      <div className="text-sm text-foreground font-medium wrap-break-word mt-0.5">
                        {displayValue}
                        {field.suffix && !field.type && <span className="text-xs text-muted-foreground mr-1">{field.suffix}</span>}
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

/* ─── Simple List Table for Tab Content ─── */
export function DetailListTable({ data, columns, emptyText = "موردی یافت نشد" }) {
  if (!data || data.length === 0) {
    return <div className="py-12 text-center text-sm text-muted-foreground">{emptyText}</div>;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-3 py-2 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-muted/50 transition-colors">
                {columns.map((col) => {
                  const val = getValue(row, col.key);
                  let content = val;
                  if (col.type === "date") content = formatDate(val, "short");
                  else if (col.type === "mono") content = <span className="text-xs font-mono text-muted-foreground">{val}</span>;
                  else if (col.type === "status" && col.configKey) {
                    const cfg = STATUS_CONFIG_MAP[col.configKey];
                    content = cfg && cfg[val] ? <StatusBadge status={val} config={cfg} size="sm" variant="soft" /> : val;
                  } else if (col.type === "nested" && col.nestedKey) {
                    content = getValue(val, col.nestedKey) || "—";
                  } else if (col.type === "user") {
                    content = val?.full_name || "—";
                  } else if (col.type === "json_badge") {
                    const arr = Array.isArray(val) ? val : (typeof val === "object" ? Object.keys(val) : [val]);
                    content = (
                      <div className="flex flex-wrap gap-1">
                        {arr.map((item, i) => (
                          <span key={i} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded">{item}</span>
                        ))}
                      </div>
                    );
                  } else if (col.format && typeof col.format === "function") {
                    content = col.format(val);
                  }
                  return <td key={col.key} className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{content || "—"}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}