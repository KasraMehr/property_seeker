import TablePagination from "@/shared/table/TablePagination";
import ResourceToolbar from "./components/ResourceToolbar";
import ResourceTable from "./components/ResourceTable";
import { MotionDiv } from "@/animations/MotionElements";

/**
 * ResourceTemplate — pure composition layout for CRUD/resource pages.
 *
 * Zero internal state.
 * Zero business logic.
 */
export default function ResourceTemplate({
  search,
  filters,
  count,
  countLabel,
  columns,
  data,
  loading,
  emptyState,
  sort,
  onSort,
  selectable,
  selected,
  onSelectionChange,
  rowActions,
  bulkActions,
  onRowAction,
  onBulkAction,
  pagination,
  onPageChange,
}) {
  return (
    <div className="flex h-full flex-col space-y-5" dir="rtl">
      <ResourceToolbar
        search={search}
        filters={filters}
        count={count}
        countLabel={countLabel}
        bulkActions={bulkActions}
        selectedCount={selected?.length ?? 0}
        onBulkAction={onBulkAction}
      />

      <MotionDiv className="flex flex-col flex-1 min-h-0" delay={0.1}>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
          <ResourceTable
            columns={columns}
            data={data}
            loading={loading}
            page={pagination?.page ?? 1}
            pageSize={pagination?.pageSize ?? 20}
            emptyState={emptyState}
            sort={sort}
            onSort={onSort}
            selectable={selectable}
            selected={selected}
            onSelectionChange={onSelectionChange}
            rowActions={rowActions}
            onRowAction={onRowAction}
          />
        </div>
      </MotionDiv>

      {pagination && pagination.totalPages > 1 && (
        <TablePagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onChange={onPageChange}
        />
      )}
    </div>
  );
}
