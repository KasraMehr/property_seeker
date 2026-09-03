import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) =>
  api.get(API_ENDPOINTS.CUSTOMERS.LIST.url, { params });

const getById = (id) =>
  api.get(API_ENDPOINTS.CUSTOMERS.DETAIL(id).url);

const create = (data) =>
  api.post(API_ENDPOINTS.CUSTOMERS.CREATE.url, data);

const update = (id, data) =>
  api.put(API_ENDPOINTS.CUSTOMERS.UPDATE(id).url, data);

const patch = (id, data) =>
  api.patch(API_ENDPOINTS.CUSTOMERS.UPDATE(id).url, data);

const remove = (id) =>
  api.delete(API_ENDPOINTS.CUSTOMERS.BULK_DELETE.url, {
    data: { ids: [id] },
  });

const bulkDelete = (ids) =>
  api.delete(API_ENDPOINTS.CUSTOMERS.BULK_DELETE.url, {
    data: { ids },
  });

const customerService = {
  getAll,
  getById,
  create,
  update,
  patch,
  remove,
  bulkDelete,
};

export default customerService;