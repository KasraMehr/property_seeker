import { formatPrice } from "@/utils/formatters";
import { buildStatusConfig } from "@/constants/status.utils";
import { LISTING_STATUS_CONFIG } from "./listingStatus.config";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import ScoreBadge from "@/shared/ui/badges/ScoreBadge";
import SourceBadge from "@/shared/ui/badges/SourceBadge";
import Thumbnail from "@/shared/ui/Thumbnail";
import { Phone, MapPin } from "lucide-react";

export const LISTING_TABLE_COLUMNS = [
  {
    key: "title",
    title: "عنوان",
    width: "260px",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2.5 min-w-0">
        <Thumbnail src={row.hs_picture} alt={row.title} size="md" />
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-medium text-sm text-foreground truncate max-w-52">
            {row.title}
          </span>
          <div className="flex items-center gap-1 text-muted text-[11px]">
            <Phone size={10} />
            <span className="dir-ltr">{row.phone}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    title: "وضعیت",
    width: "90px",
    align: "center",
    sortable: true,
    render: (row) => {
      const config = buildStatusConfig(LISTING_STATUS_CONFIG, row.status);
      return <StatusBadge config={config} variant="soft" size="sm" />;
    },
  },
  {
    key: "score",
    title: "امتیاز",
    width: "80px",
    align: "center",
    sortable: true,
    render: (row) => <ScoreBadge score={row.score} size="sm" showLabel={false} />,
  },
  {
    key: "district",
    title: "منطقه",
    width: "140px",
    sortable: false,
    render: (row) => (
      <div className="flex items-center gap-1 text-muted text-xs">
        <MapPin size={12} />
        <span>{row.district?.name || "—"}</span>
      </div>
    ),
  },
  {
    key: "listed_sale_price",
    title: "قیمت",
    width: "130px",
    sortable: true,
    render: (row) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">
          {formatPrice(row.listed_sale_price || row.listed_rent_amount)}
        </span>
        {row.price_per_meter_toman && (
          <span className="text-[10px] text-(--role-primary)">
            متری: {new Intl.NumberFormat("fa-IR").format(row.price_per_meter_toman)}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "build_year",
    title: "سال / اتاق / طبقه",
    width: "120px",
    align: "center",
    sortable: false,
    render: (row) => (
      <span className="text-xs text-muted font-mono">
        {[row.build_year, row.room_count, row.floor_number].filter(Boolean).join(" / ")}
      </span>
    ),
  },
  {
    key: "source",
    title: "منبع",
    width: "80px",
    align: "center",
    sortable: false,
    render: (row) => {
      const s = typeof row.source === "string" ? row.source : row.source?.description;
      return <SourceBadge source={s} size="sm" />;
    },
  },
];