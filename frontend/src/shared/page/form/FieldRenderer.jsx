import { FORM_FIELD_RENDERERS } from "./field-renderers";
import TextField from "./field-renderers/TextField";
import { useWatch } from "react-hook-form";

/* ─── Field ─── */
export default function FieldRenderer({
  field,
  control,
  errors,
  setValue,
  getValues,
  disabled,
}) {
  const formValues = useWatch({ control });
  const isDisabled =
    disabled || field.readOnly || (field.dependsOn && !getValues(field.dependsOn));

  const rawLabel = typeof field.label === "function"
    ? field.label(formValues)
    : field.label;
  const labelWithStar = field.required
    ? `${rawLabel || ""} *`
    : rawLabel;

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