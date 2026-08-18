export default function DefaultField({ value, field }) {
  if (field.format && typeof field.format === "function") {
    return field.format(value);
  }
  return String(value);
}