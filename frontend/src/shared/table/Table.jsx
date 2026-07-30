import { createContext, useContext, useState, forwardRef } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Loader2 } from "lucide-react";

// Context 
const TableContext = createContext({});
const useTable = () => useContext(TableContext);

// Root Table 
const Table = forwardRef(({
  children,
  className = "",
  selectable = false,
  sortable = false,
  onSort,
  sortState = { key: null, dir: "asc" },
  loading = false,
  emptyState,
  ...props
}, ref) => {
  return (
    <TableContext.Provider value={{ selectable, sortable, onSort, sortState }}>
      <div
        ref={ref}
        className={`
          bg-surface rounded-2xl border border-border shadow-sm overflow-hidden
          ${className}
        `}
        {...props}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-160">
            {children}
          </table>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="text-(--role-primary) animate-spin" />
          </div>
        )}
      </div>
    </TableContext.Provider>
  );
});
Table.displayName = "Table";

//  Header 
const Header = forwardRef(({ children, className = "", ...props }, ref) => (
  <thead ref={ref} className={className} {...props}>
    <tr className="border-b border-border bg-background/50">
      {children}
    </tr>
  </thead>
));
Header.displayName = "Table.Header";

// Column (th)
const Column = forwardRef(({
  children,
  className = "",
  align = "right",
  width,
  sortKey,
  ...props
}, ref) => {
  const { sortable, onSort, sortState } = useTable();
  const isSorted = sortState?.key === sortKey;
  const isAsc = sortState?.dir === "asc";

  const alignMap = { right: "text-right", center: "text-center", left: "text-left" };

  return (
    <th
      ref={ref}
      className={`
        p-3 text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap
        ${alignMap[align] || "text-right"}
        ${sortable && sortKey ? "cursor-pointer select-none hover:text-foreground transition-colors" : ""}
        ${className}
      `}
      style={width ? { width, minWidth: width } : undefined}
      onClick={() => sortable && sortKey && onSort?.(sortKey)}
      {...props}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable && sortKey && (
          <span className="inline-flex flex-col text-[10px] leading-none text-muted">
            {isSorted ? (
              isAsc ? <ChevronDown size={14} className="text-(--role-primary)" /> : <ChevronUp size={14} className="text-(--role-primary)" />
            ) : (
              <ChevronsUpDown size={14} className="opacity-40" />
            )}
          </span>
        )}
      </span>
    </th>
  );
});
Column.displayName = "Table.Column";

// Body
const Body = forwardRef(({ children, className = "", empty, ...props }, ref) => {
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children;

  return (
    <tbody ref={ref} className={`divide-y divide-border ${className}`} {...props}>
      {!hasChildren && empty ? (
        <tr>
          <td colSpan={100} className="p-0">
            {empty}
          </td>
        </tr>
      ) : (
        children
      )}
    </tbody>
  );
});
Body.displayName = "Table.Body";

// Row
const Row = forwardRef(({
  children,
  className = "",
  selected = false,
  onClick,
  ...props
}, ref) => (
  <tr
    ref={ref}
    onClick={onClick}
    className={`
      transition-colors duration-150
      ${selected
        ? "bg-(--role-primary)/5 hover:bg-(--role-primary)/8"
        : "hover:bg-(--role-subtle)/20 even:bg-background/40"
      }
      ${onClick ? "cursor-pointer" : ""}
      ${className}
    `}
    {...props}
  >
    {children}
  </tr>
));
Row.displayName = "Table.Row";

// Cell
const Cell = forwardRef(({
  children,
  className = "",
  align = "right",
  width,
  colSpan,
  ...props
}, ref) => {
  const alignMap = { right: "text-right", center: "text-center", left: "text-left" };

  return (
    <td
      ref={ref}
      colSpan={colSpan}
      className={`
        p-3 text-sm text-foreground whitespace-nowrap
        ${alignMap[align] || "text-right"}
        ${className}
      `}
      style={width ? { width, minWidth: width } : undefined}
      {...props}
    >
      {children}
    </td>
  );
});
Cell.displayName = "Table.Cell";

// EmptyState
const EmptyState = forwardRef(({
  icon: Icon,
  title = "داده‌ای یافت نشد",
  description = "هنوز موردی ثبت نشده است.",
  action,
  className = "",
}, ref) => (
  <div
    ref={ref}
    className={`
      flex flex-col items-center justify-center py-14 px-4 text-center
      ${className}
    `}
  >
    {Icon && (
      <div className="w-14 h-14 rounded-2xl bg-(--role-subtle)/30 border border-(--role-border) flex items-center justify-center mb-4">
        <Icon size={28} className="text-(--role-primary)/60" />
      </div>
    )}
    <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted max-w-xs">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
));
EmptyState.displayName = "Table.EmptyState";

// Skeleton
const Skeleton = forwardRef(({ rows = 5, columns = 4, className = "" }, ref) => (
  <div ref={ref} className={className}>
    {Array.from({ length: rows }).map((_, ri) => (
      <div key={ri} className="flex items-center gap-3 p-3 border-b border-border animate-pulse">
        {Array.from({ length: columns }).map((_, ci) => (
          <div
            key={ci}
            className="h-4 bg-muted/20 rounded-md"
            style={{ width: `${Math.random() * 40 + 40}%` }}
          />
        ))}
      </div>
    ))}
  </div>
));
Skeleton.displayName = "Table.Skeleton";

// Attach sub-components
Table.Header = Header;
Table.Column = Column;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;
Table.EmptyState = EmptyState;
Table.Skeleton = Skeleton;

export default Table;