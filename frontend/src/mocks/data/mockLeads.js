export const MOCK_SOURCES = [
  {
    id: 1,
    name: "Divar",
    description: "دیوار - بخش املاک",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Sheypoor",
    description: "شیپور - بخش املاک",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

export const MOCK_LEADS = [
  {
    id: 1,
    external_id: "divar_123456",
    title: "آپارتمان ۸۵ متری خوش نقشه در پونک",
    description: "۸۵ متر، ۲ خواب، فول امکانات، رو به آفتاب، بدون عکس در آگهی اولیه.",
    source: MOCK_SOURCES[0],
    url: "https://divar.ir/v/123456",
    status: "NEW", // NEW, REVIEWED, CONTACTED, CONVERTED, REJECTED
    score: 85,
    media_count: 0,
    views_count: 120,
    leads_count: 1,
    listed_area: 85,
    listed_sale_price: 6800000000,
    listed_rent_amount: 0,
    listed_deposit_amount: 0,
    published_at: "2026-07-28T08:00:00Z",
    expires_at: "2026-08-28T08:00:00Z",
    created_by: 2, // Operator User ID
    property: null,
    created_at: "2026-07-28T08:30:00Z",
    updated_at: "2026-07-28T08:30:00Z",
  },
  {
    id: 2,
    external_id: "divar_654321",
    title: "آپارتمان ۱۲۰ متری ۳ خواب سعادت آباد",
    description: "۱۲۰ متر، تک واحدی، شخصی ساز، مالک فروشنده واقعی.",
    source: MOCK_SOURCES[0],
    url: "https://divar.ir/v/654321",
    status: "CONTACTED",
    score: 90,
    media_count: 2,
    views_count: 250,
    leads_count: 3,
    listed_area: 120,
    listed_sale_price: 15600000000,
    listed_rent_amount: 0,
    listed_deposit_amount: 0,
    published_at: "2026-07-27T10:00:00Z",
    expires_at: "2026-08-27T10:00:00Z",
    created_by: 2,
    property: 1, // Linked to MOCK_PROPERTIES[0]
    created_at: "2026-07-27T10:15:00Z",
    updated_at: "2026-07-28T09:00:00Z",
  },
];

export const MOCK_CALL_LOGS = [
  {
    id: 1,
    listing: MOCK_LEADS[1].id,
    changed_by: 2, // Operator ID
    old_status: "NEW",
    new_status: "CONTACTED",
    reason: "تماس برقرار شد. مالک تمایل به همکاری و عکاسی اختصاصی دارد.",
    created_at: "2026-07-28T09:00:00Z",
  },
];

export const MOCK_FOLLOWUPS = [
  {
    id: 1,
    lead_id: 1,
    operator_id: 2,
    owner_name: "محمد حسینی",
    phone: "09121111111",
    scheduled_at: "2026-07-29T11:00:00Z",
    status: "PENDING", // PENDING, COMPLETED, CANCELLED
    notes: "تماس مجدد برای هماهنگی زمان بازدید و عکاسی.",
    created_at: "2026-07-28T09:30:00Z",
  },
];