import { formatPrice } from "@/utils/formatters";

export default function PriceField({ value }) {
  return formatPrice(value);
}