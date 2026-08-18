import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { buildStatusConfig } from "@/constants/status.utils";
import { STATUS_CONFIG_MAP } from "../status/statusConfigMap";

export default function StatusField({ value, field }) {
  const cfg = STATUS_CONFIG_MAP[field.configKey];
  if (!cfg) return String(value);

  return (
    <StatusBadge
      config={buildStatusConfig(cfg, value)}
      size="sm"
      variant="soft"
    />
  );
}