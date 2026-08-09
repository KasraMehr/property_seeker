import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Loader2 } from "lucide-react";

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
  className = "",
}) {
  const hasFixedWidth = columns.some((c) => c.width);
  const minWidth = columns.reduce(
    (sum, col) => sum + (parseInt(col.width) || 100),
    0,
  );
  const allSelected =
    data.length > 0 && data.every((row) => selected.includes(row.id));

  const toggleAll = () => {
    const ids = data.map((r) => r.id);
    const next = allSelected ? [] : ids;
    onSelectionChange?.(next);
  };

  const toggleRow = (id) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    onSelectionChange?.(next);
  };

  return (
    <div
      className={`bg-surface rounded-2xl border border-border shadow-sm h-full flex flex-col ${className}`}
    >
      <div className="overflow-auto flex-1">
        <table
          className={`text-sm ${hasFixedWidth ? "table-fixed" : "min-w-160 w-full"}`}
          style={
            hasFixedWidth
              ? { minWidth: `${minWidth}px`, width: `${minWidth}px` }
              : {}
          }
        >
          <thead>
            <tr className="border-b border-border bg-background/50">
              {selectable && (
                <th className="p-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-border accent-primary"
                  />
                </th>
              )}
              {columns.map((col) => {
                const active = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && onSort?.(col.key)}
                    className={`
                      p-3 text-xs font-semibold text-muted whitespace-nowrap
                      ${col.align === "center" ? "text-center" : "text-right"}
                      ${col.sortable ? "cursor-pointer hover:text-foreground" : ""}
                    `}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.title || col.header || col.label}
                      {col.sortable &&
                        (active ? (
                          sortDir === "asc" ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronUp size={14} />
                          )
                        ) : (
                          <ChevronsUpDown size={14} className="opacity-40" />
                        ))}
                    </span>
                  </th>
                );
              })}
              {actions && (
                <th className="p-3 text-center text-xs text-muted">عملیات</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {loading && (
              <tr>
                <td colSpan={100}>
                  <div className="flex justify-center py-12">
                    <Loader2
                      className="animate-spin text-(--role-primary)"
                      size={24}
                    />
                  </div>
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={100}>
                  {emptyState || (
                    <div className="py-12 text-center text-sm text-muted">
                      داده‌ای یافت نشد
                    </div>
                  )}
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row) => (
                <tr
                  key={row.id}
                  className={`
                    transition-colors
                    ${selected.includes(row.id) ? "bg-(--role-primary)/5" : "hover:bg-(--role-subtle)/20"}
                  `}
                >
                  {selectable && (
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                        className="w-4 h-4 rounded border-border accent-primary"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`
                        p-3 text-sm text-foreground
                        ${col.align === "center" ? "text-center" : "text-right"}
                      `}
                    >
                      {col.cell
                        ? col.cell(row)
                        : col.render
                          ? col.render(row)
                          : row[col.key]}{" "}
                    </td>
                  ))}
                  {actions && (
                    <td className="p-3 text-center">{actions(row)}</td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
