import { Link } from "react-router-dom";

export default function NavigationItem({
  label,
  href,
  to,
  icon: Icon,
  type = "scroll",
  onClick,
}) {
  const handleScroll = (e) => {
    e.preventDefault();

    const target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    onClick?.();
  };

  if (type === "route") {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
      >
        {Icon && <Icon size={18} />}

        <span>{label}</span>
      </Link>
    );
  }

  return (
    <a
      href={href}
      onClick={handleScroll}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
    >
      {Icon && <Icon size={18} />}

      <span>{label}</span>
    </a>
  );
}