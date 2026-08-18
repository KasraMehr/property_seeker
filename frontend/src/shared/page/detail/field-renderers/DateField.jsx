import { formatDate } from "@/utils/formatters";

export default function DateField({ value }) {
  return formatDate(value, "short");
}