/**
 * Normalize Persian text for identity matching (mirrors backend normalization).
 * Replaces Arabic ي → Persian ی, ك → Persian ک, normalizes whitespace.
 */
export function normalizePersian(str) {
  return (str || "")
    .replace(/\u064A/g, "\u06CC") // ي → ی
    .replace(/\u0643/g, "\u06A9") // ك → ک
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Find matching DivarNeighborhood from a list.
 *
 * @param {Array} divarList - List of DivarNeighborhood objects from API
 * @param {number|string} cityId - CRM City ID to filter by
 * @param {string} neighborhoodName - CRM Neighborhood name to match
 * @returns {{ id: number, name: string } | null} Matched DivarNeighborhood or null
 * @throws {Error} If zero or multiple matches found
 */
export function findDivarNeighborhood(divarList, cityId, neighborhoodName) {
  if (!cityId || !neighborhoodName) return null;

  const targetName = normalizePersian(neighborhoodName);
  const cityNum = Number(cityId);

  const candidates = (divarList || []).filter(
    (dn) =>
      dn.active !== false &&
      Number(dn.city) === cityNum &&
      normalizePersian(dn.name) === targetName,
  );

  if (candidates.length === 0) {
    throw new Error(
      "محله دیوار متناظر با این محله یافت نشد. " +
        "لطفاً ابتدا mapping محله را در بخش مدیریت مناطق بررسی کنید.",
    );
  }

  if (candidates.length > 1) {
    throw new Error(
      "چند محله دیوار مطابق با این محله یافت شد. " +
        "این مشکل داده است و باید توسط مدیر اصلاح شود.",
    );
  }

  return { id: candidates[0].id, name: candidates[0].name };
}
