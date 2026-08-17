import { FORM_FIELD_RENDERERS } from "./field-renderers";
import TextField from "./field-renderers/TextField";

/* ─── Field ─── */
export default function FieldRenderer({
  field,
  control,
  errors,
  setValue,
  getValues,
  disabled,
}) {
  const isDisabled =
    disabled || field.readOnly || (field.dependsOn && !getValues(field.dependsOn));
  const labelWithStar = field.required
    ? `${field.label || ""} *`
    : field.label;

  const Renderer = FORM_FIELD_RENDERERS[field.type] || TextField;

  return (
    <Renderer
      field={field}
      control={control}
      errors={errors}
      setValue={setValue}
      getValues={getValues}
      disabled={isDisabled}
      isDisabled={isDisabled}
      labelWithStar={labelWithStar}
    />
  );
}