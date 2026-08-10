import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) =>
  api.get(API_ENDPOINTS.CUSTOMERS.LIST.url, { params });

const getById = (id) =>
  api.get(API_ENDPOINTS.CUSTOMERS.DETAIL(id).url);

const create = (data) =>
  api.post(API_ENDPOINTS.CUSTOMERS.CREATE.url, data);

const update = (id, data) =>
  api.patch(API_ENDPOINTS.CUSTOMERS.UPDATE(id).url, data);

const remove = (id) =>
  api.delete(API_ENDPOINTS.CUSTOMERS.DELETE(id).url);

const customerService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default customerService;