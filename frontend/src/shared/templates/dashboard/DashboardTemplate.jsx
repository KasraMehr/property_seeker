import { MotionDiv } from "@/animations/MotionElements";

/**
 * DashboardTemplate
 * A layout shell for dashboard pages. Renders a header area + widgets.
 */
export default function DashboardTemplate({
  title,
  subtitle,
  headerActions,
  children,
  className = "",
}) {
  return (
    <MotionDiv className={`space-y-6 rounded-2xl p-6 ${className}`} delay={0.1}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          {title && (
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          )}
          {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
        </div>
        {headerActions && (
          <div className="flex items-center gap-2">{headerActions}</div>
        )}
      </div>

      {/* Widgets Area */}
      <div className="space-y-6">{children}</div>
    </MotionDiv>
  );
}