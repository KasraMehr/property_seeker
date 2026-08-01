import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = () => api.get(API_ENDPOINTS.LOCATIONS.LIST.url);

const getProvinces = () => api.get(API_ENDPOINTS.LOCATIONS.PROVINCES.url);

const getCities = (provinceId) => api.get(API_ENDPOINTS.LOCATIONS.CITIES.url, {
  params: provinceId ? { province: provinceId } : {},
});

const getDistricts = (cityId) => api.get(API_ENDPOINTS.LOCATIONS.DISTRICTS.url, {
  params: cityId ? { city: cityId } : {},
});

const getNeighborhoods = (districtId) => api.get(API_ENDPOINTS.LOCATIONS.NEIGHBORHOODS.url, {
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