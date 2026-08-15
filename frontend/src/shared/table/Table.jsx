import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Loader2 } from "lucide-react";

import Checkbox from "@/shared/ui/Checkbox";

export default function Table({
  data = [],
  columns = [],
  loading = false,
  selectable = false,
  selected = [],
  onSelectionChange,
  sortKey = null,
  sortDir = "asc",
  onSort,
  actions,
  emptyState,
  rowKey = "id",
}) {
  const allSelected =
    data.length > 0 && data.every((r) => selected.includes(r[rowKey]));
  const someSelected =
    data.some((r) => selected.includes(r[rowKey])) && !allSelected;

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((r) => r[rowKey]));
    }
  };

  const toggleRow = (id) => {
    if (!onSelectionChange) return;
    if (selected.includes(id)) {
      onSelectionChange(selected.filter((s) => s !== id));
    } else {
      onSelectionChange([...selected, id]);
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey || !onSort) return data;
    return [...data];
  }, [data, sortKey, onSort]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted" />
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      emptyState || (
        <div className="py-12 text-center text-sm text-muted">
          موردی یافت نشد
        </div>
      )
    );
  }

  return (
    <div className=" h-full min-x-max">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-surface">
          <tr className="border-b border-border bg-surface">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`
    px-3 py-3 text-right text-xs font-semibold text-muted-foreground
    uppercase tracking-wide whitespace-nowrap select-none
    ${onSort && col.sortable !== false ? "cursor-pointer hover:text-foreground" : ""}
  `}
                style={{
                  width: col.width,
                  minWidth: col.minWidth,
                }}
                onClick={() => {
                  if (onSort && col.sortable !== false) onSort(col.key);
                }}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {sortKey === col.key && (
                    <span className="text-[10px]">
                      {sortDir === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {actions && <th className="w-20 px-3 py-3 text-right">عملیات</th>}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {sortedData.map((row) => (
            <tr
              key={row[rowKey]}
              className="hover:bg-muted/40 transition-colors group"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="
    px-3 py-2.5 text-foreground align-middle
    whitespace-nowrap
  "
                  style={{
                    width: col.width,
                    minWidth: col.minWidth,
                  }}
                  title={
                    typeof row[col.key] === "string" ? row[col.key] : undefined
                  }
                >
                  {col.cell ? col.cell(row) : (row[col.key] ?? "—")}
                </td>
              ))}
              {actions && (
                <td className="w-20 px-3 py-2.5 text-right">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {loading && (
        <div className="absolute inset-0 bg-surface/50 backdrop-blur-[1px] flex items-center justify-center z-20 rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-7 h-7 animate-spin text-(--role-primary)" />
            <span className="text-xs text-muted">در حال بروزرسانی...</span>
          </div>
        </div>
      )}
    </div>
  );
}
