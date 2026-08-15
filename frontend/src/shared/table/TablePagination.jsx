import { forwardRef } from "react";
import Button from "../ui/Button";

/**
 * TablePagination — role-aware pagination bar
 */
const TablePagination = forwardRef(({
  page = 1,
  totalPages = 1,
  onChange,
  siblingCount = 1,
  className = "",
}, ref) => {
  if (totalPages <= 1) return null;

  const generateRange = () => {
    const totalNumbers = siblingCount * 2 + 5;
    if (totalPages <= totalNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => totalPages - 3 - siblingCount * 2 + i + 1);
      return [1, "...", ...rightRange];
    }

    return [1, "...", ...Array.from({ length: rightSibling - leftSibling + 1 }, (_, i) => leftSibling + i), "...", totalPages];
  };

  const pages = generateRange();

  return (
    <div
      ref={ref}
      className={`
        flex items-center justify-center gap-2 px-4 py-3 border-t border-border bg-background/30
        ${className}
      `}
    >
      {/* prev */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange?.(page - 1)}
        disabled={page <= 1}
        className="px-3 h-8 rounded-lg text-xs font-medium"
      >
        قبلی
      </Button>

      {/* Numbers List*/}
      <div className="flex items-center gap-1">
        {pages.map((p, i) => (
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-xs text-muted">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange?.(p)}
              className={`
                w-8 h-8 rounded-lg text-xs font-medium transition-all duration-150
                ${p === page
                  ? "bg-(--role-primary) text-white shadow-sm shadow-(--role-primary)/25"
                  : "text-muted hover:text-foreground hover:bg-(--role-subtle)/30"
                }
              `}
            >
              {p}
            </button>
          )
        ))}
      </div>

      {/* Next */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange?.(page + 1)}
        disabled={page >= totalPages}
        className="px-3 h-8 rounded-lg text-xs font-medium"
      >
        بعدی
      </Button>
    </div>
  );
});

TablePagination.displayName = "TablePagination";
export default TablePagination;