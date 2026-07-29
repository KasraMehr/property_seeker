import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = () => api.get(API_ENDPOINTS.ACCOUNTS.USERS.LIST.url);

const getById = (id) => api.get(API_ENDPOINTS.ACCOUNTS.USERS.DETAIL(id).url);

const create = (data) => api.post(API_ENDPOINTS.ACCOUNTS.USERS.CREATE.url, data);

const update = (id, data) => api.put(API_ENDPOINTS.ACCOUNTS.USERS.UPDATE(id).url, data);

const remove = (id) => api.delete(API_ENDPOINTS.ACCOUNTS.USERS.DELETE(id).url);

const userService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default userService;