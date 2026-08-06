// location hierarchy: province -> city -> district -> neighborhood -> address
// Province: id, name, created_at
// City: id, province(FK), name
// District: id, city(FK), name
// Neighborhood: id, district(FK), name
// Address: id, neighborhood(FK), agency(FK), street, alley, plaque, unit, postal_code, latitude, longitude, full_text, created_at, updated_at

export const MOCK_PROVINCES = [
  { id: 1, name: "البرز", created_at: "2026-01-01T00:00:00Z" },
  { id: 2, name: "تهران", created_at: "2026-01-01T00:00:00Z" },
];

export const MOCK_CITIES = [
  { id: 1, name: "کرج", province: 1 },
  { id: 2, name: "ماهدشت", province: 1 },
  { id: 3, name: "تهران", province: 2 },
];

export const MOCK_DISTRICTS = [
  { id: 1, name: "منطقه ۱ کرج", city: 1 },
  { id: 2, name: "منطقه ۲ کرج", city: 1 },
  { id: 3, name: "منطقه ۳ کرج", city: 1 },
  { id: 4, name: "منطقه ۴ کرج", city: 1 },
  { id: 5, name: "منطقه ۵ کرج", city: 1 },
  { id: 6, name: "منطقه ۶ کرج", city: 1 },
  { id: 7, name: "منطقه ۷ کرج", city: 1 },
  { id: 8, name: "منطقه ۸ کرج", city: 1 },
  { id: 9, name: "منطقه ۹ کرج", city: 1 },
  { id: 10, name: "منطقه ۱۰ کرج", city: 1 },
];

export const MOCK_NEIGHBORHOODS = [
  { id: 1, name: "گلشهر", district: 1 },
  { id: 2, name: "مهرشهر", district: 2 },
  { id: 3, name: "عظیمیه", district: 3 },
  { id: 4, name: "کرج نو", district: 4 },
  { id: 5, name: "شاهین ویلا", district: 5 },
  { id: 6, name: "کیانمهر", district: 6 },
  { id: 7, name: "مهرویلا", district: 7 },
  { id: 8, name: "اشتراکی", district: 8 },
  { id: 9, name: "ساسانی", district: 9 },
  { id: 10, name: "حصارک", district: 10 },
  { id: 11, name: "باغستان", district: 3 },
  { id: 12, name: "محمدشهر", district: 4 },
  { id: 13, name: "فردیس", district: 5 },
  { id: 14, name: "جهانشهر", district: 6 },
  { id: 15, name: "سپاهدار", district: 7 },
  { id: 16, name: "گلستان", district: 1 },
  { id: 17, name: "بلوار امام", district: 2 },
  { id: 18, name: "مشکین دشت", district: 3 },
  { id: 19, name: "شهرک اوج", district: 4 },
  { id: 20, name: "شهرک بنفشه", district: 5 },
  { id: 21, name: "شهرک بهارستان", district: 6 },
  { id: 22, name: "شهرک دریا", district: 7 },
  { id: 23, name: "شهرک نسترن", district: 8 },
  { id: 24, name: "شهرک صنعتی", district: 9 },
  { id: 25, name: "آزادگان", district: 10 },
];

