import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const L = API_ENDPOINTS.LOCATIONS;

/**
 * locationService — single source of truth for locations API calls.
 *
 * Hierarchy: Province → City → District → Neighborhood → Address
 *
 * Notes aligned with backend:
 * - List endpoints return full collections (no reliable parent query filter yet).
 *   Cascading UI should filter client-side (e.g. cities by province id).
 * - Updates use PUT (PATCH also accepted by several detail views).
 * - Deletes are bulk-only: DELETE with body { ids: number[] }.
 * - City bulk-delete URL requires a path pk (unused by view); we pass ids[0].
 * - Address list/detail are agency-scoped on the backend.
 */

/* ─── Provinces ─── */
const getProvinces = (params = {}) => api.get(L.PROVINCES.LIST.url, { params });

const getProvinceById = (id) => api.get(L.PROVINCES.DETAIL(id).url);

const createProvince = (data) => api.post(L.PROVINCES.CREATE.url, data);

const updateProvince = (id, data) => api.put(L.PROVINCES.UPDATE(id).url, data);

const bulkDeleteProvinces = (ids) =>
  api.delete(L.PROVINCES.BULK_DELETE.url, { data: { ids } });

const deleteProvince = (id) => bulkDeleteProvinces([id]);

/* ─── Cities ─── */
const getCities = (params = {}) => api.get(L.CITIES.LIST.url, { params });

const getCityById = (id) => api.get(L.CITIES.DETAIL(id).url);

const createCity = (data) => api.post(L.CITIES.CREATE.url, data);

const updateCity = (id, data) => api.put(L.CITIES.UPDATE(id).url, data);

const bulkDeleteCities = (ids) => {
  if (!ids?.length) {
    return Promise.reject(new Error("حداقل یک شهر را انتخاب کنید."));
  }
  // Path pk is required by URL conf but ignored by the view
  return api.delete(L.CITIES.BULK_DELETE(ids[0]).url, { data: { ids } });
};

const deleteCity = (id) => bulkDeleteCities([id]);

/* ─── Districts (منطقه) ─── */
const getDistricts = (params = {}) => api.get(L.DISTRICTS.LIST.url, { params });

const getDistrictById = (id) => api.get(L.DISTRICTS.DETAIL(id).url);

const createDistrict = (data) => api.post(L.DISTRICTS.CREATE.url, data);

const updateDistrict = (id, data) => api.put(L.DISTRICTS.UPDATE(id).url, data);

const bulkDeleteDistricts = (ids) =>
  api.delete(L.DISTRICTS.BULK_DELETE.url, { data: { ids } });

const deleteDistrict = (id) => bulkDeleteDistricts([id]);

/* ─── Neighborhoods (محله) ─── */
const getNeighborhoods = (params = {}) =>
  api.get(L.NEIGHBORHOODS.LIST.url, { params });

const getNeighborhoodById = (id) => api.get(L.NEIGHBORHOODS.DETAIL(id).url);

const createNeighborhood = (data) => api.post(L.NEIGHBORHOODS.CREATE.url, data);

const updateNeighborhood = (id, data) =>
  api.put(L.NEIGHBORHOODS.UPDATE(id).url, data);

const bulkDeleteNeighborhoods = (ids) =>
  api.delete(L.NEIGHBORHOODS.BULK_DELETE.url, { data: { ids } });

const deleteNeighborhood = (id) => bulkDeleteNeighborhoods([id]);

/* ─── Addresses ─── */
const getAddresses = (params = {}) => api.get(L.ADDRESSES.LIST.url, { params });

const getAddressById = (id) => api.get(L.ADDRESSES.DETAIL(id).url);

const createAddress = (data) => api.post(L.ADDRESSES.CREATE.url, data);

const updateAddress = (id, data) => api.put(L.ADDRESSES.UPDATE(id).url, data);

const bulkDeleteAddresses = (ids) =>
  api.delete(L.ADDRESSES.BULK_DELETE.url, { data: { ids } });

const deleteAddress = (id) => bulkDeleteAddresses([id]);

/* ─── Response helpers (list endpoints return bare arrays) ─── */
const unwrapList = (res) => {
  const payload = res?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

/**
 * Client-side cascade helpers — use after fetching full lists.
 * Parent FKs on serializers:
 *   City.province (id) | list also exposes province as name string
 *   District.city (id) | city_name
 *   Neighborhood.district (id) | district_name, city_name
 *   Address.neighborhood (id) | neighborhood_name, district_name, city_name, province_name
 */
const filterCitiesByProvince = (cities, provinceId) => {
  if (provinceId == null || provinceId === "") return cities;
  const pid = Number(provinceId);
  return cities.filter(
    (c) => Number(c.province) === pid || Number(c.province_id) === pid,
  );
};

const filterDistrictsByCity = (districts, cityId) => {
  if (cityId == null || cityId === "") return districts;
  const cid = Number(cityId);
  return districts.filter(
    (d) => Number(d.city) === cid || Number(d.city_id) === cid,
  );
};

const filterNeighborhoodsByDistrict = (neighborhoods, districtId) => {
  if (districtId == null || districtId === "") return neighborhoods;
  const did = Number(districtId);
  return neighborhoods.filter(
    (n) => Number(n.district) === did || Number(n.district_id) === did,
  );
};

const filterAddressesByNeighborhood = (addresses, neighborhoodId) => {
  if (neighborhoodId == null || neighborhoodId === "") return addresses;
  const nid = Number(neighborhoodId);
  return addresses.filter(
    (a) => Number(a.neighborhood) === nid || Number(a.neighborhood_id) === nid,
  );
};

const locationService = {
  // Provinces
  getProvinces,
  getProvinceById,
  createProvince,
  updateProvince,
  deleteProvince,
  bulkDeleteProvinces,
  // Cities
  getCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
  bulkDeleteCities,
  // Districts
  getDistricts,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  bulkDeleteDistricts,
  // Neighborhoods
  getNeighborhoods,
  getNeighborhoodById,
  createNeighborhood,
  updateNeighborhood,
  deleteNeighborhood,
  bulkDeleteNeighborhoods,
  // Addresses
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  bulkDeleteAddresses,
  // Helpers
  unwrapList,
  filterCitiesByProvince,
  filterDistrictsByCity,
  filterNeighborhoodsByDistrict,
  filterAddressesByNeighborhood,
};

export default locationService;
