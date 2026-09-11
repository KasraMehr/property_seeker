import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { PROPERTY_DEAL_TYPE_CONFIG } from "./propertyDealType.config";

/**
 * Create/Edit Property Form
 * Multi-tab: basic, location, specs, price, owner_agent
 */
export const PROPERTY_FORM = {
  title: "پرونده ملک",
  tabs: [
    {
      key: "basic",
      label: "اطلاعات پایه",
      icon: "Home",
      fields: [
        {
          key: "property_code",
          label: "کد ملک",
          type: "text",
          readOnly: true,
          span: 6,
        },
        {
          key: "title",
          label: "عنوان ملک",
          type: "text",
          required: true,
          placeholder: "مثلاً آپارتمان ۱۲۰ متری عظیمیه",
          validation: { required: "عنوان ملک الزامی است" },
          span: 6,
        },
        {
          key: "deal_type",
          label: "نوع معامله",
          type: "select",
          required: true,
          placeholder: "انتخاب نوع",
          defaultValue: "buy-residential",
          options: Object.entries(PROPERTY_DEAL_TYPE_CONFIG).map(
            ([value, config]) => ({
              value,
              label: config.label,
              icon: config.icon,
              color: config.color,
            }),
          ),
          validation: { required: "نوع معامله الزامی است" },
          span: 6,
        },
        {
          key: "status",
          label: "وضعیت",
          type: "select",
          required: true,
          placeholder: "انتخاب وضعیت",
          options: [
            { value: "available", label: "در دسترس" },
            { value: "reserved", label: "رزرو شده" },
            { value: "sold", label: "فروخته شده" },
            { value: "rented", label: "اجاره داده شده" },
            { value: "archived", label: "آرشیو" },
          ],
          defaultValue: "available",
          validation: { required: "وضعیت الزامی است" },
          span: 6,
        },
        {
          key: "property_type",
          label: "نوع ملک",
          type: "select",
          required: false,
          placeholder: "انتخاب نوع ملک",
          options: [
            { value: "آپارتمان", label: "آپارتمان" },
            { value: "ویلا", label: "ویلا" },
            { value: "زمین", label: "زمین" },
            { value: "تجاری", label: "تجاری" },
            { value: "دفتر", label: "دفتر" },
            { value: "مغازه", label: "مغازه" },
          ],
          span: 6,
        },
        {
          key: "owner",
          label: "مالک",
          type: "search_select",
          required: true,
          placeholder: "انتخاب مالک...",
          asyncSource: API_ENDPOINTS.OWNERS.LIST.url,
          searchFields: ["full_name", "phone"],
          displayField: "full_name",
          // addAction will be injected by PropertyFormModal
          span: 6,
        },
        {
          key: "agent",
          label: "مشاور",
          type: "search_select",
          required: false,
          placeholder: "انتخاب مشاور...",
          asyncSource: API_ENDPOINTS.ACCOUNTS.USERS.LIST.url,
          searchFields: ["full_name", "phone"],
          displayField: "full_name",
          span: 6,
        },
        {
          key: "description",
          label: "توضیحات",
          type: "textarea",
          required: false,
          placeholder: "توضیحات تکمیلی ملک...",
          rows: 4,
          span: 12,
        },
      ],
    },
    {
      key: "location",
      label: "موقعیت مکانی",
      icon: "MapPin",
      fields: [
        {
          key: "location",
          label: "موقعیت",
          type: "location_cascade",
          includeAddress: false,
          required: true,
          validation: {
            required: "موقعیت مکانی الزامی است.",
            validate: (v) =>
              v?.neighborhood || "موقعیت مکانی الزامی است. لطفاً استان و محله را انتخاب کنید.",
          },
          span: 12,
        },
        {
          key: "street",
          label: "خیابان",
          type: "text",
          required: false,
          placeholder: "نام خیابان",
          span: 6,
        },
        {
          key: "alley",
          label: "کوچه",
          type: "text",
          required: false,
          placeholder: "نام کوچه",
          span: 6,
        },
        {
          key: "plaque",
          label: "پلاک",
          type: "text",
          required: false,
          placeholder: "شماره پلاک",
          span: 4,
        },
        {
          key: "unit",
          label: "واحد",
          type: "text",
          required: false,
          placeholder: "شماره واحد",
          span: 4,
        },
        {
          key: "postal_code",
          label: "کد پستی",
          type: "text",
          required: false,
          placeholder: "کد پستی",
          span: 4,
        },
        {
          key: "address_text",
          label: "توضیحات آدرس",
          type: "textarea",
          required: false,
          placeholder: "توضیحات تکمیلی آدرس...",
          rows: 2,
          span: 12,
        },
      ],
    },
    {
      key: "specs",
      label: "مشخصات فنی",
      icon: "Ruler",
      fields: [
        {
          key: "area",
          label: "متراژ (متر مربع)",
          type: "number",
          required: true,
          placeholder: "مثلاً ۱۲۰",
          min: 0,
          validation: { required: "متراژ ملک الزامی است." },
          span: 6,
        },
        {
          key: "age",
          label: "سن بنا",
          type: "number",
          required: false,
          placeholder: "مثلاً ۵",
          min: 0,
          span: 6,
        },
        {
          key: "bedrooms",
          label: "تعداد اتاق خواب",
          type: "number",
          required: false,
          placeholder: "مثلاً ۲",
          min: 0,
          span: 6,
        },
        {
          key: "bathrooms",
          label: "تعداد سرویس بهداشتی",
          type: "number",
          required: false,
          placeholder: "مثلاً ۱",
          min: 0,
          span: 6,
        },
        {
          key: "floor",
          label: "شماره طبقه",
          type: "number",
          required: false,
          placeholder: "مثلاً ۳",
          span: 6,
        },
        {
          key: "total_floors",
          label: "تعداد کل طبقات",
          type: "number",
          required: false,
          placeholder: "مثلاً ۵",
          span: 6,
        },
        {
          key: "parking_count",
          label: "تعداد پارکینگ",
          type: "number",
          required: false,
          placeholder: "مثلاً ۱",
          min: 0,
          span: 6,
        },
        {
          key: "storage_count",
          label: "تعداد انباری",
          type: "number",
          required: false,
          placeholder: "مثلاً ۱",
          min: 0,
          span: 6,
        },
        {
          key: "orientation",
          label: "جهت",
          // NOTE: backend orientation is CharField (single string), not array.
          // Changed from multi_select → select to match backend contract.
          type: "select",
          required: false,
          placeholder: "انتخاب جهت",
          options: [
            { value: "north", label: "شمالی" },
            { value: "south", label: "جنوبی" },
            { value: "east", label: "شرقی" },
            { value: "west", label: "غربی" },
            { value: "northeast", label: "شمال شرقی" },
            { value: "northwest", label: "شمال غربی" },
            { value: "southeast", label: "جنوب شرقی" },
            { value: "southwest", label: "جنوب غربی" },
          ],
          span: 6,
        },
        {
          key: "condition",
          label: "وضعیت ساختمان",
          type: "select",
          required: false,
          placeholder: "انتخاب وضعیت",
          options: [
            { value: "excellent", label: "عالی" },
            { value: "good", label: "خوب" },
            { value: "average", label: "متوسط" },
            { value: "needs_renovation", label: "نیاز به بازسازی" },
            { value: "old", label: "قدیمی" },
          ],
          span: 6,
        },
      ],
    },
    {
      key: "features_tab",
      label: "امکانات و ویژگی‌ها",
      icon: "Star",
      fields: [
        {
          key: "features",
          label: "امکانات و ویژگی‌ها",
          type: "multi_select",
          required: false,
          asyncSource: API_ENDPOINTS.FEATURES.LIST.url,
          searchFields: ["title"],
          displayField: "title",
          valueField: "id",
          span: 12,
        },
      ],
    },
    {
      key: "sale_price",
      label: "قیمت و مالی",
      icon: "Banknote",
      fields: [
        {
          key: "sale_price",
          label: (values) =>
            values?.deal_type === "exchange"
              ? "تفاوت قیمت معاوضه (تومان)"
              : "قیمت کل (تومان)",
          type: "price",
          required: false,
          placeholder: "مثلاً ۵,۰۰۰,۰۰۰,۰۰۰",
          span: 6,
        },
        {
          key: "price_per_meter",
          label: "قیمت هر متر (تومان)",
          type: "price",
          required: false,
          placeholder: "محاسبه خودکار یا دستی",
          span: 6,
        },
        {
          key: "deposit_amount",
          label: "ودیعه (تومان)",
          type: "price",
          required: false,
          placeholder: "مثلاً ۵۰۰,۰۰۰,۰۰۰",
          span: 6,
        },
        {
          key: "mortgage_amount",
          label: "مبلغ رهن (تومان)",
          type:"price",
          required: false,
          placeholder: "مثلاً ۵۰۰,۰۰۰,۰۰۰",
          span: 6,
        },
        {
          key: "monthly_rent",
          label: "اجاره ماهانه (تومان)",
          type: "price",
          required: false,
          placeholder: "مثلاً ۱۵,۰۰۰,۰۰۰",
          span: 6,
        },
      ],
    },
  ],
  actions: {
    submit: { label: "ذخیره ملک", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

/**
 * Change Property Status Form
 * Used in: Row action for properties
 * Backend: PATCH /api/property/update/<id>/ with { status }
 * PropertyUpdateSerializer records PropertyStatusHistory automatically.
 * Single row action only — bulk requires a dedicated bulk endpoint.
 */
export const CHANGE_PROPERTY_STATUS_FORM = {
  title: "تغییر وضعیت",
  description: "وضعیت ملک(های) انتخاب‌شده را تغییر دهید",
  tabs: null,
  fields: [
    {
      key: "status",
      label: "وضعیت",
      type: "select",
      required: true,
      placeholder: "انتخاب وضعیت",
      options: [
        { value: "available", label: "موجود" },
        { value: "reserved", label: "رزرو شده" },
        { value: "sold", label: "فروخته شده" },
        { value: "rented", label: "اجاره داده شده" },
        { value: "archived", label: "آرشیو" },
      ],
      validation: { required: "وضعیت الزامی است" },
      span: 12,
    },
  ],
  actions: {
    submit: { label: "ذخیره تغییرات", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

/**
 * Assign Agent Form
 * DISABLED: No backend endpoint for bulk agent assignment exists.
 * Re-enable when backend implements: PUT /api/property/bulk-assign-agent/
 */
// export const ASSIGN_AGENT_FORM = { ... };

/**
 * Promote Listing → Property
 * Backend: POST /api/listing/<id>/promote/
 * ListingPromotionSerializer fields only:
 *   owner (required), deal_type (required),
 *   area, title, address, property_type, floor, total_floors (optional)
 * area is required by backend when listing has no listed_area.
 */
export const PROMOTE_LISTING_FORM = {
  title: "تبدیل آگهی به ملک",
  description:
    "فیلدهای دارای * الزامی هستند. اطلاعات ملک از آگهی به صورت خودکار پر می‌شود.",
  tabs: null,
  fields: [
    {
      key: "owner",
      label: "مالک",
      type: "search_select",
      required: true,
      placeholder: "جستجوی مالک...",
      asyncSource: API_ENDPOINTS.OWNERS.LIST.url,
      searchFields: ["full_name", "phone"],
      displayField: "full_name",
      validation: { required: "انتخاب مالک الزامی است" },
      span: 12,
    },
    {
      key: "deal_type",
      label: "نوع معامله",
      type: "select",
      required: true,
      placeholder: "انتخاب نوع معامله",
      options: Object.entries(PROPERTY_DEAL_TYPE_CONFIG).map(
        ([value, config]) => ({
          value,
          label: config.label,
          icon: config.icon,
          color: config.color,
        }),
      ),
      validation: { required: "نوع معامله الزامی است" },
      span: 6,
    },
    {
      key: "title",
      label: "عنوان",
      type: "text",
      required: false,
      placeholder: "عنوان ملک (اختیاری)",
      autoFill: { source: "listing", field: "title", readOnly: false },
      span: 6,
    },
    {
      key: "area",
      label: "متراژ",
      type: "number",
      required: false,
      placeholder: "متر مربع",
      autoFill: { source: "listing", field: "listed_area", readOnly: false },
      validation: { required: "متراژ الزامی است (آگهی متراژ ندارد)" },
      span: 6,
    },
    {
      key: "location",
      label: "موقعیت",
      type: "location_cascade",
      includeAddress: false,
      autoFill: {
        source: "listing",
        field: "divar_neighborhood",
        transform: (dn) => {
          if (!dn || typeof dn !== "object") return undefined;
          return {
            province: dn.city_province ?? null,
            city: dn.city ?? null,
            district: null,
            neighborhood: null,
          };
        },
      },
      span: 12,
    },
    {
      key: "address_text",
      label: "آدرس دقیق",
      type: "textarea",
      required: false,
      placeholder: "خیابان، کوچه، پلاک و...",
      rows: 2,
      autoFill: {
        source: "listing",
        field: "address",
        transform: (addr) => addr || "",
      },
      span: 12,
    },
    {
      key: "property_type",
      label: "نوع ملک",
      type: "select",
      required: false,
      placeholder: "انتخاب نوع ملک",
      options: [
        { value: "آپارتمان", label: "آپارتمان" },
        { value: "ویلا", label: "ویلا" },
        { value: "زمین", label: "زمین" },
        { value: "تجاری", label: "تجاری" },
        { value: "دفتر", label: "دفتر" },
        { value: "مغازه", label: "مغازه" },
      ],
      autoFill: {
        source: "listing",
        field: "category",
        transform: (cat) => {
          const map = {
            "rent-residential": "آپارتمان",
            "buy-residential": "آپارتمان",
            "buy-commercial-property": "تجاری",
            "rent-commercial-property": "تجاری",
          };
          return map[cat] || "";
        },
      },
      span: 6,
    },
    {
      key: "floor",
      label: "طبقه",
      type: "number",
      required: false,
      autoFill: { source: "listing", field: "floor_number", readOnly: false },
      span: 6,
    },
    {
      key: "total_floors",
      label: "تعداد کل طبقات",
      type: "number",
      required: false,
      autoFill: { source: "listing", field: "total_floors", readOnly: false },
      span: 6,
    },
    {
      key: "features",
      label: "امکانات و ویژگی‌ها",
      type: "multi_select",
      required: false,
      // placeholder: "انتخاب امکانات...",
      asyncSource: API_ENDPOINTS.FEATURES.LIST.url,
      searchFields: ["title"],
      displayField: "title",
      valueField: "id",
      span: 12,
    },
  ],
  actions: {
    submit: { label: "تبدیل به ملک", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};
