import { API_ENDPOINTS } from "@/constants/apiEndpoints";

/**
 * Canonical location URLs + cascade field contract for forms/filters.
 *
 * ALWAYS import list URLs from here (or API_ENDPOINTS.LOCATIONS) —
 * never hardcode /api/locations/... (that path does not exist).
 *
 * Backend list endpoints do not filter by parent yet.
 * - FormRenderer asyncSource with ?province={id} will still return the full list
 *   unless the shared select component filters client-side.
 * - Prefer loading via locationService + filter* helpers when building custom UI.
 *
 * Parent FK keys on create payloads:
 *   City:        { name, province }
 *   District:    { name, city }
 *   Neighborhood:{ name, district }
 *   Address:     { neighborhood, street?, alley?, plaque?, unit?, postal_code?, latitude?, longitude?, full_text? }
 *                agency is set server-side from the authenticated user.
 */

const L = API_ENDPOINTS.LOCATIONS;

/** Raw list URLs — safe for asyncSource / filter endpoint fields */
export const LOCATION_LIST_URL = {
  provinces: L.PROVINCES.LIST.url, // /api/province/list/
  cities: L.CITIES.LIST.url, // /api/city/list/
  districts: L.DISTRICTS.LIST.url, // /api/district/
  neighborhoods: L.NEIGHBORHOODS.LIST.url, // /api/neighborhoods/
  addresses: L.ADDRESSES.LIST.url, // /api/addresses/
};

/**
 * Standard cascade field configs for Resource filters / FormRenderer.
 * optionLabel / optionValue match backend list serializers.
 */
export const LOCATION_CASCADE_FIELDS = {
  province: {
    key: "province",
    label: "استان",
    type: "select",
    endpoint: LOCATION_LIST_URL.provinces,
    asyncSource: LOCATION_LIST_URL.provinces,
    optionLabel: "name",
    optionValue: "id",
    displayField: "name",
  },
  city: {
    key: "city",
    label: "شهر",
    type: "select",
    endpoint: LOCATION_LIST_URL.cities,
    asyncSource: LOCATION_LIST_URL.cities,
    dependsOn: "province",
    depends_on: "province",
    optionLabel: "name",
    optionValue: "id",
    displayField: "name",
    /** Client-side: CityListSerializer exposes province as name string; FK id may be absent.
     *  When filtering client-side prefer objects that include numeric province/province_id.
     *  If only name is present, match is not possible without a province map.
     */
  },
  district: {
    key: "district",
    label: "منطقه",
    type: "select",
    endpoint: LOCATION_LIST_URL.districts,
    asyncSource: LOCATION_LIST_URL.districts,
    dependsOn: "city",
    depends_on: "city",
    optionLabel: "name",
    optionValue: "id",
    displayField: "name",
  },
  neighborhood: {
    key: "neighborhood",
    label: "محله",
    type: "select",
    endpoint: LOCATION_LIST_URL.neighborhoods,
    asyncSource: LOCATION_LIST_URL.neighborhoods,
    dependsOn: "district",
    depends_on: "district",
    optionLabel: "name",
    optionValue: "id",
    displayField: "name",
  },
  address: {
    key: "address",
    label: "آدرس",
    type: "search_select",
    endpoint: LOCATION_LIST_URL.addresses,
    asyncSource: LOCATION_LIST_URL.addresses,
    optionLabel: "full_text",
    optionValue: "id",
    displayField: "full_text",
    searchFields: ["full_text", "street", "alley"],
  },
};

/**
 * Ready-made advanced filter entries (drawer) for property-style lists.
 * Spread into *ADVANCED_FILTERS arrays.
 */
export const LOCATION_FILTER_ENTRIES = [
  {
    key: "province",
    label: "استان",
    type: "select",
    placement: "drawer",
    async: true,
    endpoint: LOCATION_LIST_URL.provinces,
    optionLabel: "name",
    optionValue: "id",
  },
  {
    key: "city",
    label: "شهر",
    type: "select",
    placement: "drawer",
    async: true,
    endpoint: LOCATION_LIST_URL.cities,
    depends_on: "province",
    optionLabel: "name",
    optionValue: "id",
  },
  {
    key: "district",
    label: "منطقه",
    type: "select",
    placement: "drawer",
    async: true,
    endpoint: LOCATION_LIST_URL.districts,
    depends_on: "city",
    optionLabel: "name",
    optionValue: "id",
  },
  {
    key: "neighborhood",
    label: "محله",
    type: "select",
    placement: "drawer",
    async: true,
    endpoint: LOCATION_LIST_URL.neighborhoods,
    depends_on: "district",
    optionLabel: "name",
    optionValue: "id",
  },
];

/**
 * Address detail fields for create/edit forms (after neighborhood is chosen).
 */
export const ADDRESS_DETAIL_FIELDS = [
  {
    key: "street",
    label: "خیابان",
    type: "text",
    required: false,
    span: 6,
  },
  {
    key: "alley",
    label: "کوچه",
    type: "text",
    required: false,
    span: 6,
  },
  {
    key: "plaque",
    label: "پلاک",
    type: "text",
    required: false,
    span: 4,
  },
  {
    key: "unit",
    label: "واحد",
    type: "text",
    required: false,
    span: 4,
  },
  {
    key: "postal_code",
    label: "کد پستی",
    type: "text",
    required: false,
    span: 4,
  },
  {
    key: "latitude",
    label: "عرض جغرافیایی",
    type: "number",
    required: false,
    span: 6,
  },
  {
    key: "longitude",
    label: "طول جغرافیایی",
    type: "number",
    required: false,
    span: 6,
  },
];
