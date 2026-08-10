// NOTE: Clear

import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

// Define query strings for filters
const buildQueryString = (params) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      sp.append(key, value.join(","));
    } else if (value !== null && value !== undefined && value !== "") {
      sp.append(key, value);
    }
  });
  return sp.toString();
};

const getAll = (params = {}) => {
  const qs = buildQueryString(params);

  const url = qs
    ? `${API_ENDPOINTS.LISTINGS.LIST.url}?${qs}`
    : API_ENDPOINTS.LISTINGS.LIST.url;

  return api.get(url);
};

const getById = (id) => api.get(API_ENDPOINTS.LISTINGS.DETAIL(id).url); // const create = (data) => api.post(API_ENDPOINTS.LISTINGS.CREATE.url, data);


const listingService = {
  getAll,
  getById,
};

export default listingService;
