import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) => api.get(API_ENDPOINTS.PROPERTY_STATUS_HISTORY.LIST.url, { params });

const getById = (id) => api.get(API_ENDPOINTS.PROPERTY_STATUS_HISTORY.DETAIL(id).url);

const propertyStatusHistoryService = {
  getAll,
  getById,
};

export default propertyStatusHistoryService;