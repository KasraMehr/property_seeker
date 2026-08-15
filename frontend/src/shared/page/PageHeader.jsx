import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ArrowLeft } from "lucide-react";

/**
 * PageHeader
 *
 * Reusable page header.
 * Supports:
 * - title
 * - subtitle
 * - breadcrumb
 * - back button
 * - actions
 * - compact mode for dashboard topbar
 */
const PageHeader = forwardRef(
  (
    {
      title,
      subtitle,
      breadcrumb = [],
      backTo,
      actions,
      compact = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`
          w-full
          ${
            compact
              ? "flex min-w-0 items-center justify-between gap-4"
              : "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          }
          ${className}
        `}
        {...props}
      >
        {/* Title / Breadcrumb */}
        <div className="min-w-0">
          {/* Breadcrumb */}
          {breadcrumb.length > 0 && (
            <nav className="mb-1 flex items-center gap-1.5 text-xs text-muted">
              {breadcrumb.map((crumb, index) => (
                <span
                  key={`${crumb.label}-${index}`}
                  className="flex items-center gap-1.5"
                >
                  {index > 0 && (
                    <ChevronLeft
                      size={12}
                      className="shrink-0 opacity-50"
                    />
                  )}

                  {crumb.to ? (
                    <Link
                      to={crumb.to}
                      className="truncate transition-colors hover:text-(--role-primary)"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="truncate">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {/* Back + Title */}
          <div className="flex min-w-0 items-center gap-3">
            {backTo && (
              <Link
                to={backTo}
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-lg border border-border
                  bg-surface text-muted
                  transition-all duration-200
                  hover:border-(--role-primary)/30
                  hover:text-(--role-primary)
                "
                aria-label="بازگشت"
              >
                <ArrowLeft size={18} />
              </Link>
            )}

            <div className="min-w-0">
              <h1
                className={
                  compact
                    ? "truncate text-lg font-bold tracking-tight text-foreground"
                    : "text-xl font-bold tracking-tight text-foreground"
                }
              >
                {title}
              </h1>

              {subtitle && (
                <p
                  className={
                    compact
                      ? "truncate text-xs text-muted"
                      : "mt-0.5 text-sm text-muted"
                  }
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex shrink-0 items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    );
  },
);

PageHeader.displayName = "PageHeader";

export default PageHeader;