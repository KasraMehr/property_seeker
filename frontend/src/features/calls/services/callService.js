import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) => api.get(API_ENDPOINTS.CRM.CALLS.LIST.url, { params });

const create = (data) => api.post(API_ENDPOINTS.CRM.CALLS.CREATE.url, data);

const callService = {
  getAll,
  create,
};

export default callService;