import { formatDate } from "@/utils/formatters";

export default function DateTimeField({ value }) {
  return formatDate(value, "long");
}