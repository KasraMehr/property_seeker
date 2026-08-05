// roles with permissions for RBAC mock
export const MOCK_ROLES = {
  ADMIN: {
    id: 1,
    agency: 1,
    name: "مدیر",
    description: "دسترسی کامل به سیستم",
    permissions: [
      "add_property", "change_property", "delete_property", "view_property",
      "add_user", "change_user", "delete_user", "view_user",
      "add_owner", "change_owner", "delete_owner", "view_owner",
      "add_call", "change_call", "view_call", "delete_call",
      "add_followup", "change_followup", "view_followup", "delete_followup",
      "view_scraper", "manage_scraper", "manage_settings", "view_reports",
      "view_dashboard", "export_data", "import_data",
    ],
  },
  SUPERVISOR: {
    id: 2,
    agency: 1,
    name: "سرپرست",
    description: "نظارت بر اپراتورها و گزارش‌گیری",
    permissions: [
      "add_property", "change_property", "view_property",
      "view_user", "change_user",
      "add_call", "change_call", "view_call",
      "add_followup", "change_followup", "view_followup",
      "view_scraper", "view_reports", "view_dashboard",
    ],
  },
  OPERATOR: {
    id: 3,
    agency: 1,
    name: "اپراتور / کارشناس",
    description: "تماس و پیگیری لیدها و ثبت املاک",
    permissions: [
      "add_property", "change_property", "view_property",
      "add_call", "view_call", "change_call",
      "add_followup", "view_followup", "change_followup",
      "view_owner", "add_owner",
    ],
  },
  AGENT: {
    id: 4,
    agency: 1,
    name: "مشاور املاک",
    description: "مشاوره و بازدید با مشتریان",
    permissions: [
      "view_property", "change_property",
      "add_call", "view_call",
      "add_followup", "view_followup",
      "view_owner",
    ],
  },
  VIEWER: {
    id: 5,
    agency: 1,
    name: "ناظر",
    description: "فقط مشاهده گزارش‌ها",
    permissions: [
      "view_property", "view_call", "view_followup", "view_dashboard", "view_reports",
    ],
  },
};