// Mock Agencies
export const MOCK_AGENCIES = [
  {
    id: 1,
    name: "املاک ملک‌جو (شعبه مرکزی)",
    phone: "02188888888",
    address: "شهرک اندیشه ، کوچه اول",
  },
];

// User roles definition 
export const MOCK_ROLES = {
  ADMIN: {
    id: 1,
    agency: 1,
    name: "مدیر کل",
    description: "مدیر ارشد آژانس با دسترسی کامل",
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
    name: "مشاور / اپراتور",
    description: "اپراتور ثبت آگهی و پیگیری تماس‌ها",
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

// Mock system users 
export const MOCK_USERS = [
  {
    id: 1,
    phone: "09102301418",
    full_name: "علی محمدی",
    national_id: "0012345678",
    agency: MOCK_AGENCIES[0],
    role: [MOCK_ROLES.ADMIN], 
    service_districts: [
      { id: 1, name: "منطقه ۱" },
      { id: 2, name: "منطقه ۳" },
    ],
    is_owner: true, // Admin
    is_active: true,
    is_staff: true,
    last_login: "2026-07-28T10:00:00Z",
    created_at: "2026-01-10T08:30:00Z",
    updated_at: "2026-01-10T08:30:00Z",
  },
  {
    id: 2,
    phone: "09362019241",
    full_name: "رضا احمدی",
    national_id: "0087654321",
    agency: MOCK_AGENCIES[0],
    role: [MOCK_ROLES.OPERATOR], 
    service_districts: [
      { id: 2, name: "منطقه ۳" },
    ],
    is_owner: false, // Operator
    is_active: true,
    is_staff: true,
    last_login: "2026-07-28T11:00:00Z",
    created_at: "2026-02-15T10:15:00Z",
    updated_at: "2026-02-15T10:15:00Z",
  },
];