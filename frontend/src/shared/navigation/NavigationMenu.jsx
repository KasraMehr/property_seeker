import NavigationItem from "./NavigationItem";

export default function NavigationMenu({
  items = [],
  onItemClick,
  scrollOffset,
  className = "",
}) {
  return (
    <nav
      className={`flex flex-col items-center gap-5 ${className}`}
    >
      {items.map((item, index) => (
        <NavigationItem
          key={item.id || item.to || item.path || item.href || index}
          {...item}
          type={item.type}
          onClick={onItemClick}
          scrollOffset={scrollOffset}
        />
      ))}
    </nav>
  );
}