/**
 * دسته‌بندی دسترسی‌های سیستم
 *
 * بک‌اند از پرمیشن‌های پیش‌فرض جنگو استفاده می‌کند
 * (codename به شکل `add_property`، `view_listing`، ...) که
 * از طریق endpoint زیر برمی‌گردد:
 *
 *   GET /api/accounts/permissions/
 *   → { <model_name>: [{ id, name, codename }, ...] }
 *
 * هر دسته با لیست codename هایش تعریف می‌شود؛ رندرر
 * PermissionToggleField این لیست را به id های واقعی
 * پرمیشن‌ها (از خروجی endpoint بالا) نگاشت می‌کند.
 *
 * نکته: دسته‌های «معاملات»، «قراردادها» و «امور مالی» مال فاز دو هستند
 * و فعلاً کامنت شده‌اند؛ موقع فعال‌سازی فقط از کامنت دربیاورند.
 */

const CRUD_ACTIONS = ["view", "add", "change", "delete"];

const codenamesOf = (models, extra = []) => [
  ...models.flatMap((model) =>
    CRUD_ACTIONS.map((action) => `${action}_${model}`),
  ),
  ...extra,
];

export const PERMISSION_CATEGORIES = [
  {
    key: "properties",
    label: "املاک و مالکان",
    icon: "Building2",
    codenames: codenamesOf([
      "property",
      "propertystatushistory",
      "propertyhistory",
      "owner",
    ]),
  },

  {
    key: "property_features",
    label: "امکانات و ویژگی‌های ملک",
    icon: "ListChecks",
    codenames: codenamesOf(["feature", "propertyfeature"]),
  },

  {
    key: "crm",
    label: "مشتریان و CRM",
    icon: "Users",
    codenames: codenamesOf([
      "customer",
      "customerpreference",
      "calllog",
      "propertyvisit",
      "reminder",
      "tag",
    ]),
  },

  {
    key: "listings",
    label: "آگهی‌ها",
    icon: "Megaphone",
    codenames: codenamesOf(
      ["listing", "listingstatushistory", "source", "media"],
      ["review_listing", "promote_listing"],
    ),
  },

  // ─── فاز دو ───────────────────────────────────────────────

  // {
  //   key: "deals",
  //   label: "معاملات",
  //   icon: "Handshake",
  //   codenames: codenamesOf(["deal"]),
  // },
  //
  // {
  //   key: "contracts",
  //   label: "قراردادها",
  //   icon: "FileSignature",
  //   codenames: codenamesOf(["contract", "contracthistory"]),
  // },
  //
  // {
  //   key: "finance",
  //   label: "امور مالی",
  //   icon: "Wallet",
  //   codenames: codenamesOf([
  //     "category",
  //     "commission",
  //     "expense",
  //     "salarypayment",
  //     "salarypaymentitem",
  //   ]),
  // },

  // ──────────────────────────────────────────────────────────

  {
    key: "locations",
    label: "موقعیت‌های مکانی",
    icon: "MapPin",
    codenames: codenamesOf([
      "province",
      "city",
      "district",
      "neighborhood",
      "zone",
      "address",
    ]),
  },

  {
    key: "divar_neighborhoods",
    label: "محله‌های دیوار",
    icon: "Map",
    codenames: codenamesOf(["divarneighborhood"]),
  },

  {
    key: "users",
    label: "کاربران",
    icon: "UserCog",
    codenames: codenamesOf(["user"]),
  },

  {
    key: "roles",
    label: "نقش‌ها و دسترسی‌ها",
    icon: "Shield",
    codenames: codenamesOf(["role"]),
  },

  {
    key: "agency",
    label: "اطلاعات آژانس",
    icon: "Building",
    codenames: codenamesOf(["agency"]),
  },

  {
    key: "ingestion",
    label: "جمع‌آوری داده (دیوار)",
    icon: "Download",
    codenames: codenamesOf([
      "scrapetarget",
      "ingestionrun",
      "ingestionrunitem",
      "listingsnapshot",
      "targetlisting",
    ]),
  },

  {
    key: "audit_logs",
    label: "لاگ‌ها و تاریخچه",
    icon: "History",
    codenames: codenamesOf(["activitylog", "pricelog"]),
  },
];
