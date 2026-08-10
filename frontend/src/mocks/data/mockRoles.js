// Role model: id, agency(FK), name, description, permissions(M2M), created_at, updated_at
//  permissions باید دقیقاً همون codenameهای required_permission بک‌اند باشه

export const MOCK_ROLES = {
  ADMIN: {
    id: 1,
    agency: 1,
    name: "مدیر",
    description: "دسترسی کامل به سیستم",
    permissions: [
      // properties
      "add_property", "change_property", "delete_property", "view_property",
      // owners
      "add_owner", "change_owner", "delete_owner", "view_owner",
      // features
      "add_feature", "change_feature", "delete_feature", "view_feature",
      "add_property_feature", "change_property_feature", "delete_property_feature", "view_property_feature",
      // status history
      "view_property_status_history",
      // crm
      "create_customer", "view_customer",
      "create_customer_preference", "view_customer_preference",
      // locations
      "add_province", "view_province", "change_province", "delete_province", "list_province",
      "add_city", "view_city",
    ],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  SUPERVISOR: {
    id: 2,
    agency: 1,
    name: "سرپرست",
    description: "نظارت بر اپراتورها و گزارش‌گیری",
    permissions: [
      "add_property", "change_property", "view_property",
      "view_owner",
      "view_feature",
      "view_property_feature",
      "view_property_status_history",
      "create_customer", "view_customer",
      "view_customer_preference",
      "view_province", "list_province", "view_city",
    ],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  OPERATOR: {
    id: 3,
    agency: 1,
    name: "اپراتور / کارشناس",
    description: "تماس و پیگیری لیدها و ثبت املاک",
    permissions: [
      "add_property", "change_property", "view_property",
      "view_owner", "add_owner",
      "view_feature",
      "view_property_feature",
      "create_customer", "view_customer",
      "view_customer_preference",
      "view_province", "list_province",
    ],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  AGENT: {
    id: 4,
    agency: 1,
    name: "مشاور املاک",
    description: "مشاوره و بازدید با مشتریان",
    permissions: [
      "view_property", "change_property",
      "view_owner",
      "view_feature",
      "view_property_feature",
      "create_customer", "view_customer",
      "view_customer_preference",
      "view_province", "list_province",
    ],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  VIEWER: {
    id: 5,
    agency: 1,
    name: "ناظر",
    description: "فقط مشاهده گزارش‌ها",
    permissions: [
      "view_property",
      "view_owner",
      "view_feature",
      "view_property_feature",
      "view_customer",
      "view_customer_preference",
      "view_property_status_history",
      "view_province", "list_province",
    ],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
};