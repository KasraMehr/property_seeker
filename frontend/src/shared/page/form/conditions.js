export function shouldShowTab(tab, values) {
  if (!tab.condition) return true;
  if (typeof tab.condition === "function") return tab.condition(values);
  return true;
}

export function shouldShowField(field, values, mode) {
  if (!field.condition) return true;
  if (typeof field.condition === "function") return field.condition(values, mode);
  return true;
}