import { useState, useCallback } from "react";

/**
 * useTableSelection — generic checkbox selection for any table
 * Works with any row that has an `id` field.

 *   selected        — array of selected IDs
 *   toggle(id)      — toggle single row
 *   toggleAll(items) — select/deselect all items on current page
 *   clear()         — clear all selections
 *   isSelected(id)  — boolean
 *   allSelectedOnPage(items) — boolean
 */
export default function useTableSelection() {
  const [selected, setSelected] = useState([]);

  const toggle = useCallback((id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const toggleAll = useCallback((pageItems) => {
    const ids = pageItems.map((r) => r.id);
    const allSelected = ids.length > 0 && ids.every((id) => selected.includes(id));
    setSelected((prev) =>
      allSelected
        ? prev.filter((id) => !ids.includes(id))
        : [...new Set([...prev, ...ids])]
    );
  }, [selected]);

  const clear = useCallback(() => setSelected([]), []);

  const isSelected = useCallback(
    (id) => selected.includes(id),
    [selected]
  );

  const allSelectedOnPage = useCallback(
    (pageItems) => pageItems.length > 0 && pageItems.every((r) => selected.includes(r.id)),
    [selected]
  );

  return { selected, toggle, toggleAll, clear, isSelected, allSelectedOnPage };
}