// Address model: id, neighborhood(FK), agency(FK), street, alley, plaque, unit, postal_code, latitude, longitude, full_text, created_at, updated_at
export const MOCK_ADDRESSES = [
  {
    id: 1, neighborhood: 1, agency: 1,
    street: "خیابان گلشهر", alley: "کوچه ۱۵", plaque: "۴۲", unit: "۳", postal_code: "3145687412",
    latitude: "35.8325000", longitude: "50.9912000",
    full_text: "البرز، کرج، منطقه ۱، گلشهر، خیابان گلشهر، کوچه ۱۵، پلاک ۴۲، واحد ۳",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2, neighborhood: 2, agency: 1,
    street: "بلوار مهرشهر", alley: "کوچه ۸", plaque: "۱۲۵", unit: "۲", postal_code: "3145698523",
    latitude: "35.8050000", longitude: "50.9650000",
    full_text: "البرز، کرج، منطقه ۲، مهرشهر، بلوار مهرشهر، کوچه ۸، پلاک ۱۲۵، واحد ۲",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 3, neighborhood: 3, agency: 1,
    street: "خیابان عظیمیه", alley: "کوچه ۲۲", plaque: "۸۸", unit: "۵", postal_code: "3145612345",
    latitude: "35.8200000", longitude: "51.0100000",
    full_text: "البرز، کرج، منطقه ۳، عظیمیه، خیابان عظیمیه، کوچه ۲۲، پلاک ۸۸، واحد ۵",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 4, neighborhood: 4, agency: 1,
    street: "خیابان کرج نو", alley: "کوچه ۵", plaque: "۳۰", unit: "۱", postal_code: "3145632145",
    latitude: "35.8450000", longitude: "51.0250000",
    full_text: "البرز، کرج، منطقه ۴، کرج نو، خیابان کرج نو، کوچه ۵، پلاک ۳۰، واحد ۱",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 5, neighborhood: 5, agency: 1,
    street: "خیابان شاهین ویلا", alley: "کوچه ۱۰", plaque: "۶۰", unit: "۲", postal_code: "3145645678",
    latitude: "35.8600000", longitude: "51.0000000",
    full_text: "البرز، کرج، منطقه ۵، شاهین ویلا، خیابان شاهین ویلا، کوچه ۱۰، پلاک ۶۰، واحد ۲",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 6, neighborhood: 6, agency: 1,
    street: "خیابان کیانمهر", alley: "کوچه ۱۸", plaque: "۷۵", unit: "۴", postal_code: "3145656789",
    latitude: "35.7900000", longitude: "50.9800000",
    full_text: "البرز، کرج، منطقه ۶، کیانمهر، خیابان کیانمهر، کوچه ۱۸، پلاک ۷۵، واحد ۴",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 7, neighborhood: 7, agency: 1,
    street: "بلوار مهرویلا", alley: "کوچه ۱۲", plaque: "۹۰", unit: "۱", postal_code: "3145667890",
    latitude: "35.8150000", longitude: "50.9700000",
    full_text: "البرز، کرج، منطقه ۷، مهرویلا، بلوار مهرویلا، کوچه ۱۲، پلاک ۹۰، واحد ۱",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 8, neighborhood: 8, agency: 1,
    street: "خیابان اشتراکی", alley: "کوچه ۳", plaque: "۲۵", unit: "۲", postal_code: "3145678901",
    latitude: "35.8500000", longitude: "51.0150000",
    full_text: "البرز، کرج، منطقه ۸، اشتراکی، خیابان اشتراکی، کوچه ۳، پلاک ۲۵، واحد ۲",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 9, neighborhood: 9, agency: 1,
    street: "بلوار ساسانی", alley: "کوچه ۷", plaque: "۵۵", unit: "۳", postal_code: "3145689012",
    latitude: "35.8750000", longitude: "50.9950000",
    full_text: "البرز، کرج، منطقه ۹، ساسانی، بلوار ساسانی، کوچه ۷، پلاک ۵۵، واحد ۳",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 10, neighborhood: 10, agency: 1,
    street: "خیابان حصارک", alley: "کوچه ۲۰", plaque: "۱۱۰", unit: "۱", postal_code: "3145690123",
    latitude: "35.7800000", longitude: "50.9600000",
    full_text: "البرز، کرج، منطقه ۱۰، حصارک، خیابان حصارک، کوچه ۲۰، پلاک ۱۱۰، واحد ۱",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 11, neighborhood: 11, agency: 1,
    street: "خیابان باغستان", alley: "کوچه ۹", plaque: "۷۰", unit: "۲", postal_code: "3145701234",
    latitude: "35.8250000", longitude: "51.0050000",
    full_text: "البرز، کرج، منطقه ۳، باغستان، خیابان باغستان، کوچه ۹، پلاک ۷۰، واحد ۲",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 12, neighborhood: 12, agency: 1,
    street: "بلوار محمدشهر", alley: "کوچه ۱۴", plaque: "۳۵", unit: "۱", postal_code: "3145712345",
    latitude: "35.8400000", longitude: "51.0300000",
    full_text: "البرز، کرج، منطقه ۴، محمدشهر، بلوار محمدشهر، کوچه ۱۴، پلاک ۳۵، واحد ۱",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 13, neighborhood: 13, agency: 1,
    street: "خیابان فردیس", alley: "کوچه ۶", plaque: "۴۵", unit: "۳", postal_code: "3145723456",
    latitude: "35.8650000", longitude: "50.9850000",
    full_text: "البرز، کرج، منطقه ۵، فردیس، خیابان فردیس، کوچه ۶، پلاک ۴۵، واحد ۳",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 14, neighborhood: 14, agency: 1,
    street: "بلوار جهانشهر", alley: "کوچه ۱۱", plaque: "۸۰", unit: "۲", postal_code: "3145734567",
    latitude: "35.7950000", longitude: "50.9750000",
    full_text: "البرز، کرج، منطقه ۶، جهانشهر، بلوار جهانشهر، کوچه ۱۱، پلاک ۸۰، واحد ۲",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 15, neighborhood: 15, agency: 1,
    street: "خیابان سپاهدار", alley: "کوچه ۴", plaque: "۲۰", unit: "۱", postal_code: "3145745678",
    latitude: "35.8100000", longitude: "50.9550000",
    full_text: "البرز، کرج، منطقه ۷، سپاهدار، خیابان سپاهدار، کوچه ۴، پلاک ۲۰، واحد ۱",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 16, neighborhood: 16, agency: 1,
    street: "بلوار گلستان", alley: "کوچه ۱۶", plaque: "۵۰", unit: "۲", postal_code: "3145756789",
    latitude: "35.8350000", longitude: "50.9980000",
    full_text: "البرز، کرج، منطقه ۱، گلستان، بلوار گلستان، کوچه ۱۶، پلاک ۵۰، واحد ۲",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 17, neighborhood: 17, agency: 1,
    street: "بلوار امام خمینی", alley: "کوچه ۲", plaque: "۱۵", unit: "۱", postal_code: "3145767890",
    latitude: "35.8000000", longitude: "50.9600000",
    full_text: "البرز، کرج، منطقه ۲، بلوار امام، بلوار امام خمینی، کوچه ۲، پلاک ۱۵، واحد ۱",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 18, neighborhood: 18, agency: 1,
    street: "خیابان مشکین دشت", alley: "کوچه ۱۳", plaque: "۹۵", unit: "۳", postal_code: "3145778901",
    latitude: "35.8180000", longitude: "51.0200000",
    full_text: "البرز، کرج، منطقه ۳، مشکین دشت، خیابان مشکین دشت، کوچه ۱۳، پلاک ۹۵، واحد ۳",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
];