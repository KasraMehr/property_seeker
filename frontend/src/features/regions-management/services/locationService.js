import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

/* ─── Provinces ─── */
const getProvinces = () => api.get(API_ENDPOINTS.LOCATIONS.PROVINCES.LIST.url);
const createProvince = (data) => api.post(API_ENDPOINTS.LOCATIONS.PROVINCES.CREATE.url, data);
const getProvinceById = (id) => api.get(API_ENDPOINTS.LOCATIONS.PROVINCES.DETAIL(id).url);
const updateProvince = (id, data) => api.put(API_ENDPOINTS.LOCATIONS.PROVINCES.UPDATE(id).url, data);
const deleteProvince = (id) => api.delete(API_ENDPOINTS.LOCATIONS.PROVINCES.DELETE(id).url);

/* ─── Cities ─── */
const getCities = (params = {}) =>
  api.get(API_ENDPOINTS.LOCATIONS.CITIES.LIST.url, { params });
const createCity = (data) => api.post(API_ENDPOINTS.LOCATIONS.CITIES.CREATE.url, data);
const getCityById = (id) => api.get(API_ENDPOINTS.LOCATIONS.CITIES.DETAIL(id).url);
const updateCity = (id, data) => api.put(API_ENDPOINTS.LOCATIONS.CITIES.UPDATE(id).url, data);
const deleteCity = (id) => api.delete(API_ENDPOINTS.LOCATIONS.CITIES.DELETE(id).url);

/* ─── Districts (REST pure: GET/POST same URL) ─── */
const getDistricts = (params = {}) =>
  api.get(API_ENDPOINTS.LOCATIONS.DISTRICTS.LIST.url, { params });
const createDistrict = (data) => api.post(API_ENDPOINTS.LOCATIONS.DISTRICTS.CREATE.url, data);
const getDistrictById = (id) => api.get(API_ENDPOINTS.LOCATIONS.DISTRICTS.DETAIL(id).url);
const updateDistrict = (id, data) => api.put(API_ENDPOINTS.LOCATIONS.DISTRICTS.UPDATE(id).url, data);
const deleteDistrict = (id) => api.delete(API_ENDPOINTS.LOCATIONS.DISTRICTS.DELETE(id).url);

/* ─── Neighborhoods (REST pure) ─── */
const getNeighborhoods = (params = {}) =>
  api.get(API_ENDPOINTS.LOCATIONS.NEIGHBORHOODS.LIST.url, { params });
const createNeighborhood = (data) => api.post(API_ENDPOINTS.LOCATIONS.NEIGHBORHOODS.CREATE.url, data);
const getNeighborhoodById = (id) => api.get(API_ENDPOINTS.LOCATIONS.NEIGHBORHOODS.DETAIL(id).url);
const updateNeighborhood = (id, data) => api.put(API_ENDPOINTS.LOCATIONS.NEIGHBORHOODS.UPDATE(id).url, data);
const deleteNeighborhood = (id) => api.delete(API_ENDPOINTS.LOCATIONS.NEIGHBORHOODS.DELETE(id).url);

/* ─── Addresses (REST pure) ─── */
const getAddresses = (params = {}) =>
  api.get(API_ENDPOINTS.LOCATIONS.ADDRESSES.LIST.url, { params });
const createAddress = (data) => api.post(API_ENDPOINTS.LOCATIONS.ADDRESSES.CREATE.url, data);
const getAddressById = (id) => api.get(API_ENDPOINTS.LOCATIONS.ADDRESSES.DETAIL(id).url);
const updateAddress = (id, data) => api.put(API_ENDPOINTS.LOCATIONS.ADDRESSES.UPDATE(id).url, data);
const deleteAddress = (id) => api.delete(API_ENDPOINTS.LOCATIONS.ADDRESSES.DELETE(id).url);

const locationService = {
  // Provinces
  getProvinces,
  createProvince,
  getProvinceById,
  updateProvince,
  deleteProvince,
  // Cities
  getCities,
  createCity,
  getCityById,
  updateCity,
  deleteCity,
  // Districts
  getDistricts,
  createDistrict,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
  // Neighborhoods
  getNeighborhoods,
  createNeighborhood,
  getNeighborhoodById,
  updateNeighborhood,
  deleteNeighborhood,
  // Addresses
  getAddresses,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
};

export default locationService;