import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { buildStatusConfig } from "@/constants/status.utils";
import { formatDate } from "@/utils/formatters";
import { getValue } from "./utils/getValue";
import { STATUS_CONFIG_MAP } from "./status/statusConfigMap";

/* ─── Simple List Table for Tab Content ─── */
export function DetailListTable({
  data,
  columns,
  emptyText = "موردی یافت نشد",
}) {
  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-(--role-subtle) border-b border-(--role-border)">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-right text-xs font-medium text-muted-foreground whitespace-nowrap"
                >
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
                  else if (col.type === "mono")
                    content = (
                      <span className="text-xs font-mono text-muted-foreground">
                        {val}
                      </span>
                    );
                  else if (col.type === "status" && col.configKey) {
                    const cfg = STATUS_CONFIG_MAP[col.configKey];
                    content = cfg ? (
                      <StatusBadge
                        config={buildStatusConfig(cfg, val)}
                        size="sm"
                        variant="soft"
                      />
                    ) : (
                      (val ?? "—")
                    );
                  } else if (col.type === "nested" && col.nestedKey) {
                    content = getValue(val, col.nestedKey) || "—";
                  } else if (col.type === "user") {
                    content = val?.full_name || "—";
                  } else if (col.type === "json_badge") {
                    const arr = Array.isArray(val)
                      ? val
                      : typeof val === "object"
                        ? Object.keys(val)
                        : [val];
                    content = (
                      <div className="flex flex-wrap gap-1">
                        {arr.map((item, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-secondary px-1.5 py-0.5 rounded"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    );
                  } else if (col.format && typeof col.format === "function") {
                    content = col.format(val);
                  }
                  return (
                    <td
                      key={col.key}
                      className="px-3 py-2 text-xs text-foreground whitespace-nowrap"
                    >
                      {content || "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
