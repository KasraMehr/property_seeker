import SearchBox from "@/shared/ui/SearchBox";
import FilterBar from "@/shared/filters/FilterBar";
import Button from "@/shared/ui/Button";

export default function ResourceToolbar({
  search,
  filters,
  count,
  countLabel = "",
  bulkActions = [],
  selectedCount = 0,
  onBulkAction,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col gap-2 md:flex-row md:items-start md:justify-between ${className}`}
    >
      {/* Search + Filters */}
      <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row">
        {search && (
          <div className="shrink-0">
            <SearchBox
              value={search.value}
              onChange={search.onChange}
              onSearch={search.onSearch}
              label={search.label}
              placeholder={search.placeholder}
              className="max-w-sm"
            />
          </div>
        )}

        {filters && (
          <div className="shrink-0">
            <FilterBar
              schema={filters.schema}
              options={filters.options}
              filters={filters.values}
              onChange={filters.onChange}
              onClear={filters.onClear}
              onClearAll={filters.onClearAll}
              activeChips={filters.activeChips}
            />
          </div>
        )}
      </div>

      {/* Bulk Actions + Count */}
      <div className="flex items-center gap-4 shrink-0">
        {bulkActions.length > 0 && selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">
              {selectedCount.toLocaleString("fa-IR")} انتخاب شده
            </span>

            {bulkActions.map((action) => {
              const Icon = action.icon;

              return (
                <Button
                  key={action.key}
                  variant={action.variant === "danger" ? "danger" : "outline"}
                  size="sm"
                  icon={Icon}
                  className="!px-2.5 !py-1 !text-xs gap-1"
                  onClick={() => onBulkAction?.(action.key)}
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}

        {/* Count */}
        {count !== undefined && count !== null && (
          <span className="text-sm text-muted whitespace-nowrap">
            {count.toLocaleString("fa-IR")} {countLabel}
          </span>
        )}
      </div>
    </div>
  );
}