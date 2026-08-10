import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ArrowLeft } from "lucide-react";

/**
 * PageHeader — role-aware page header with breadcrumb, title, actions
 * 
   <PageHeader title="جزئیات لید" backTo="/leads" actions={<Button>ویرایش</Button>} />
 */
const PageHeader = forwardRef(({
  title,
  subtitle,
  breadcrumb = [],   // [{ label, to? }]
  backTo,          // string path — shows back button
  actions,        // ReactNode — buttons on the right
  className = "",
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
      {...props}
    >
      {/* Left: Breadcrumb + Title */}
      <div className="space-y-1.5">
        {/* Breadcrumb */}
        {breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-muted">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronLeft size={12} className="opacity-50" />}
                {crumb.to ? (
                  <Link
                    to={crumb.to}
                    className="hover:text-(--role-primary) transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Back + Title row */}
        <div className="flex items-center gap-3">
          {backTo && (
            <Link
              to={backTo}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-surface text-muted hover:text-(--role-primary) hover:border-(--role-primary)/30 transition-all duration-200"
            >
              <ArrowLeft size={18} />
            </Link>
          )}
          <div>
            <h1 className="text-xl px-6 font-bold text-foreground tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm px-6 text-muted mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
});

PageHeader.displayName = "PageHeader";
export default PageHeader;