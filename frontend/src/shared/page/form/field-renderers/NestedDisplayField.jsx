import { getSpanClass } from "../utils/getSpanClass";

export default function NestedDisplayField({ field, getValues }) {
  const spanClass = getSpanClass(field.span);
  const displayData = getValues(field.key);
  const template = field.displayTemplate || "{full_name}";
  const text =
    typeof displayData === "object" && displayData != null
      ? template.replace(/\{(\w+)\}/g, (_, k) => displayData[k] ?? "")
      : String(displayData ?? "");

  return (
    <div className={spanClass}>
      {field.label && (
        <label className="block text-sm font-medium mb-1.5 text-muted">{field.label}</label>
      )}
      <div className="rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm">
        {text || "—"}
      </div>
    </div>
  );
}