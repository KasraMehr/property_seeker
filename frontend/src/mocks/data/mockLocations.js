// Province: id, name, created_at
export const MOCK_PROVINCES = [
  { id: 1, name: "البرز", created_at: "2026-01-01T00:00:00Z" },
  { id: 2, name: "تهران", created_at: "2026-01-01T00:00:00Z" },
];

// City: id, province(FK), name
export const MOCK_CITIES = [
  { id: 1, name: "کرج", province: MOCK_PROVINCES[0] },
  { id: 2, name: "ماهدشت", province: MOCK_PROVINCES[0] },
  { id: 3, name: "تهران", province: MOCK_PROVINCES[1] },
];

// District: id, city(FK), name
export const MOCK_DISTRICTS = [
  { id: 1, name: "منطقه ۱ کرج", city: MOCK_CITIES[0] },
  { id: 2, name: "منطقه ۲ کرج", city: MOCK_CITIES[0] },
  { id: 3, name: "منطقه ۳ کرج", city: MOCK_CITIES[0] },
  { id: 4, name: "منطقه ۴ کرج", city: MOCK_CITIES[0] },
  { id: 5, name: "منطقه ۵ کرج", city: MOCK_CITIES[0] },
];

// Neighborhood: id, district(FK), name
export const MOCK_NEIGHBORHOODS = [
  { id: 1, name: "گلشهر", district: MOCK_DISTRICTS[0] },
  { id: 2, name: "مهرشهر", district: MOCK_DISTRICTS[1] },
  { id: 3, name: "عظیمیه", district: MOCK_DISTRICTS[2] },
  { id: 4, name: "کرج نو", district: MOCK_DISTRICTS[3] },
  { id: 5, name: "شاهین ویلا", district: MOCK_DISTRICTS[4] },
];

// Address: id, neighborhood(FK), street, alley, plaque, unit, postal_code, latitude, longitude, full_text, created_at, updated_at
//  agency FK نداره توی بک‌اند!
export const MOCK_ADDRESSES = [
  {
    id: 1, neighborhood: MOCK_NEIGHBORHOODS[0],
    street: "خیابان گلشهر", alley: "کوچه ۱۵", plaque: "۴۲", unit: "۳", postal_code: "3145687412",
    latitude: "35.8325000", longitude: "50.9912000",
    full_text: "البرز، کرج، منطقه ۱، گلشهر، خیابان گلشهر، کوچه ۱۵، پلاک ۴۲، واحد ۳",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2, neighborhood: MOCK_NEIGHBORHOODS[1],
    street: "بلوار مهرشهر", alley: "کوچه ۸", plaque: "۱۲۵", unit: "۲", postal_code: "3145698523",
    latitude: "35.8050000", longitude: "50.9650000",
    full_text: "البرز، کرج، منطقه ۲، مهرشهر، بلوار مهرشهر، کوچه ۸، پلاک ۱۲۵، واحد ۲",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 3, neighborhood: MOCK_NEIGHBORHOODS[2],
    street: "خیابان عظیمیه", alley: "کوچه ۲۲", plaque: "۸۸", unit: "۵", postal_code: "3145612345",
    latitude: "35.8200000", longitude: "51.0100000",
    full_text: "البرز، کرج، منطقه ۳، عظیمیه، خیابان عظیمیه، کوچه ۲۲، پلاک ۸۸، واحد ۵",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 4, neighborhood: MOCK_NEIGHBORHOODS[3],
    street: "خیابان کرج نو", alley: "کوچه ۵", plaque: "۳۰", unit: "۱", postal_code: "3145632145",
    latitude: "35.8450000", longitude: "51.0250000",
    full_text: "البرز، کرج، منطقه ۴، کرج نو، خیابان کرج نو، کوچه ۵، پلاک ۳۰، واحد ۱",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 5, neighborhood: MOCK_NEIGHBORHOODS[4],
    street: "خیابان شاهین ویلا", alley: "کوچه ۱۰", plaque: "۶۰", unit: "۲", postal_code: "3145645678",
    latitude: "35.8600000", longitude: "51.0000000",
    full_text: "البرز، کرج، منطقه ۵، شاهین ویلا، خیابان شاهین ویلا، کوچه ۱۰، پلاک ۶۰، واحد ۲",
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  },
];