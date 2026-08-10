import PageHeader from "@/shared/page/PageHeader";
import TablePagination from "@/shared/table/TablePagination";
import ResourceToolbar from "./components/ResourceToolbar";
import ResourceTable from "./components/ResourceTable";
import {MotionDiv} from "@/animations/MotionElements"
/**
 * ResourceTemplate — pure composition layout for CRUD/resource pages.
 *
 * Zero internal state. Zero business logic.
 */
export default function ResourceTemplate({
  title,
  subtitle,
  header, // ← NEW: custom header node (overrides PageHeader)
  headerActions,
  breadcrumb,
  backTo,
  search,
  filters,
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
    <div className="space-y-5 h-full flex flex-col" dir="rtl">
      {header ? (
        header
      ) : (
        <PageHeader
          title={title}
          subtitle={subtitle}
          actions={headerActions}
          breadcrumb={breadcrumb}
          backTo={backTo}
        />
      )}

      <ResourceToolbar
        search={search}
        filters={filters}
        bulkActions={bulkActions}
        selectedCount={selected?.length ?? 0}
        onBulkAction={onBulkAction}
      />

      <MotionDiv className="space-y-6" delay={0.1}>
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-3">
          <ResourceTable
            columns={columns}
            data={data}
            loading={loading}
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
