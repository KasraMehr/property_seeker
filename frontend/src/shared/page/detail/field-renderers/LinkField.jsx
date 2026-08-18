import { ExternalLink } from "lucide-react";

export default function LinkField({ value, field }) {
  const href = typeof value === "string" ? value : value?.url || "#";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={href}
      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
    >
      <span>{field.linkText || "مشاهده در منبع"}</span>
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}