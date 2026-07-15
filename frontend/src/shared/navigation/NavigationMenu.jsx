import NavigationItem from "./NavigationItem";

export default function NavigationMenu({
  items = [],
  header,
  footer,
  onItemClick,
  className = "",
}) {
  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Header */}
      {header && (
        <div className="mb-6">
          {header}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2">
        {items.map((item) => (
          <NavigationItem
            key={item.label}
            {...item}
            onClick={onItemClick}
          />
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="mt-6 border-t border-border pt-5">
          {footer}
        </div>
      )}
    </div>
  );
}