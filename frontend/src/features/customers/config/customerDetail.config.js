
import {
  CUSTOMER_TYPE_CONFIG,
  CUSTOMER_STATUS_CONFIG,
} from "@/features/customers/config";

export const CUSTOMER_DETAIL_FIELDS = [
  {
    title: "اطلاعات پایه",
    fields: [
      { key: "full_name", label: "نام و نام خانوادگی" },
      { key: "phone", label: "شماره تماس" },
      { key: "email", label: "ایمیل", render: (v) => v || "—" }, // ADDED
      {
        key: "customer_type",
        label: "نوع مشتری",
        render: (v) => CUSTOMER_TYPE_CONFIG[v]?.label || v || "—",
      },
      {
        key: "status",
        label: "وضعیت",
        render: (v) => CUSTOMER_STATUS_CONFIG[v]?.label || v || "—",
      },
      { key: "source", label: "منبع", render: (v) => v || "—" },
    ],
  },
  {
    title: "اطلاعات تکمیلی",
    fields: [
      { key: "assigned_agent_name", label: "کارشناس مسئول", render: (v) => v || "—" },
      { key: "notes", label: "یادداشت‌ها", render: (v) => v || "—", span: 12 },
    ],
  },
];