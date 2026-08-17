import { DETAIL_FIELD_RENDERERS } from "../field-renderers";
import DefaultField from "../field-renderers/DefaultField";

/* ─── Format value by type ─── */
export function formatFieldValue(value, field, data) {
  if (value === null || value === undefined || value === "") return null;

  if (field.type === "action") {
    return null; // handled separately
  }

  const Renderer = DETAIL_FIELD_RENDERERS[field.type] || DefaultField;
  return <Renderer value={value} field={field} data={data} />;
}