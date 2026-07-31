import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = () => api.get(API_ENDPOINTS.ACCOUNTS.AGENCIES.LIST.url);

const getById = (id) => api.get(API_ENDPOINTS.ACCOUNTS.AGENCIES.DETAIL(id).url);

const create = (data) => api.post(API_ENDPOINTS.ACCOUNTS.AGENCIES.CREATE.url, data);

const update = (id, data) => api.put(API_ENDPOINTS.ACCOUNTS.AGENCIES.UPDATE(id).url, data);

const agencyService = {
  getAll,
  getById,
  create,
  update,
};

export default agencyService;