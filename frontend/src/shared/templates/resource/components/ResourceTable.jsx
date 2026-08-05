import Table from "@/shared/table/Table";
import TableActions from "@/shared/table/TableActions";

/**
 * ResourceTable — wraps shared/table/Table.jsx and renders it purely from config.
 *
 * Responsibilities:
 * - Map `columns` config into Table.Column / Table.Cell.
 * - Call `column.render(row)` for every cell — never reads `row[column.key]` directly.
 * - Render a selection checkbox column when `selectable` is true, controlled entirely
 *   via the `selected` prop and `onSelectionChange` callback (no internal state).
 * - Render a row-actions column from `actions` entries with `scope: "row"`
 *   (or no scope — "row" is the default), filtered by each action's optional
 *   `visible(row)` check, wired through TableActions.
 * - Forward sort clicks for sortable columns to a single `onSort(key)` callback.
 * - Render Table.EmptyState via Table.Body's `empty` slot when `data` is empty and not loading.
 *
 * NOT responsible for:
 * - Fetching, filtering, sorting, or paginating `data` — it receives the page of rows
 *   already computed, and only reports intent upward.
 * - Knowing what any action *does* — action clicks are reported via `onRowAction(key, row)`.
 * - Formatting any field value — that is entirely `column.render`'s job.
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
  actions = [],
  onRowAction,
  rowKey = "id",
  className = "",
}) {
  const rowActions = actions.filter(
    (action) => !action.scope || action.scope === "row",
  );
  const hasActionsColumn = rowActions.length > 0;

  const isSelected = (row) => selected.includes(row[rowKey]);
  const allSelectedOnPage = data.length > 0 && data.every(isSelected);

  const toggleAll = () => {
    if (!onSelectionChange) return;
    const pageIds = data.map((row) => row[rowKey]);
    if (allSelectedOnPage) {
      onSelectionChange(selected.filter((id) => !pageIds.includes(id)));
    } else {
      onSelectionChange([...new Set([...selected, ...pageIds])]);
    }
  };

  const toggleRow = (row) => {
    if (!onSelectionChange) return;
    const id = row[rowKey];
    onSelectionChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );
  };

  const isEmpty = !loading && data.length === 0;

  return (
    <div
      className={`overflow-x-auto rounded-xl border border-border bg-surface ${className}`}
    >
      <Table
        loading={loading}
        sortable
        sortState={{ key: sort?.key ?? null, dir: sort?.dir ?? "asc" }}
        onSort={onSort}
      >
        <Table.Header>
          {selectable && (
            <Table.Column align="center" width="44px">
              <input
                type="checkbox"
                checked={allSelectedOnPage}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-border text-(--role-primary) focus:ring-(--role-primary)/20"
              />
            </Table.Column>
          )}

          {columns.map((column) => (
            <Table.Column
              key={column.key}
              align={column.align}
              width={column.width}
              sortKey={column.sortable ? column.key : undefined}
            >
              {column.label}
            </Table.Column>
          ))}

          {hasActionsColumn && (
            <Table.Column align="center" width="60px">
              عملیات
            </Table.Column>
          )}
        </Table.Header>

        <Table.Body
          empty={isEmpty ? <Table.EmptyState {...emptyState} /> : undefined}
        >
          {data.map((row) => (
            <Table.Row
              key={row[rowKey]}
              selected={selectable && isSelected(row)}
            >
              {selectable && (
                <Table.Cell align="center">
                  <input
                    type="checkbox"
                    checked={isSelected(row)}
                    onChange={() => toggleRow(row)}
                    className="w-4 h-4 rounded border-border text-(--role-primary) focus:ring-(--role-primary)/20"
                  />
                </Table.Cell>
              )}

              {columns.map((column) => (
                <Table.Cell
                  key={column.key}
                  align={column.align}
                  width={column.width}
                >
                  {column.render(row)}
                </Table.Cell>
              ))}

              {hasActionsColumn && (
                <Table.Cell align="center">
                  <TableActions
                    actions={rowActions
                      .filter(
                        (action) => !action.visible || action.visible(row),
                      )
                      .map((action) => ({
                        label: action.label,
                        icon: action.icon,
                        variant: action.variant,
                        onClick: () => onRowAction?.(action.key, row),
                      }))}
                  />
                </Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
