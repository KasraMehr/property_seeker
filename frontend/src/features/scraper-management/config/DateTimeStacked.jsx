import { formatDate } from "@/utils/formatters";

/**
 * Two-line date/time cell for tables — time on top, date below.
 */
export default function DateTimeStacked({ value }) {
  if (!value) return "-";
  const d = new Date(value);
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-sm">
        {d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
      </span>
      <span className="text-xs text-muted-foreground">
        {formatDate(d, "short")}
      </span>
    </div>
  );
}
