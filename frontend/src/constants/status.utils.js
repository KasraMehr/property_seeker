import { HelpCircle } from "lucide-react";
import { STATUS_PALETTE } from "./statusPalette";

export function buildStatusConfig(config, status) {
  const data = config?.[status];

  if (!data) {
    return {
      label: status || "نامشخص",
      icon: HelpCircle,
      color: "neutral",
      ...STATUS_PALETTE.neutral,
    };
  }

  return {
    ...data,
    ...(STATUS_PALETTE[data.color] ?? STATUS_PALETTE.neutral),
  };
}