import { Eye } from "lucide-react";
import { getSpanClass } from "../utils/getSpanClass";

export default function LinkField({ field, getValues }) {
  const spanClass = getSpanClass(field.span);
  const linkVal = getValues(field.key);

  return (
    <div className={spanClass}>
      {field.label && (
        <label className="block text-sm font-medium mb-1.5 text-muted">{field.label}</label>
      )}
      {linkVal ? (
        <a
          href={linkVal}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Eye size={14} /> مشاهده لینک
        </a>
      ) : (
        <span className="text-sm text-muted">—</span>
      )}
    </div>
  );
}