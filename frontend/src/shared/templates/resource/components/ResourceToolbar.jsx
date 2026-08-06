import SearchBox from "@/shared/ui/SearchBox";
import FilterBar from "@/shared/filters/FilterBar";
import Button from "@/shared/ui/Button";

export default function ResourceToolbar({
  search,
  filters,
  bulkActions = [],
  selectedCount = 0,
  onBulkAction,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-3 md:flex-row md:items-start md:justify-between ${className}`}>
      <div className="flex flex-col gap-3 w-full md:w-auto md:flex-row">
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

      {bulkActions.length > 0 && selectedCount > 0 && (
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted">{selectedCount} انتخاب شده</span>
          {bulkActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.key}
                variant={action.variant === "danger" ? "danger" : "outline"}
                size="sm"
                icon={Icon}
                onClick={() => onBulkAction?.(action.key)}
              >
                {action.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}