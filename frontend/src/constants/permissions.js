// single source of truth to ckeck premissions for configs and UI

export const PERMISSIONS = {
  // ── properties  ──
  PROPERTY: {
    ADD: "add_property",
    VIEW: "view_property",
    CHANGE: "change_property",
    DELETE: "delete_property",
  },

  // ── properties/owners  ──
  OWNER: {
    ADD: "add_owner",
    VIEW: "view_owner",
    CHANGE: "change_owner",
    DELETE: "delete_owner",
  },

  // ── properties/features  ──
  FEATURE: {
    ADD: "add_feature",
    VIEW: "view_feature",
    CHANGE: "change_feature",
    DELETE: "delete_feature",
  },

  // ── properties/property-features  ──
  PROPERTY_FEATURE: {
    ADD: "add_property_feature",
    VIEW: "view_property_feature",
    CHANGE: "change_property_feature",
    DELETE: "delete_property_feature",
  },

  // ── properties/status-history ──
  PROPERTY_STATUS_HISTORY: {
    VIEW: "view_property_status_history",
  },

  // ── listing TODO ──
  LISTING: {
    // ADD: "add_listing",
    // VIEW: "view_listing",
    // CHANGE: "change_listing",
    // DELETE: "delete_listing",
    // PROMOTE: "promote_listing",   // اکشن تبدیل به ملک
  },

  // ── crm/customers ──
  CUSTOMER: {
    CREATE: "create_customer",
    VIEW: "view_customer",
  },

  // ── crm/customer-preferences ──
  CUSTOMER_PREFERENCE: {
    CREATE: "create_customer_preference",
    VIEW: "view_customer_preference",
  },

  // ── locations  ──
  PROVINCE: {
    ADD: "add_province",
    VIEW: "view_province",
    CHANGE: "change_province",
    DELETE: "delete_province",
    LIST: "list_province",
  },
  CITY: {
    ADD: "add_city",
    VIEW: "view_city",
  },

  // ── deals TODO:──
  DEAL: {
    // CREATE: "create_deal",
    // VIEW: "view_deal",
    // CHANGE: "change_deal",
    // DELETE: "delete_deal",
  },

  // ── accounts (کاربر/رول/آژانس) ──
  // این بخش‌ها IsAgencyOwner گارد دارن (permission-based نیستن).
  // فعلاً فقط OWNER_ONLY_SECTIONS رو توی RoleRoute چک می‌کنیم.
};

/**
 * صفحات/مسیرهایی که فقط is_owner اجازه دسترسی داره
 * (بک‌اندشون IsAgencyOwner هست، نه HasRolePermission)
 */
export const OWNER_ONLY_SECTIONS = [
  "users-management",
  "roles-management",
  "agencies-management",
  "scraper-management",   
];