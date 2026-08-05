import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Loader2 } from "lucide-react";

export default function Table({
  data = [],
  columns = [],
  loading = false,
  selectable = false,
  actions,
  emptyState,
  onSelectionChange,
  className = "",
}) {
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState({ key: null, dir: "asc" });

  const sortedData = useMemo(() => {
    if (!sort.key) return data;

    return [...data].sort((a, b) => {
      const av = a[sort.key] ?? "";
      const bv = b[sort.key] ?? "";

      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sort]);

  const toggleSort = (key) => {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const toggle = (id) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];

    setSelected(next);
    onSelectionChange?.(next);
  };

  const toggleAll = () => {
    const ids = data.map((x) => x.id);

    const next = selected.length === ids.length ? [] : ids;

    setSelected(next);
    onSelectionChange?.(next);
  };

  const allSelected =
    data.length > 0 && data.every((x) => selected.includes(x.id));

  return (
    <div
      className={`bg-surface rounded-2xl border border-border shadow-sm overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-160">
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
                const active = sort.key === col.key;

                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && toggleSort(col.key)}
                    className={`
                      p-3 text-xs font-semibold text-muted whitespace-nowrap
                      ${col.align === "center" ? "text-center" : "text-right"}
                      ${col.sortable ? "cursor-pointer hover:text-foreground" : ""}
                    `}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.title}

                      {col.sortable &&
                        (active ? (
                          sort.dir === "asc" ? (
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
                <td colSpan="100">
                  <div className="flex justify-center py-12">
                    <Loader2
                      className="animate-spin text-(--role-primary)"
                      size={24}
                    />
                  </div>
                </td>
              </tr>
            )}

            {!loading && sortedData.length === 0 && (
              <tr>
                <td colSpan="100">{emptyState}</td>
              </tr>
            )}

            {!loading &&
              sortedData.map((row) => (
                <tr
                  key={row.id}
                  className={`
                  transition-colors
                  ${
                    selected.includes(row.id)
                      ? "bg-(--role-primary)/5"
                      : "hover:bg-(--role-subtle)/20"
                  }
                `}
                >
                  {selectable && (
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={() => toggle(row.id)}
                        className="w-4 h-4 rounded border-border accent-primary"
                      />
                    </td>
                  )}

                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`
                      p-3 text-sm text-foreground whitespace-nowrap
                      ${col.align === "center" ? "text-center" : "text-right"}
                    `}
                    >
                      {col.render ? col.render(row) : row[col.key]}
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
