import { forwardRef } from "react";

const Card = forwardRef(
  (
    {
      children,
      title,
      subtitle,
      icon: Icon,
      actions,
      className = "",
      contentClassName = "",
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={`
          rounded-2xl
          border border-border
          bg-surface
          shadow-sm
          overflow-hidden
          ${className}
        `}
        {...props}
      >
        {(title || subtitle || Icon || actions) && (
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3 min-w-0">
              {Icon && (
                <Icon
                  size={19}
                  className="shrink-0 text-(--role-primary)"
                />
              )}

              <div className="min-w-0">
                {title && (
                  <h2 className="text-sm font-semibold text-foreground">
                    {title}
                  </h2>
                )}

                {subtitle && (
                  <p className="mt-0.5 text-xs text-muted">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {actions && (
              <div className="shrink-0">
                {actions}
              </div>
            )}
          </div>
        )}

        <div className={contentClassName || "p-5"}>
          {children}
        </div>
      </section>
    );
  },
);

Card.displayName = "Card";

export default Card;
