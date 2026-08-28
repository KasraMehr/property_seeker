import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) =>
  api.get(API_ENDPOINTS.CUSTOMER_PREFERENCES.LIST.url, { params });

const getById = (id) =>
  api.get(API_ENDPOINTS.CUSTOMER_PREFERENCES.DETAIL(id).url);

const create = (data) =>
  api.post(API_ENDPOINTS.CUSTOMER_PREFERENCES.CREATE.url, data);

const update = (id, data) =>
  api.put(API_ENDPOINTS.CUSTOMER_PREFERENCES.UPDATE(id).url, data);

const remove = (id) =>
  api.delete(API_ENDPOINTS.CUSTOMER_PREFERENCES.BULK_DELETE.url, {
    data: { ids: [id] },
  });

const bulkDelete = (ids) =>
  api.delete(API_ENDPOINTS.CUSTOMER_PREFERENCES.BULK_DELETE.url, {
    data: { ids },
  });

const customerPreferenceService = {
  getAll,
  getById,
  create,
  update,
  remove,
  bulkDelete,
};

export default customerPreferenceService;
