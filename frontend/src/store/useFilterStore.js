import { create } from "zustand";

/**
 * useFilterStore — persists filter state per route pathname.
 *
 * Keyed by pathname (e.g. "/owner/listings"), each value is a plain object
 * of filter key→value pairs plus optional labels.
 *
 * This allows filters to survive sidebar navigation: when the user navigates
 * away and comes back, the store still has the last filter state for that route.
 */
const useFilterStore = create((set, get) => ({
  // { [pathname]: { filters: {...}, labels: {...} } }
  _state: {},

  getFilters: (pathname) => {
    const entry = get()._state[pathname];
    return entry?.filters ?? null;
  },

  getLabels: (pathname) => {
    const entry = get()._state[pathname];
    return entry?.labels ?? null;
  },

  setFilters: (pathname, filters, labels) => {
    set((prev) => ({
      _state: {
        ...prev._state,
        [pathname]: { filters, labels },
      },
    }));
  },

  clearFilters: (pathname) => {
    set((prev) => {
      const next = { ...prev._state };
      delete next[pathname];
      return { _state: next };
    });
  },
}));

export default useFilterStore;
