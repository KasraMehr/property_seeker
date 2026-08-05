import { formatPrice, formatDate } from "@/utils/formatters";

/**
 * ستون‌ها بر اساس فیلدهای مدل Listing
 * نکته: district / assigned_to حذف شدند چون فیلد مستقیم نیستند.
 */
export const LISTING_TABLE_COLUMNS = [
  {
    key: "title",
    label: "عنوان",
    sortable: false,
    render: (row) => row.title,
  },
  {
    key: "external_id",
    label: "شناسه خارجی",
    sortable: false,
    render: (row) => row.external_id || "-",
  },
  {
    key: "source.name",
    label: "منبع",
    sortable: false,
    type: "badge",
    render: (row) => row.source?.name ?? "-",
  },
  {
    key: "property.property_code",
    label: "کد ملک",
    sortable: false,
    render: (row) => row.property?.property_code ?? "-",
  },
  {
    key: "status",
    label: "وضعیت",
    sortable: false,
    type: "status",
  },
  {
    key: "listed_area",
    label: "متراژ",
    sortable: false,
    render: (row) => (row.listed_area ? `${row.listed_area} متر` : "-"),
  },
  {
    key: "listed_sale_price",
    label: "قیمت فروش",
    sortable: false,
    render: (row) =>
      row.listed_sale_price ? formatPrice(row.listed_sale_price) : "-",
  },
  {
    key: "listed_deposit_amount",
    label: "ودیعه",
    sortable: false,
    render: (row) =>
      row.listed_deposit_amount ? formatPrice(row.listed_deposit_amount) : "-",
  },
  {
    key: "listed_rent_amount",
    label: "اجاره",
    sortable: false,
    render: (row) =>
      row.listed_rent_amount ? formatPrice(row.listed_rent_amount) : "-",
  },
  {
    key: "views_count",
    label: "بازدید",
    sortable: false,
  },
  {
    key: "leads_count",
    label: "سرنخ",
    sortable: false,
  },
  {
    key: "media_count",
    label: "تعداد رسانه",
    sortable: false,
  },
  {
    key: "created_by.full_name",
    label: "ایجاد کننده",
    sortable: false,
    render: (row) => row.created_by?.full_name ?? "-",
  },
  {
    key: "created_at",
    label: "تاریخ دریافت",
    sortable: false,
    render: (row) => formatDate(row.created_at),
  },
  {
    key: "expires_at",
    label: "تاریخ انقضا",
    sortable: false,
    render: (row) => (row.expires_at ? formatDate(row.expires_at) : "-"),
  },
];