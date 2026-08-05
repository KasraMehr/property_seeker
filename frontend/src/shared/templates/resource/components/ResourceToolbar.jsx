import SearchBox from "@/shared/ui/SearchBox";
import FilterBar from "@/shared/filters/FilterBar";
import Button from "@/shared/ui/Button";

/**
 * ResourceToolbar — pure composition of SearchBox + FilterBar + bulk actions.
 *
 * Responsibilities:
 * - Render SearchBox, forwarding `search` props unchanged.
 * - Render FilterBar, forwarding `filters` props unchanged (same shape FilterBar/useFilter already expect).
 * - Render bulk action buttons when one or more rows are selected, sourced from
 *   `actions` entries with `scope: "bulk"`.
 *
 * NOT responsible for:
 * - Holding search/filter/selection state (all controlled via props).
 * - Knowing what a bulk action does — clicks are reported via `onBulkAction(key)`.
 * - Deciding filter/search semantics for any particular resource.
 */
export default function ResourceToolbar({
  search,
  filters,
  actions = [],
  selectedCount = 0,
  onBulkAction,
  className = "",
}) {
  const bulkActions = actions.filter((action) => action.scope === "bulk");

  return (
    <div className={`flex flex-col gap-3 md:flex-row md:items-start md:justify-between ${className}`}>
      <div className="flex flex-col gap-3 w-full md:w-auto md:flex-row">
        {/* Search */}
        {search && (
          <div className="shrink-0">
            <SearchBox
              value={search.value}
              onChange={search.onChange}
              onSearch={search.onSearch}
              placeholder={search.placeholder}
              className="max-w-sm"
            />
          </div>
        )}

        {/* Filters */}
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

      {/* Bulk actions — only shown when rows are selected */}
      {bulkActions.length > 0 && selectedCount > 0 && (
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted">
            {selectedCount} انتخاب شده
          </span>
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