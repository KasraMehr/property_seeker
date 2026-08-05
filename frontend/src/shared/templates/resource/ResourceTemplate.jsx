import PageHeader from "@/shared/page/PageHeader";
import TablePagination from "@/shared/table/TablePagination";
import ResourceToolbar from "./components/ResourceToolbar";
import ResourceTable from "./components/ResourceTable";

/**
 * ResourceTemplate — pure composition layout for CRUD/resource pages.
 *
 * Structure (fixed):
 *   PageHeader
 *   ResourceToolbar (search + filters + bulk actions)
 *   ResourceTable   (existing Table.jsx, driven by columns/actions config)
 *   TablePagination
 *
 * This component ONLY renders. It has no internal state, performs no data
 * fetching, imports no feature files or services, and contains no logic
 * that depends on knowing what a "resource" represents. Every page that
 * uses this template supplies fully-resolved data and config as props;
 * every user interaction is reported upward through a single callback
 * per concern (onSort / onSelectionChange / onRowAction / onBulkAction / onPageChange).
 */
export default function ResourceTemplate({
  // Header
  title,
  subtitle,
  actions,
  breadcrumb,
  backTo,

  // Toolbar: search
  search,

  // Toolbar: filters
  filters,

  // Table: structure
  columns,
  data,
  loading,
  emptyState,

  // Table: sorting
  sort,
  onSort,

  // Table: selection
  selectable,
  selected,
  onSelectionChange,

  // Table: row + bulk actions
  onRowAction,
  onBulkAction,

  // Pagination
  pagination,
  onPageChange,
}) {
  return (
    <div className="space-y-5 h-full flex flex-col" dir="rtl">
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={actions}
        breadcrumb={breadcrumb}
        backTo={backTo}
      />

      <ResourceToolbar
        search={search}
        filters={filters}
        actions={actions}
        selectedCount={selected?.length ?? 0}
        onBulkAction={onBulkAction}
      />

      <div className="flex-1 min-h-0 flex flex-col gap-3">
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
          actions={actions}
          onRowAction={onRowAction}
        />

        {pagination && (
          <TablePagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}