// src/features/dashboard/components/widgets/RecentPropertiesWidget.jsx
import { Home, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/Button";
import { formatDate } from "@/utils/formatters";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { buildStatusConfig } from "@/constants/status.utils";
import { PROPERTY_STATUS_CONFIG } from "@/features/properties/config";

/**
 * items از GET /api/dashboard/ → recent_properties
 * { id, title, property_code, status, created_at }
 */
export default function RecentPropertiesWidget({
  items = [],
  loading = false,
  title = "آخرین املاک",
}) {
  const navigate = useNavigate();
  const list = Array.isArray(items) ? items : [];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 md:p-5 h-full flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Home className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/owner/properties")}
        >
          همه
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-muted/30 animate-pulse"
            />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
          <Inbox className="w-10 h-10 text-muted/40 mb-2" />
          <p className="text-sm text-muted">ملکی برای نمایش نیست</p>
        </div>
      ) : (
        <ul className="space-y-2 flex-1">
          {list.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5 hover:bg-accent/40 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.title || "—"}
                </p>
                <p className="text-xs text-muted font-mono mt-0.5">
                  {item.property_code || `#${item.id}`}
                  {item.created_at
                    ? ` · ${formatDate(item.created_at, "short")}`
                    : ""}
                </p>
              </div>
              {item.status && (
                <StatusBadge
                  config={buildStatusConfig(PROPERTY_STATUS_CONFIG, item.status)}
                  size="sm"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}