// roles with permissions for RBAC mock
export const MOCK_ROLES = {
  ADMIN: {
    id: 1,
    agency: 1,
    name: "مدیر",
    description: "دسترسی کامل به سیستم",
    permissions: [
      "add_property",
      "change_property",
      "delete_property",
      "view_property",
      "add_user",
      "change_user",
      "view_user",
      "view_scraper",
      "manage_settings",
    ],
  },
  OPERATOR: {
    id: 2,
    agency: 1,
    name: "اپراتور / کارشناس",
    description: "تماس و پیگیری لیدها",
    permissions: [
      "add_property",
      "change_property",
      "view_property",
      "add_call",
      "view_call",
      "add_followup",
      "view_followup",
    ],
  },
};