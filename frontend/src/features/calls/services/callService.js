import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

// Detail is read-only (GET only)
const getAll = (params = {}) =>
  api.get(API_ENDPOINTS.CRM.CALLS.LIST.url, { params });

const create = (data) => api.post(API_ENDPOINTS.CRM.CALLS.LIST.url, data);

const getById = (id) => api.get(API_ENDPOINTS.CRM.CALLS.DETAIL(id).url);

const callService = {
  getAll,
  create,
  getById,
};

export default callService;