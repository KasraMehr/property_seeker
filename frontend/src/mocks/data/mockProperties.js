export const MOCK_FEATURES = [
  { id: 1, title: "آسانسور" },
  { id: 2, title: "پارکینگ" },
  { id: 3, title: "انباری" },
  { id: 4, title: "بالکن" },
  { id: 5, title: "سرایداری" },
];

export const MOCK_PROPERTIES = [
  {
    id: 1,
    property_code: "MJ-1001",
    title: "فایل اختصاصی - ۱۲۰ متر سعادت آباد",
    deal_type: "SALE", // SALE, RENT, MORTGAGE
    property_type: "APARTMENT", // APARTMENT, VILLA, COMMERCIAL
    status: "AVAILABLE", // AVAILABLE, RESERVED, SOLD, RENTED
    
    // Pricing
    sale_price: 15600000000,
    price_per_meter: 130000000,
    deposit_amount: 0,
    monthly_rent: 0,
    mortgage_amount: 0,

    // Property specs
    area: 120,
    bedrooms: 3,
    bathrooms: 2,
    age: 5,
    floor: 3,
    total_floors: 5,
    parking_count: 2,
    storage_count: 1,
    condition: "EXCELLENT",
    orientation: "NORTH",

    description: "ملک با نورگیر فوق‌العاده، بازسازی شده با متریال برند، آماده تحویل.",

    // Relations (Foreign Keys)
    owner: 2, // MOCK_OWNERS[1]
    agent: 2, // MOCK_USERS[1] (Operator)
    address: 2, // MOCK_ADDRESSES[1]

    created_at: "2026-07-28T09:00:00Z",
    updated_at: "2026-07-28T09:00:00Z",
  },
];

export const MOCK_PROPERTY_FEATURES = [
  { id: 1, property: 1, feature: 1 },
  { id: 2, property: 1, feature: 2 },
  { id: 3, property: 1, feature: 3 },
  { id: 4, property: 1, feature: 4 },
];

export const MOCK_PROPERTY_STATUS_HISTORY = [
  {
    id: 1,
    property: 1,
    changed_by: 2,
    old_status: "DRAFT",
    new_status: "AVAILABLE",
    created_at: "2026-07-28T09:00:00Z",
  },
];