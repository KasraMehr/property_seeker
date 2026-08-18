export const formatPrice = (v) => {
  if (v == null || v === "") return "";
  return String(v)
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const parsePrice = (v) =>
  v ? Number(String(v).replace(/,/g, "")) : null;