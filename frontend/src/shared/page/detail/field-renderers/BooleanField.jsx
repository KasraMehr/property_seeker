import { CheckCircle2, XCircle } from "lucide-react";

export default function BooleanField({ value, field }) {
  const isTrue = value === true || value === "true";
  return isTrue ? (
    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
      <CheckCircle2 className="w-3.5 h-3.5" /> {field.trueLabel || "بله"}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <XCircle className="w-3.5 h-3.5" /> {field.falseLabel || "خیر"}
    </span>
  );
}