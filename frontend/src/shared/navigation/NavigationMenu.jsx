import NavigationItem from "./NavigationItem";

export default function NavigationMenu({
  items = [],
  header,
  footer,
  onItemClick,
  scrollOffset,
  className = "",
}) {
  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Header */}
      {header && <div className="mb-6">{header}</div>}

      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col gap-2">
        {items.map((item, index) => (
          <NavigationItem
            key={item.to || item.path || item.href || item.label || index} 
            type="route"
            {...item}
            onClick={onItemClick}
            scrollOffset={scrollOffset}
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