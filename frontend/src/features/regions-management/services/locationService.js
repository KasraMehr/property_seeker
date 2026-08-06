import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = () => api.get(API_ENDPOINTS.LOCATIONS.LIST.url);

const getProvinces = () => api.get(API_ENDPOINTS.LOCATIONS.PROVINCES.url);

const getCities = (provinceId) =>
  api.get(API_ENDPOINTS.LOCATIONS.CITIES.url, {
    params: provinceId ? { province: provinceId } : {},
  });

/* ─── FIXED: getDistricts now accepts full params object ─── */
const getDistricts = (params = {}) => {
  const apiParams = typeof params === "object" && params !== null
    ? params
    : params ? { city: params } : {};
  return api.get(API_ENDPOINTS.LOCATIONS.DISTRICTS.url, {
    params: apiParams,
  });
};

const getNeighborhoods = (districtId) =>
  api.get(API_ENDPOINTS.LOCATIONS.NEIGHBORHOODS.url, {
    params: districtId ? { district: districtId } : {},
  });

const locationService = {
  getAll,
  getProvinces,
  getCities,
  getDistricts,
  getNeighborhoods,
};

export default locationService;