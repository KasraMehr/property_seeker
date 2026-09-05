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
  page = 1,
  pageSize = 10,
  className = "",
}) {
  const hasActions = rowActions.length > 0;

  const numberedData = data.map((row, index) => ({
    ...row,
    __rowNumber: (page - 1) * pageSize + index + 1,
  }));

  const numberedColumns = [
    {
      key: "__rowNumber",
      header: "#",
      width: "w-12",
    },
    ...columns,
  ];

  const actionsRenderer = hasActions
    ? (row, { isOpen, onOpenChange, position } = {}) => (
        <TableActions
          actions={rowActions
            .filter((action) => !action.visible || action.visible(row))
            .map((action) => ({
              label: action.label,
              icon: action.icon,
              variant: action.variant,
              onClick: () => onRowAction?.(action.key, row),
            }))}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          position={position}
        />
      )
    : undefined;

  return (
    <div
      className={`h-full overflow-y-auto overflow-x-auto rounded-xl border border-border bg-surface ${className}`}
    >
      <Table
        data={numberedData}
        columns={numberedColumns}
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