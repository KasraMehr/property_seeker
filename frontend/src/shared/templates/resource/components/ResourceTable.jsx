import Table from "@/shared/table/Table";
import TableActions from "@/shared/table/TableActions";

/**
 * ResourceTable — config-driven wrapper over Table.jsx
 *
 * Transforms column config + row action config into Table props.
 * No internal state. Fully controlled.
 */
export default function ResourceTable({
  columns = [],
  data = [],
  loading = false,
  emptyState,
  sort,
  onSort,
  selectable = false,
  selected = [],
  onSelectionChange,
  rowActions = [],
  onRowAction,
  rowKey = "id",
  className = "",
}) {
  const hasActions = rowActions.length > 0;

  const actionsRenderer = hasActions
    ? (row) => (
        <TableActions
          actions={rowActions
            .filter((action) => !action.visible || action.visible(row))
            .map((action) => ({
              label: action.label,
              icon: action.icon,
              variant: action.variant,
              onClick: () => onRowAction?.(action.key, row),
            }))}
        />
      )
    : undefined;

  return (
    <div
      className={`flex-1 min-h-0 overflow-auto rounded-xl border border-border bg-surface ${className}`}
    >
      <Table
        data={data}
        columns={columns}
        loading={loading}
        selectable={selectable}
        selected={selected}
        onSelectionChange={onSelectionChange}
        sortKey={sort?.key ?? null}
        sortDir={sort?.dir ?? "asc"}
        onSort={onSort}
        actions={actionsRenderer}
        emptyState={emptyState}
      />
    </div>
  );
}
