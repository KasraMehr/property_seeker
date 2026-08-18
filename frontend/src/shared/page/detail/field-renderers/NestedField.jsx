import { getValue } from "../utils/getValue";

export default function NestedField({ value, field, data }) {
  const nestedVal = field.dataKey ? getValue(data, field.dataKey) : value;
  const display = field.nestedKey
    ? getValue(nestedVal, field.nestedKey)
    : nestedVal;
  return display || "—";
}