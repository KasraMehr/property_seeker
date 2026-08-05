import { formatPrice } from "@/utils/formatters";

/**
 * ستون‌ها = فیلدهای PropertyListSerializer
 * sortable = false چون backend ordering ندارد
 */
export const PROPERTY_TABLE_COLUMNS = [
  {
    key: "property_code",
    label: "کد ملک",
    sortable: false,
  },
  {
    key: "title",
    label: "عنوان",
    sortable: false,
  },
  {
    key: "owner",
    label: "مالک",
    sortable: false,
    render: (row) => row.owner ?? "-",
  },
  {
    key: "agent",
    label: "کارشناس",
    sortable: false,
    render: (row) => row.agent ?? "-",
  },
  {
    key: "city",
    label: "شهر",
    sortable: false,
    render: (row) => row.city ?? "-",
  },
  {
    key: "deal_type",
    label: "نوع معامله",
    sortable: false,
    type: "badge",
  },
  {
    key: "area",
    label: "متراژ",
    sortable: false,
    render: (row) => (row.area ? `${row.area} متر` : "-"),
  },
  {
    key: "sale_price",
    label: "قیمت فروش",
    sortable: false,
    render: (row) => (row.sale_price ? formatPrice(row.sale_price) : "-"),
  },
  {
    key: "monthly_rent",
    label: "اجاره ماهانه",
    sortable: false,
    render: (row) => (row.monthly_rent ? formatPrice(row.monthly_rent) : "-"),
  },
  {
    key: "status",
    label: "وضعیت",
    sortable: false,
    type: "status",
  },
];