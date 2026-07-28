export const MOCK_PROVINCES = [
  {
    id: 1,
    name: "تهران",
    created_at: "2026-01-01T00:00:00Z",
  },
];

export const MOCK_CITIES = [
  {
    id: 1,
    province: 1,
    name: "تهران",
  },
];

export const MOCK_DISTRICTS = [
  {
    id: 1,
    city: 1,
    name: "منطقه ۵",
  },
  {
    id: 2,
    city: 1,
    name: "منطقه ۲",
  },
];

export const MOCK_NEIGHBORHOODS = [
  {
    id: 1,
    district: 1,
    name: "پونک",
  },
  {
    id: 2,
    district: 1,
    name: "جنت‌آباد جنوبی",
  },
  {
    id: 3,
    district: 2,
    name: "سعادت‌آباد",
  },
];

export const MOCK_ADDRESSES = [
  {
    id: 1,
    neighborhood: MOCK_NEIGHBORHOODS[0], // Pounak
    street: "بلوار همیلا",
    alley: "خیابان پارک",
    plaque: "۱۲",
    unit: "۴",
    postal_code: "1476543210",
    full_text: "تهران، پونک، بلوار همیلا، خیابان پارک، پلاک ۱۲، واحد ۴",
    latitude: "35.7681",
    longitude: "51.3364",
    created_at: "2026-02-01T10:00:00Z",
    updated_at: "2026-02-01T10:00:00Z",
  },
  {
    id: 2,
    neighborhood: MOCK_NEIGHBORHOODS[2], // Saadat Abad
    street: "بلوار دریا",
    alley: "صرافها",
    plaque: "۴۵",
    unit: "۲",
    postal_code: "1998765432",
    full_text: "تهران، سعادت‌آباد، بلوار دریا، صرافها، پلاک ۴۵، واحد ۲",
    latitude: "35.7820",
    longitude: "51.3712",
    created_at: "2026-02-10T11:00:00Z",
    updated_at: "2026-02-10T11:00:00Z",
  },
];
