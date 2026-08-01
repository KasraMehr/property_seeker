// location hierarchy: province -> city -> district -> neighborhood
// focused on Karaj (Alborz province) for MVP demo data

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