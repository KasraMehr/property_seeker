import { Home } from "lucide-react";

/**
 * Thumbnail — reusable image thumbnail with icon fallback.
 */
export default function Thumbnail({
  src,
  alt = "",
  size = "md",
  fallbackIcon: FallbackIcon = Home,
  className = "",
}) {
  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  const iconSizeMap = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  const cls = `rounded-lg object-cover shrink-0 border border-border bg-(--role-subtle)/30 flex items-center justify-center ${sizeMap[size]} ${className}`;

  if (src) {
    return <img src={src} alt={alt} className={cls} loading="lazy" />;
  }

  return (
    <div className={cls}>
      <FallbackIcon size={iconSizeMap[size]} className="text-muted" />
    </div>
  );
}