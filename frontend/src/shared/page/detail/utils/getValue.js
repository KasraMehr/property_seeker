/* ─── Get nested value ─── */
export function getValue(obj, keyPath) {
  if (!obj) return null;
  const keys = keyPath.split(".");
  let val = obj;
  for (const k of keys) {
    if (val == null) return null;
    val = val[k];
  }
  return val;
}