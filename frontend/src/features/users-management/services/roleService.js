import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = () => api.get(API_ENDPOINTS.ACCOUNTS.ROLES.LIST.url);

const getById = (id) => api.get(API_ENDPOINTS.ACCOUNTS.ROLES.DETAIL(id).url);

const create = (data) => api.post(API_ENDPOINTS.ACCOUNTS.ROLES.CREATE.url, data);

const update = (id, data) => api.put(API_ENDPOINTS.ACCOUNTS.ROLES.UPDATE(id).url, data);

const getPermissions = () => api.get(API_ENDPOINTS.ACCOUNTS.PERMISSIONS.LIST.url);

const roleService = {
  getAll,
  getById,
  create,
  update,
  getPermissions,
};

export default roleService;