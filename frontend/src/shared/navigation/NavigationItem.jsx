import { Link, useLocation } from "react-router-dom";

export default function NavigationItem({
  label,
  href,
  to,
  path, // 👈 اضافه شد
  icon: Icon,
  type = "route",
  onClick,
}) {
  const location = useLocation();

  // Handle smooth scroll for anchor links
  const handleScroll = (e) => {
    e.preventDefault();
    const targetSelector = href || path;
    if (targetSelector) {
      const target = document.querySelector(targetSelector);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    onClick?.();
  };

  // Determine active route state (پشتیبانی از path, to, href)
  const targetPath = to || path || href;
  const isActive = type === "route" && targetPath && location.pathname === targetPath;

  if (type === "route" || to || path) {
    return (
      <Link
        to={targetPath || "#"} // 👈 استفاده از targetPath به عنوان مقصد اصلی
        onClick={onClick}
        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
          isActive
            ? "bg-(--role-subtle) text-(--role-primary) font-bold border-r-4 border-(--role-primary)"
            : "text-muted hover:bg-(--role-subtle)/50 hover:text-foreground"
        }`}
      >
        {Icon && <Icon size={18} />}
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <a
      href={href || path || "#"}
      onClick={handleScroll}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-muted transition-all duration-200 hover:bg-(--role-subtle)/50 hover:text-foreground"
    >
      {Icon && <Icon size={18} />}
      <span>{label}</span>
    </a>
  );
}