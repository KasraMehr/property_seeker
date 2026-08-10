import { MOCK_OWNERS } from "./mockOwners";
import { MOCK_USERS } from "./mockUsers";
import { MOCK_AGENCIES } from "./mockAgencies";
import { MOCK_ADDRESSES } from "./mockLocations";

// Property model: id, property_code, agency(FK), owner(FK), agent(FK), address(FK),
// title, property_type, deal_type, area, floor, total_floors, age, bedrooms, bathrooms,
// parking_count, storage_count, orientation, condition, description, price_per_meter,
// sale_price, mortgage_amount, deposit_amount, monthly_rent, status, create_by(FK User),
// created_at, updated_at

export const MOCK_PROPERTIES = [
  {
    id: 1, property_code: "PR-2026-000001",
    title: "آپارتمان ۱۲۰ متری گلشهر",
    deal_type: "sale", property_type: "APARTMENT", status: "available",
    area: 120, floor: 3, total_floors: 5, age: 5, bedrooms: 3, bathrooms: 2,
    parking_count: 2, storage_count: 1, orientation: "NORTH", condition: "EXCELLENT",
    description: "آپارتمان لوکس گلشهر با نور عالی",
    price_per_meter: 8500000, sale_price: 1020000000,
    mortgage_amount: null, deposit_amount: null, monthly_rent: null,
    agency: MOCK_AGENCIES[0], owner: MOCK_OWNERS[0], agent: MOCK_USERS[1],
    address: MOCK_ADDRESSES[0],
    create_by: MOCK_USERS[1],
    created_at: "2026-07-20T09:00:00Z", updated_at: "2026-07-20T09:00:00Z",
  },
  {
    id: 2, property_code: "PR-2026-000002",
    title: "آپارتمان ۹۰ متری مهرشهر",
    deal_type: "rent", property_type: "APARTMENT", status: "available",
    area: 90, floor: 2, total_floors: 4, age: 3, bedrooms: 2, bathrooms: 1,
    parking_count: 1, storage_count: 0, orientation: "SOUTH", condition: "GOOD",
    description: "آپارتمان نوساز مهرشهر",
    price_per_meter: null, sale_price: null,
    mortgage_amount: 300000000, deposit_amount: 300000000, monthly_rent: 10000000,
    agency: MOCK_AGENCIES[0], owner: MOCK_OWNERS[1], agent: MOCK_USERS[2],
    address: MOCK_ADDRESSES[1],
    create_by: MOCK_USERS[2],
    created_at: "2026-07-22T10:30:00Z", updated_at: "2026-07-22T10:30:00Z",
  },
  {
    id: 3, property_code: "PR-2026-000003",
    title: "ویلای ۳۰۰ متری عظیمیه",
    deal_type: "sale", property_type: "VILLA", status: "reserved",
    area: 300, floor: 1, total_floors: 2, age: 2, bedrooms: 4, bathrooms: 3,
    parking_count: 3, storage_count: 2, orientation: "EAST", condition: "EXCELLENT",
    description: "ویلای لوکس عظیمیه با استخر",
    price_per_meter: 15000000, sale_price: 4500000000,
    mortgage_amount: null, deposit_amount: null, monthly_rent: null,
    agency: MOCK_AGENCIES[0], owner: MOCK_OWNERS[2], agent: MOCK_USERS[1],
    address: MOCK_ADDRESSES[2],
    create_by: MOCK_USERS[1],
    created_at: "2026-07-25T14:00:00Z", updated_at: "2026-07-26T09:00:00Z",
  },
  {
    id: 4, property_code: "PR-2026-000004",
    title: "دفتر کار ۸۰ متری کرج نو",
    deal_type: "rent", property_type: "COMMERCIAL", status: "archived",
    area: 80, floor: 1, total_floors: 3, age: 8, bedrooms: 1, bathrooms: 1,
    parking_count: 1, storage_count: 0, orientation: "WEST", condition: "GOOD",
    description: "دفتر کار اداری کرج نو",
    price_per_meter: null, sale_price: null,
    mortgage_amount: 150000000, deposit_amount: 150000000, monthly_rent: 8000000,
    agency: MOCK_AGENCIES[0], owner: MOCK_OWNERS[0], agent: MOCK_USERS[2],
    address: MOCK_ADDRESSES[3],
    create_by: MOCK_USERS[2],
    created_at: "2026-07-27T08:00:00Z", updated_at: "2026-07-27T08:00:00Z",
  },
  {
    id: 5, property_code: "PR-2026-000005",
    title: "آپارتمان ۱۱۰ متری شاهین ویلا",
    deal_type: "mortgage", property_type: "APARTMENT", status: "available",
    area: 110, floor: 4, total_floors: 6, age: 10, bedrooms: 2, bathrooms: 2,
    parking_count: 1, storage_count: 1, orientation: "NORTH", condition: "AVERAGE",
    description: "آپارتمان شاهین ویلا نیاز به بازسازی",
    price_per_meter: null, sale_price: null,
    mortgage_amount: 500000000, deposit_amount: null, monthly_rent: null,
    agency: MOCK_AGENCIES[0], owner: MOCK_OWNERS[1], agent: MOCK_USERS[1],
    address: MOCK_ADDRESSES[4],
    create_by: MOCK_USERS[1],
    created_at: "2026-07-28T11:00:00Z", updated_at: "2026-07-28T11:00:00Z",
  },
];

/**
 * MOCK_PROPERTIES_LIST — matches PropertyListSerializer output
 * Fields: id, agency, property_code, title, owner (string), agent (string),
 *         created_by (string), city (string), property_type, deal_type,
 *         area, sale_price, monthly_rent, status
 */
export const MOCK_PROPERTIES_LIST = MOCK_PROPERTIES.map((p) => ({
  id: p.id,
  agency: p.agency?.id ?? p.agency,
  property_code: p.property_code,
  title: p.title,
  owner: p.owner?.full_name ?? p.owner,
  agent: p.agent?.full_name ?? p.agent,
  created_by: p.create_by?.full_name ?? p.create_by,
  city: p.address?.full_text?.split("،")[1]?.trim() || "کرج",
  property_type: p.property_type,
  deal_type: p.deal_type,
  area: p.area,
  sale_price: p.sale_price,
  monthly_rent: p.monthly_rent,
  status: p.status,
}));