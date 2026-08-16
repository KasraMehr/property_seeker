import {
  CUSTOMER_TYPE_CONFIG,
  CUSTOMER_STATUS_CONFIG,
} from "@/features/customers/config";

export const CUSTOMER_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "full_name", label: "نام و نام خانوادگی" },
      { key: "phone", label: "شماره تماس", type: "phone" },
      { key: "email", label: "ایمیل" },
      {
        key: "customer_type",
        label: "نوع مشتری",
        type: "status",
        configKey: "customerType",
      },
      {
        key: "status",
        label: "وضعیت",
        type: "status",
        configKey: "customerStatus",
      },
      { key: "source", label: "منبع" },
    ],
  },
  {
    section: "extra",
    sectionLabel: "اطلاعات تکمیلی",
    fields: [
      { key: "assigned_agent_name", label: "کارشناس مسئول" },
      { key: "notes", label: "یادداشت‌ها", fullWidth: true },
      { key: "created_at", label: "تاریخ ثبت", type: "dateTime" },
      { key: "updated_at", label: "آخرین بروزرسانی", type: "dateTime" },
    ],
  },
];
